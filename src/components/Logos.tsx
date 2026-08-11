import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  lightText?: boolean;
}

/**
/ Logo Yayasan Pesantren Cipasung
/ Vector recreation based on uploaded official logo (Gold Dome, Quran, Emerald Base)
*/
export const LogoYayasan: React.FC<LogoProps> = (props) => {
  return <LogoSmk {...props} />;
};

/**
 * Logo Official SMK Islam Cipasung
 * Blue Pentagon Emblem with Gear, Book, Torch, and Gold Accents
 */
export const LogoSmk: React.FC<LogoProps> = ({
  className = '',
  size = 44,
  showText = true,
  lightText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="smkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="torchGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Outer Dark Frame / Pentagon Shield */}
          <polygon points="50,3 97,37 79,97 21,97 3,37" fill="#020617" stroke="#0f172a" strokeWidth="2" />
          
          {/* Main Royal Blue Pentagon */}
          <polygon points="50,6 94,38 77,94 23,94 6,38" fill="url(#smkBlue)" stroke="url(#goldBorder)" strokeWidth="2.5" />

          {/* Outer Arc Curved Paths for Text */}
          <path id="topTextArc" d="M 18,38 A 38,38 0 0,1 82,38" fill="none" />
          <path id="bottomTextArc" d="M 23,88 A 36,36 0 0,0 77,88" fill="none" />

          {/* Top Arc Text: SMK ISLAM CIPASUNG */}
          <text fontSize="6.8" fontWeight="900" fill="#ffffff" letterSpacing="0.4">
            <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
              SMK ISLAM CIPASUNG
            </textPath>
          </text>

          {/* Bottom Arc Text: SINGAPARNA - TASIKMALAYA */}
          <text fontSize="5.5" fontWeight="800" fill="#fef08a" letterSpacing="0.2">
            <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle">
              SINGAPARNA - TASIKMALAYA
            </textPath>
          </text>

          {/* Golden Stars Array Top Inner Arc */}
          <g fill="#fef08a">
            <path d="M 50 20 L 51 22.5 L 53.5 22.5 L 51.5 24 L 52 26.5 L 50 25 L 48 26.5 L 48.5 24 L 46.5 22.5 L 49 22.5 Z" />
            <path d="M 40 22 L 41 24 L 43 24 L 41.5 25.2 L 42 27 L 40 25.8 L 38 27 L 38.5 25.2 L 37 24 L 39 24 Z" transform="scale(0.85) translate(6, 4)" />
            <path d="M 60 22 L 61 24 L 63 24 L 61.5 25.2 L 62 27 L 60 25.8 L 58 27 L 58.5 25.2 L 57 24 L 59 24 Z" transform="scale(0.85) translate(-3, 4)" />
          </g>

          {/* Left Side: Vocational Gear Wheel */}
          <g transform="translate(23, 48) scale(0.65)" stroke="#fef08a" strokeWidth="1.8" fill="none">
            <circle cx="10" cy="10" r="7" />
            <path d="M10 0 v20 M0 10 h20 M3 3 l14 14 M3 17 l14 -14" strokeWidth="2.2" />
            <circle cx="10" cy="10" r="3.5" fill="#fef08a" />
          </g>

          {/* Right Side: Wheat/Rice & Cotton Sheaf */}
          <g transform="translate(64, 48) scale(0.65)" fill="#fef08a">
            <path d="M 3 18 C 8 14, 12 8, 12 0 C 10 6, 6 12, 0 16 Z" />
            <circle cx="13" cy="4" r="1.5" />
            <circle cx="15" cy="9" r="1.5" />
            <circle cx="14" cy="14" r="1.5" />
          </g>

          {/* Center Torch (Obor Ilmu & Religion) */}
          <path d="M 47 38 L 53 38 L 51 47 L 49 47 Z" fill="#f59e0b" stroke="#fef08a" strokeWidth="0.8" />
          <path d="M 50 28 C 45 33, 47 37, 50 38 C 53 37, 55 33, 50 28 Z" fill="url(#torchGlow)" />

          {/* Globe & Book Base */}
          <circle cx="50" cy="54" r="9" fill="#1e3a8a" stroke="#fef08a" strokeWidth="1.2" />
          <path d="M 42 54 h 16 M 50 45 v 18 M 44 49 C 48 51, 52 51, 56 49 M 44 59 C 48 57, 52 57, 56 59" stroke="#93c5fd" strokeWidth="0.8" fill="none" />

          {/* Open Book Foundation */}
          <path d="M 50 67 Q 38 61 30 66 L 33 76 Q 42 71 50 74 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
          <path d="M 50 67 Q 62 61 70 66 L 67 76 Q 58 71 50 74 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="50" y1="67" x2="50" y2="74" stroke="#b45309" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight whitespace-nowrap shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold text-sm sm:text-base tracking-tight ${lightText ? 'text-white' : 'text-slate-900'}`}>
              SMK ISLAM CIPASUNG
            </span>
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-sm shadow-xs uppercase tracking-wider">
              A
            </span>
          </div>
          <span className={`text-[10px] font-extrabold tracking-wide ${lightText ? 'text-blue-100' : 'text-slate-800'}`}>
            Singaparna • TSM • TJKT • MPLB
          </span>
        </div>
      )}
    </div>
  );
};
