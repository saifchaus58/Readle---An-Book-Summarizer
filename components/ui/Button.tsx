import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative px-10 py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden";
  
  const variants = {
    primary: "bg-[#0F172A] text-white hover:bg-pink-600 hover:shadow-[0_20px_50px_-10px_rgba(219,39,119,0.3)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]",
    secondary: "bg-white text-[#0F172A] border border-gray-100 hover:border-pink-200 hover:text-pink-600 shadow-sm",
    outline: "bg-transparent border border-[#0F172A] text-[#0F172A] hover:bg-pink-50 hover:border-pink-500 hover:text-pink-600",
    ghost: "bg-transparent text-gray-400 hover:text-[#0F172A] hover:bg-white/50"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="tracking-widest">Distilling</span>
        </div>
      ) : children}
    </button>
  );
};