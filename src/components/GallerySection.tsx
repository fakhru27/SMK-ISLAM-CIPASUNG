import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Calendar,
  X,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const categories = ['Semua', 'Keagamaan', 'Praktik Keahlian', 'Ekstrakurikuler', 'Prestasi'];

  const filteredItems = selectedCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-12 lg:py-16 bg-slate-100/90 text-slate-800 min-h-screen bg-grid-pattern relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-slate-800 shadow-2xs">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Dokumentasi & Galeri Kegiatan
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Galeri Kegiatan SMK Islam Cipasung
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Merekam momen kebersamaan, keagamaan santri Pesantren Cipasung, praktik keahlian bengkel & lab, serta raihan prestasi membanggakan.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white border-blue-800 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setActiveLightbox(item)}
                className="group bg-white rounded-3xl border-2 border-slate-200/90 overflow-hidden cursor-pointer shadow-sm hover:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Photo Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-blue-900 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-blue-800 shadow-xs uppercase tracking-wider">
                    {item.category}
                  </span>

                  <span className="absolute bottom-3 left-3 text-white text-[11px] font-semibold flex items-center gap-1 drop-shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" /> {item.date}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-900 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        {activeLightbox && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-slate-200"
            >
              <div className="relative h-72 sm:h-80 bg-slate-900">
                <img
                  src={activeLightbox.imageUrl}
                  alt={activeLightbox.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="absolute top-4 right-4 p-2.5 bg-slate-950/70 hover:bg-slate-950 text-white rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-amber-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase border border-blue-800">
                    {activeLightbox.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {activeLightbox.date} • oleh {activeLightbox.author}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">
                  {activeLightbox.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {activeLightbox.description}
                </p>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveLightbox(null)}
                    className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-6 py-2.5 rounded-full text-xs transition border border-blue-800 cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

