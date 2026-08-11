import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Globe,
  Share2,
  Code2,
  Save,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SeoConfig } from '../types';

interface SeoPanelProps {
  seoConfig: SeoConfig;
  onUpdateSeo: (newConfig: SeoConfig) => void;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({ seoConfig, onUpdateSeo }) => {
  const [formData, setFormData] = useState<SeoConfig>(seoConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSeo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Structured Data Schema JSON-LD
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: formData.siteName,
    url: formData.canonicalUrl,
    logo: 'https://smkislamcipasung.sch.id/logo.png',
    description: formData.metaDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. KH. Ruhiat Komplek Pesantren Cipasung',
      addressLocality: 'Singaparna',
      addressRegion: 'Jawa Barat',
      postalCode: '46417',
      addressCountry: 'ID',
    },
    telephone: '(0265) 545123',
    sameAs: ['https://facebook.com/smkislamcipasung', 'https://instagram.com/smkislamcipasung'],
  };

  return (
    <section className="py-12 bg-slate-50 text-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            Pengaturan & Optimasi SEO Mesin Pencari
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Panel Optimasi SEO SMK Islam Cipasung
          </h2>
          <p className="text-sm text-slate-600">
            Kelola Meta Title, Meta Description, OpenGraph Sosial Media, dan Schema.org JSON-LD agar website sekolah menduduki peringkat #1 Google.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Editor */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5 text-slate-800">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-5 h-5 text-emerald-600" /> Konfigurasi Tag Meta SEO
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meta Title (Judul Halaman di Google) *
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Panjang: {formData.metaTitle.length} karakter (Rekomendasi: 50-60 karakter)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meta Description (Deskripsi Singkat di Hasil Pencarian) *
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Panjang: {formData.metaDescription.length} karakter (Rekomendasi: 150-160 karakter)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meta Keywords (Kata Kunci Utama)
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL OpenGraph Image (Gambar Pratinjau Sosial Media / WhatsApp)
                </label>
                <input
                  type="text"
                  name="ogImage"
                  value={formData.ogImage}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pengaturan SEO Berhasil Disimpan!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs flex items-center gap-2 shadow-md shadow-emerald-200 transition"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan SEO
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Google Search Snippet Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Google Search Result Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3 shadow-sm text-slate-800">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase">
                <Search className="w-4 h-4" /> Simulasi Tampilan Google Search
              </span>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 space-y-1">
                <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                  <Globe className="w-3 h-3 text-emerald-600" />
                  <span>https://smkislamcipasung.sch.id</span>
                </div>
                <h4 className="text-sm font-bold text-emerald-800 hover:underline cursor-pointer line-clamp-1">
                  {formData.metaTitle}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                  {formData.metaDescription}
                </p>
              </div>
            </div>

            {/* Schema.org Preview */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3 shadow-sm text-slate-800">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                <Code2 className="w-4 h-4 text-emerald-600" /> Schema.org JSON-LD Structured Data
              </span>
              <pre className="p-3.5 bg-slate-50 rounded-2xl text-[10px] text-slate-700 font-mono overflow-x-auto max-h-48 border border-slate-200">
                {JSON.stringify(jsonLdSchema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
