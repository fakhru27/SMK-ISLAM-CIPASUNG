import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface PpdbAnnouncementBarProps {
  onOpenPpdb: (tab?: string) => void;
}

export const PpdbAnnouncementBar: React.FC<PpdbAnnouncementBarProps> = ({ onOpenPpdb }) => {
  return (
    <div className="bg-slate-950 pt-4 pb-2 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative p-[1.5px] rounded-2xl overflow-hidden shadow-md"
        >
          {/* Animated Rotating Border Beam */}
          <div className="absolute inset-[-250%] animate-spin-border bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_65%,#f59e0b_78%,#06b6d4_88%,#fef08a_95%,#ffffff_100%)] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-slate-100 rounded-[14px] p-2.5 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between border border-blue-700/60 gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs">
                PPDB 2026/2027
              </span>
              <span className="truncate">
                Pendaftaran Gelombang 1 Dibuka: <strong className="text-amber-300 font-bold">TSM • TJKT • MPLB</strong> (Kuota Terbatas!)
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <button
                onClick={() => onOpenPpdb('ppdb_portal')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 shadow-sm cursor-pointer border border-blue-400/40"
              >
                <span>Cek Status &amp; SKL</span>
              </button>

              <button
                onClick={() => onOpenPpdb('ppdb')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1 rounded-full text-[11px] font-extrabold transition flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
