import { Scale, Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
  light?: boolean;
}

export const Logo = ({ className = '', size = 24, light = false }: LogoProps) => {
  const textColor = light ? 'text-white' : 'text-slate-900';
  const subtitleColor = light ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <Scale size={size} className="text-emerald-500" />
        <Sparkles 
          size={size * 0.5} 
          className="text-amber-400 absolute -top-2 -right-3" 
          strokeWidth={2.5}
        />
      </div>
      <div className="flex flex-col justify-center">
        <span 
          className={`font-extrabold tracking-tight ${textColor}`} 
          style={{ fontSize: size * 0.9, lineHeight: 1 }}
        >
          jurun<span className="text-emerald-500">.ai</span>
        </span>
        <span 
          className={`font-medium tracking-wide ${subtitleColor} uppercase`} 
          style={{ fontSize: size * 0.35, lineHeight: 1, marginTop: 4 }}
        >
          a Justiça tá AI
        </span>
      </div>
    </div>
  );
};
