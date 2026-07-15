import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}

export default function Logo({ className = "w-8 h-8", size, onClick }: LogoProps) {
  const sizeStyle = size ? { width: size, height: size } : {};

  const ImgContent = (
    <img
      src="/Bg_logo.jpg"
      alt="YouVo Battleground Logo"
      className={`${className} shrink-0 object-cover`}
      style={sizeStyle}
    />
  );

  return onClick ? (
    <button onClick={onClick} className="cursor-pointer focus-visible:ring-2 focus-visible:ring-violet-500 focus:outline-none flex items-center justify-center">
      {ImgContent}
    </button>
  ) : (
    <a href="/" className="cursor-pointer focus-visible:ring-2 focus-visible:ring-violet-500 focus:outline-none flex items-center justify-center">
      {ImgContent}
    </a>
  );
}
