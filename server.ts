import express from "express";
import path from "path";

import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // Helper to get or verify Gemini AI Client
  const getAiClient = (req?: express.Request) => {
    const key = (req?.headers?.["x-api-key"] || req?.headers?.["x-gemini-key"] || process.env.GEMINI_API_KEY);
    if (!key || typeof key !== "string" || !key.trim()) {
      throw new Error("Gemini API Key is not defined. Please add it to secrets or supply your personal key in the settings panel in the UI.");
    }
    return new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Self-healing Gemini call with automatic fallback list to bypass 503/429 errors
  async function callGeminiWithFallback(
    getAiClientFn: () => any,
    preferredModel: string,
    prompt: string,
    systemInstruction: string,
    temperature: number,
    responseMimeType?: string,
    responseSchema?: any,
    attachments: any[] = []
  ): Promise<string> {
    // Map any deprecated model names or common aliases
    let activePreferred = preferredModel;
    if (preferredModel === "gemini-3.5-flash") {
      activePreferred = "gemini-3.5-flash";
    } else if (preferredModel === "gemini-3.1-pro-preview" || preferredModel === "gemini-2.5-pro") {
      activePreferred = "gemini-3.1-pro-preview";
    } else if (preferredModel === "gemini-3.1-flash-lite") {
      activePreferred = "gemini-3.1-flash-lite";
    } else {
      activePreferred = "gemini-3.5-flash"; // Default general model
    }

    const modelsToTry = [activePreferred];
    const fallbackList = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
    for (const m of fallbackList) {
      if (!modelsToTry.includes(m)) {
        modelsToTry.push(m);
      }
    }

    let lastError: any = null;
    for (const currentModel of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts) {
        try {
          console.log(`[Gemini Router] Attempting call with model: ${currentModel} (Attempt ${attempts + 1}/${maxAttempts})`);
          const ai = getAiClientFn();
          
          const config: any = {
            systemInstruction,
            temperature,
          };
          
          if (responseMimeType) {
            config.responseMimeType = responseMimeType;
          }
          if (responseSchema) {
            config.responseSchema = responseSchema;
          }

          const parts: any[] = [];
          if (attachments && attachments.length > 0) {
            attachments.forEach((att) => {
              if (att.base64) {
                const match = att.base64.match(/^data:(.*);base64,(.*)$/);
                if (match) {
                  parts.push({
                    inlineData: {
                      data: match[2],
                      mimeType: match[1]
                    }
                  });
                }
              }
            });
          }
          parts.push(prompt);

          const response = await ai.models.generateContent({
            model: currentModel,
            contents: parts,
            config,
          });

          if (response && response.text) {
            console.log(`[Gemini Router] Success using model: ${currentModel}`);
            return response.text;
          }
          throw new Error(`Empty response from model: ${currentModel}`);
        } catch (err: any) {
          attempts++;
          const errMsg = (err.message || "").toLowerCase();
          lastError = err;
          
          // If it is a credentials/auth error, fail immediately as retrying won't help
          if (errMsg.includes("api key") || errMsg.includes("invalid key") || errMsg.includes("unauthorized") || errMsg.includes("key is not defined")) {
            throw err;
          }

          // Handle rate limit/quota errors (429 / Resource Exhausted)
          if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit")) {
            if (attempts < maxAttempts) {
              const delay = attempts * 2000; // 2s, 4s backoff
              console.warn(`[Gemini Router Rate Limit] Hit 429 rate limit with model ${currentModel}. Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue; // Retry same model
            }
          }

          // For any other error, or if we exhausted retries, break loop to try fallback models
          console.warn(`[Gemini Router Warning] Failed call with model ${currentModel}:`, errMsg);
          break;
        }
      }
    }

    // Check if the final failure was due to rate limits or quota exhaustion
    const lastErrMsg = (lastError?.message || "").toLowerCase();
    if (lastErrMsg.includes("quota") || lastErrMsg.includes("429") || lastErrMsg.includes("resource_exhausted") || lastErrMsg.includes("limit")) {
      throw new Error(
        "Google Gemini API Free Tier Quota Exceeded (429). The developer API key has reached its rate limit or daily limit. " +
        "Please configure your own personal API key in the 'Set API Keys' panel in the top-right corner of the header " +
        "to bypass this rate limit and continue running unlimited high-speed simulations!"
      );
    }

    throw lastError || new Error("All Gemini models failed to respond due to high demand.");
  }

  // Helper for OpenAI API calls
  async function callOpenAI(
    apiKey: string,
    model: string,
    prompt: string,
    systemInstruction: string,
    temperature: number
  ): Promise<string> {
    let openAIModel = "gpt-4o-mini";
    if (model === "gpt-4o") {
      openAIModel = "gpt-4o";
    } else if (model === "o1-mini") {
      openAIModel = "o1-mini";
    }

    console.log(`[OpenAI Router] Calling model: ${openAIModel}`);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: openAIModel,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  // Helper for Anthropic API calls
  async function callAnthropic(
    apiKey: string,
    model: string,
    prompt: string,
    systemInstruction: string,
    temperature: number
  ): Promise<string> {
    let anthropicModel = "claude-3-5-haiku-latest";
    if (model === "claude-3-5-sonnet") {
      anthropicModel = "claude-3-5-sonnet-latest";
    } else if (model === "claude-3-opus") {
      anthropicModel = "claude-3-opus-20240229";
    }

    console.log(`[Anthropic Router] Calling model: ${anthropicModel}`);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: anthropicModel,
        max_tokens: 1024,
        system: systemInstruction,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
    }

    const data: any = await response.json();
    return data.content?.[0]?.text || "";
  }

  // Helper for Groq API calls
  async function callGroq(
    apiKey: string,
    model: string,
    prompt: string,
    systemInstruction: string,
    temperature: number
  ): Promise<string> {
    let groqModel = "llama-3.1-8b-instant";
    if (model === "llama-3-3-70b" || model === "llama-3-3-70b-versatile" || model.includes("llama-3-3") || model.includes("70b")) {
      groqModel = "llama-3.3-70b-versatile";
    } else if (model.includes("llama-3-1") || model.includes("8b")) {
      groqModel = "llama-3.1-8b-instant";
    } else if (model.includes("gemma") || model.includes("9b")) {
      groqModel = "gemma2-9b-it";
    } else if (model.includes("mixtral") || model.includes("8x7b")) {
      // fallback for decommissioned mixtral model
      console.log(`[Groq Router Warning] Mixtral is decommissioned. Redirecting to llama-3.1-8b-instant.`);
      groqModel = "llama-3.1-8b-instant";
    }

    console.log(`[Groq Router] Calling model: ${groqModel}`);
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errorText}`);
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  // Helper for OpenRouter API calls
  async function callOpenRouter(
    apiKey: string,
    model: string,
    prompt: string,
    systemInstruction: string,
    temperature: number
  ): Promise<string> {
    let orModel = "google/gemini-2.5-flash";
    if (model === "deepseek-v3") {
      orModel = "deepseek/deepseek-chat";
    } else if (model === "command-r-plus") {
      orModel = "cohere/command-r-plus";
    }

    console.log(`[OpenRouter Router] Calling model: ${orModel}`);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ai.studio/build",
        "X-Title": "YouVo Battleground"
      },
      body: JSON.stringify({
        model: orModel,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  // API - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API - Validate API Key
  app.post("/api/keys/validate", async (req, res) => {
    const { provider, apiKey } = req.body;
    if (!provider || !apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return res.status(400).json({ valid: false, message: "Missing provider or apiKey" });
    }

    const trimmedKey = apiKey.trim();

    try {
      if (provider === "Google AI (Gemini)") {
        const ai = new GoogleGenAI({ apiKey: trimmedKey });
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: "Ping",
          config: { maxOutputTokens: 5 }
        });
        if (response && response.text) {
          return res.json({ valid: true, message: "Gemini key is valid and active!" });
        }
        return res.json({ valid: false, message: "Empty response from Gemini. Key might be restricted." });
      }

      if (provider === "OpenAI") {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${trimmedKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 5
          })
        });
        if (response.ok) {
          return res.json({ valid: true, message: "OpenAI key is valid and active!" });
        }
        const errText = await response.text();
        let cleanErr = errText;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error && parsed.error.message) {
            cleanErr = parsed.error.message;
          }
        } catch (_) {}
        return res.json({ valid: false, message: `OpenAI rejected the key: ${cleanErr}` });
      }

      if (provider === "Anthropic") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": trimmedKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-latest",
            max_tokens: 5,
            messages: [{ role: "user", content: "Ping" }]
          })
        });
        if (response.ok) {
          return res.json({ valid: true, message: "Anthropic key is valid and active!" });
        }
        const errText = await response.text();
        let cleanErr = errText;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error && parsed.error.message) {
            cleanErr = parsed.error.message;
          }
        } catch (_) {}
        return res.json({ valid: false, message: `Anthropic rejected the key: ${cleanErr}` });
      }

      if (provider === "Groq") {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${trimmedKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 5
          })
        });
        if (response.ok) {
          return res.json({ valid: true, message: "Groq key is valid and active!" });
        }
        const errText = await response.text();
        let cleanErr = errText;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error && parsed.error.message) {
            cleanErr = parsed.error.message;
          }
        } catch (_) {}
        return res.json({ valid: false, message: `Groq rejected the key: ${cleanErr}` });
      }

      if (provider === "OpenRouter") {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${trimmedKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 5
          })
        });
        if (response.ok) {
          return res.json({ valid: true, message: "OpenRouter key is valid and active!" });
        }
        const errText = await response.text();
        let cleanErr = errText;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error && parsed.error.message) {
            cleanErr = parsed.error.message;
          }
        } catch (_) {}
        return res.json({ valid: false, message: `OpenRouter rejected the key: ${cleanErr}` });
      }

      return res.status(400).json({ valid: false, message: `Unsupported provider: ${provider}` });
    } catch (err: any) {
      console.error("Key validation error:", err);
      return res.json({ valid: false, message: err.message || "Failed to make test request" });
    }
  });

  // API - Generate single agent response in debate
  app.post("/api/debate/next-turn", async (req, res) => {
    try {
      const { topic, speaker, allSpeakers, turns, userInterventions, currentRound, model = "gemini-3.5-flash", attachments = [] } = req.body;

      if (!topic || !speaker || !allSpeakers) {
        return res.status(400).json({ error: "Missing required fields (topic, speaker, allSpeakers)" });
      }

      const systemInstruction = `You are ${speaker.name}, a panelist participating in an expert research and decision debate.
Your background and persona: ${speaker.persona}.
You must always stay in character. Speak with your persona's distinctive voice, professional lexicon, technical jargon, inherent biases, and pragmatic perspective.
The research topic under debate is: '${topic}'
Your fellow panelists are:
${allSpeakers.filter((s: any) => s.name !== speaker.name).map((s: any) => `- ${s.name}: ${s.persona}`).join('\n')}

Guidelines:
1. Provide an extremely detailed, exhaustive, and professional contribution (approximately 150-250 words) with deep insights, specific technical or business references, and highly structured logical arguments. Do NOT make it brief or summarized; explain the complete reasoning and structural foundation of your arguments.
2. Address points raised by other panelists in previous rounds if applicable, defending your stance or challenging theirs with deep evidence, logic, or rhetorical counters.
3. If there are user or moderator interventions, pay close attention to them and pivot or address them if relevant.
4. Do not start with empty introductions like 'Hi everyone', 'Hello colleagues', or 'As a financial analyst...'. Jump straight into your substantive argument or critique.
5. Speak directly in the first person. Do not write script-like formats. Just write your direct statement.`;

      // Format past turns for context
      const formattedTurns = turns && turns.length > 0 
        ? turns.map((t: any) => `[Round ${t.round}] Panelist ${t.speakerName} said:\n"${t.message}"`).join('\n\n')
        : "No debate rounds have occurred yet. This is the opening statement of the debate.";

      const formattedInterventions = userInterventions && userInterventions.length > 0
        ? `\nActive Moderator/Audience Interventions to address:\n${userInterventions.map((i: any) => `- [Round ${i.round}] ${i.message}`).join('\n')}\n`
        : "";

      const prompt = `Here is the current history of the debate:\n${formattedTurns}\n${formattedInterventions}
It is now your turn in Round ${currentRound}. Write your statement or response. Stay fully in character as ${speaker.name}.`;

      // Extract custom provider keys from headers
      const customOpenAIKey = req.headers["x-openai-key"];
      const customAnthropicKey = req.headers["x-anthropic-key"];
      const customGroqKey = req.headers["x-groq-key"];
      const customOpenRouterKey = req.headers["x-openrouter-key"];
      const provider = speaker.provider;

      let messageText = "";

      // Route to correct provider API — each provider requires its own API key
      if (provider === "OpenAI") {
        if (!customOpenAIKey || typeof customOpenAIKey !== "string" || !customOpenAIKey.trim()) {
          return res.status(400).json({ error: "An OpenAI API key is required to use GPT models. Please add your key in the Settings panel." });
        }
        messageText = await callOpenAI(customOpenAIKey, model, prompt, systemInstruction, 0.8);
      } else if (provider === "Anthropic") {
        if (!customAnthropicKey || typeof customAnthropicKey !== "string" || !customAnthropicKey.trim()) {
          return res.status(400).json({ error: "An Anthropic API key is required to use Claude models. Please add your key in the Settings panel." });
        }
        messageText = await callAnthropic(customAnthropicKey, model, prompt, systemInstruction, 0.8);
      } else if (provider === "Groq") {
        if (!customGroqKey || typeof customGroqKey !== "string" || !customGroqKey.trim()) {
          return res.status(400).json({ error: "A Groq API key is required to use Groq models. Please add your key in the Settings panel." });
        }
        messageText = await callGroq(customGroqKey, model, prompt, systemInstruction, 0.8);
      } else if (provider === "OpenRouter") {
        if (!customOpenRouterKey || typeof customOpenRouterKey !== "string" || !customOpenRouterKey.trim()) {
          return res.status(400).json({ error: "An OpenRouter API key is required to use OpenRouter models. Please add your key in the Settings panel." });
        }
        messageText = await callOpenRouter(customOpenRouterKey, model, prompt, systemInstruction, 0.8);
      } else {
        // Google AI (Gemini) — use the user's key or server env key
        messageText = await callGeminiWithFallback(
          () => getAiClient(req),
          model,
          prompt,
          systemInstruction,
          0.8,
          undefined,
          undefined,
          attachments
        );
      }

      res.json({ message: messageText });
    } catch (error: any) {
      console.error("[next-turn] Error generating debate turn:", error.message || error);
      res.status(500).json({ error: error.message || "An error occurred during debate turn generation" });
    }
  });

  // API - Synthesize the full debate consensus report
  app.post("/api/debate/synthesize", async (req, res) => {
    try {
      const { topic, turns, allSpeakers, model = "gemini-3.5-flash" } = req.body;

      if (!topic || !turns || !allSpeakers) {
        return res.status(400).json({ error: "Missing required fields (topic, turns, allSpeakers)" });
      }

      const systemInstruction = `You are an elite, highly objective research synthesizer and decision-support moderator.
Your job is to analyze a multi-agent debate transcript on a complex topic and produce a highly structured, authoritative consensus report and final decision proposal.`;

      const formattedSpeakers = allSpeakers.map((s: any) => `- ${s.name}: ${s.persona}`).join('\n');
      const formattedTranscript = turns.map((t: any) => `[Round ${t.round}] ${t.speakerName} says:\n"${t.message}"`).join('\n\n');

      const prompt = `The panel debated on the topic: '${topic}'
Here are the profiles of the expert panelists:
${formattedSpeakers}

Here is the complete debate transcript:
${formattedTranscript}

Analyze this debate and produce a comprehensive, structured consensus report.
Your output must be in JSON format matching the specified schema. 

CRITICAL REQUIREMENTS:
1. **NO MODEL NAMES**: In the final synthesis report (especially the 'finalVerdict', 'executiveSummary', 'keyAgreements', 'keyDisagreements', and the titles/descriptions of 'actionSteps'), you MUST NOT refer to any AI model brand names (such as Gemini, Llama, Claude, GPT, OpenAI, Anthropic, Groq, etc.). Do not say things like 'Gemini recommends' or 'as Llama suggested'. Instead, speak strictly in terms of the technical approaches discussed (e.g. 'the cloud-assisted approach', 'the open-source/self-hosted strategy', 'the expert panel', 'the consensus view').
2. **HIGHLY DETAILED & DEEP TIMELINE TOPICS**: Under 'actionSteps' (the roadmap), you MUST provide rich, in-depth detail. If the topic is a roadmap or learning plan (e.g., 'learn machine learning in 3 months'), Phase 1 (e.g. Month 1) and other early phases MUST list specific, granular topics to learn, concrete practical exercises, core libraries (e.g., pandas, numpy, scikit-learn), and exact timelines so that the user understands precisely what to study and do. Do not summarize or keep it high-level. 
3. **EASY-TO-UNDERSTAND STRUCTURED FORMATTING**: The 'description' of each action step must use clean Markdown formatting (such as bullet points, numbered sub-steps, or bold text) to be extremely readable and easy to understand. Do not return a dense, unformatted block of text. Use bullet points (e.g., '- **Topic**: Description') inside the description to break down topics systematically.
4. **NUANCED SYNTHESIS**: Make sure the 'finalVerdict' represents a highly intelligent, nuanced synthesis that chooses a clear, optimal path forward while addressing the valid trade-offs raised by dissenting panelists.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          executiveSummary: {
            type: Type.STRING,
            description: "A concise, highly polished 2-3 sentence overview of the debate, the major tensions, and where the discussion landed."
          },
          consensusScore: {
            type: Type.INTEGER,
            description: "A number from 0 to 100 representing the degree of alignment or shared ground reached by the panel (0 = total gridlock, 100 = perfect unanimity)."
          },
          keyAgreements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-4 core points on which the panelists aligned or found common ground."
          },
          keyDisagreements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-4 primary points of unresolved tension, conflicting priorities, or fundamental disagreement."
          },
          actionSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "A short, highly focused, action-oriented title for this step/recommendation."
                },
                phase: {
                  type: Type.STRING,
                  description: "The chronological phase or timeline (e.g., 'Immediate', 'Weeks 1-2', 'Months 1-3', 'Long-term')."
                },
                description: {
                  type: Type.STRING,
                  description: "An extremely detailed, technical, and concrete paragraph explaining exactly how to implement this recommendation, what tools/technologies to consider, and specific considerations."
                },
                priority: {
                  type: Type.STRING,
                  description: "Priority rating for this action step: 'High', 'Medium', or 'Low'."
                }
              },
              required: ["title", "phase", "description", "priority"]
            },
            description: "3-5 highly detailed, structured roadmap steps containing specific timeline phases, importance priorities, and deep technical implementation details."
          },
          finalVerdict: {
            type: Type.STRING,
            description: "A clear, definitive final recommendation/decision that synthesizes the collective intelligence of the debate into a single recommended path forward, detailing why it was chosen."
          },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 critical advantages, benefits, or strong positive arguments for the final verdict path forward."
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 critical disadvantages, risks, challenges, or negative factors of the final verdict path forward."
          },
          modelPositions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                modelName: {
                  type: Type.STRING,
                  description: "The name of the AI model (e.g. Gemini, Grok, GPT-4o, Claude)."
                },
                coreAnswer: {
                  type: Type.STRING,
                  description: "A concise summary of this model's final individual stand or core answer on the topic after the debate rounds."
                }
              },
              required: ["modelName", "coreAnswer"]
            },
            description: "The concise final individual stands or answers of each participating AI model (e.g., Gemini's answer, Grok's answer, etc.)."
          }
        },
        required: ["executiveSummary", "consensusScore", "keyAgreements", "keyDisagreements", "actionSteps", "finalVerdict", "pros", "cons", "modelPositions"]
      };

      const resultText = await callGeminiWithFallback(
        () => getAiClient(req),
        model,
        prompt,
        systemInstruction,
        0.3,
        "application/json",
        schema
      );

      let cleanResult = resultText.trim();
      if (cleanResult.startsWith("```")) {
        cleanResult = cleanResult.replace(/^```(?:json)?\s*/i, "");
        cleanResult = cleanResult.replace(/\s*```$/, "");
      }

      const report = JSON.parse(cleanResult);
      res.json(report);
    } catch (error: any) {
      console.error("[synthesize] Error generating consensus report:", error.message || error);
      res.status(500).json({ error: error.message || "An error occurred during synthesis" });
    }
  });

  // API - Follow-up chat discussion after consensus
  app.post("/api/debate/followup", async (req, res) => {
    try {
      const { topic, report, history, message, attachments, speakers } = req.body;

      if (!topic || !report || !message) {
        return res.status(400).json({ error: "Missing required fields (topic, report, message)" });
      }

      // Extract custom provider keys from headers
      const customOpenAIKey = req.headers["x-openai-key"];
      const customAnthropicKey = req.headers["x-anthropic-key"];
      const customGroqKey = req.headers["x-groq-key"];
      const customOpenRouterKey = req.headers["x-openrouter-key"];

      // Generate brief contributions from the active session's selected speakers in parallel
      let speakerResponses: { speakerName: string; speakerRole: string; response: string }[] = [];
      if (speakers && Array.isArray(speakers) && speakers.length > 0) {
        const speakerPromises = speakers.map(async (speaker: any) => {
          const speakerSystemInstruction = `You are ${speaker.name}, a panelist participating in an expert research and decision debate.
Your background and persona: ${speaker.persona}.
You must always stay in character. Speak with your persona's distinctive voice, professional lexicon, technical jargon, inherent biases, and pragmatic perspective.
The research topic under debate was: '${topic}'
The consensus report is as follows:
- Executive Summary: ${report.executiveSummary}
- Final Verdict: ${report.finalVerdict}`;

          const speakerPrompt = `The consensus panel has completed its main debate.
The user has now asked this follow-up question/comment about our consensus or topic:
"${message}"

Write a brief, direct, character-true professional response to this question from your specific perspective (max 120 words). Speak directly in the first person. Do NOT write script-like formats. Just write your direct statement.`;

          const provider = speaker.provider;
          let responseText = "";

          try {
            if (provider === "OpenAI") {
              if (!customOpenAIKey || typeof customOpenAIKey !== "string" || !customOpenAIKey.trim()) {
                throw new Error(`OpenAI API key is required for speaker ${speaker.name}. Please add your key in the Settings panel.`);
              }
              responseText = await callOpenAI(customOpenAIKey, speaker.id, speakerPrompt, speakerSystemInstruction, 0.8);
            } else if (provider === "Anthropic") {
              if (!customAnthropicKey || typeof customAnthropicKey !== "string" || !customAnthropicKey.trim()) {
                throw new Error(`Anthropic API key is required for speaker ${speaker.name}. Please add your key in the Settings panel.`);
              }
              responseText = await callAnthropic(customAnthropicKey, speaker.id, speakerPrompt, speakerSystemInstruction, 0.8);
            } else if (provider === "Groq") {
              if (!customGroqKey || typeof customGroqKey !== "string" || !customGroqKey.trim()) {
                throw new Error(`Groq API key is required for speaker ${speaker.name}. Please add your key in the Settings panel.`);
              }
              responseText = await callGroq(customGroqKey, speaker.id, speakerPrompt, speakerSystemInstruction, 0.8);
            } else if (provider === "OpenRouter") {
              if (!customOpenRouterKey || typeof customOpenRouterKey !== "string" || !customOpenRouterKey.trim()) {
                throw new Error(`OpenRouter API key is required for speaker ${speaker.name}. Please add your key in the Settings panel.`);
              }
              responseText = await callOpenRouter(customOpenRouterKey, speaker.id, speakerPrompt, speakerSystemInstruction, 0.8);
            } else {
              // Google AI (Gemini)
              responseText = await callGeminiWithFallback(
                () => getAiClient(req),
                "gemini-3.5-flash",
                speakerPrompt,
                speakerSystemInstruction,
                0.8,
                undefined,
                undefined,
                attachments || []
              );
            }
          } catch (e: any) {
            console.error(`Failed call for speaker ${speaker.name}:`, e);
            throw e;
          }

          return {
            speakerName: speaker.name,
            speakerRole: speaker.role,
            response: responseText
          };
        });

        speakerResponses = await Promise.all(speakerPromises);
      }

      const systemInstruction = `You are the elite AI Moderator and synthesized consensus voice of the expert panel.
You are responding to a user's follow-up question or discussion prompt about the final consensus report, and you have received direct background input from each of the selected panel experts.
The original debate topic was: '${topic}'
The consensus report is as follows:
- Executive Summary: ${report.executiveSummary}
- Final Verdict: ${report.finalVerdict}
- Agreements: ${(report.keyAgreements || []).join("; ")}
- Disagreements: ${(report.keyDisagreements || []).join("; ")}

Guidelines:
1. Speak as the objective, synthesized moderator representing the unified consensus of the panel. Use a supportive, professional, and insight-driven tone.
2. Provide direct, actionable, and comprehensive answers. Synthesize the expert inputs beautifully.
3. Absolutely NO model names in your own response text (e.g. Gemini, GPT, Claude, Llama). Speak in terms of the expert's perspectives or structural/logical methodologies.
4. Keep the response formatted in clean Markdown so that it renders beautifully for the user.`;

      // Format past follow-up discussion history if any
      const formattedHistory = history && history.length > 0
        ? history.map((h: any) => `${h.role === "user" ? "User" : "Synthesizer"}: ${h.content}`).join("\n\n")
        : "No follow-up messages have occurred yet.";

      let prompt = `Here is the history of the follow-up discussion:\n${formattedHistory}\n\n`;

      if (speakerResponses.length > 0) {
        prompt += `Here are the direct background statements and expert answers from our panel experts regarding the user's question:\n\n`;
        speakerResponses.forEach(sr => {
          prompt += `### ${sr.speakerName} (${sr.speakerRole}):\n"${sr.response}"\n\n`;
        });
      }

      prompt += `User Question: ${message}\n\nBased on the consensus report and the expert background insights above, write the final, synthesized reply. Keep it clear, deeply informative, cohesive, and professional. Use markdown.`;

      const resultText = await callGeminiWithFallback(
        () => getAiClient(req),
        "gemini-3.5-flash",
        prompt,
        systemInstruction,
        0.7,
        undefined,
        undefined,
        attachments || []
      );

      res.json({ message: resultText });
    } catch (error: any) {
      console.error("[followup] Error in follow-up chat:", error.message || error);
      res.status(500).json({ error: error.message || "An error occurred during follow-up chat" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
