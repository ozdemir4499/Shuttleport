import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch blogs', error);
    return [];
  }
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>?/gm, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getLocalizedContent(blog: any, locale: string, field: string) {
  const localeField = `${field}_${locale}`;
  if (blog[localeField]) return blog[localeField];
  if (blog[`${field}_tr`]) return blog[`${field}_tr`];
  return blog[`${field}_en`] || '';
}

const categoryLabels: Record<string, Record<string, string>> = {
  transfer: { tr: 'Transfer Rehberi', en: 'Transfer Guide', de: 'Transfer-Leitfaden', ru: 'Трансфер' },
  tur: { tr: 'Turlar', en: 'Tours', de: 'Touren', ru: 'Туры' },
  sapanca: { tr: 'Sapanca', en: 'Sapanca', de: 'Sapanca', ru: 'Сапанджа' },
  genel: { tr: 'Seyahat Rehberi', en: 'Travel Guide', de: 'Reisefuhrer', ru: 'Путеводитель' },
};

const categoryColors: Record<string, string> = {
  transfer: 'bg-blue-100 text-blue-700 border-blue-200',
  tur: 'bg-purple-100 text-purple-700 border-purple-200',
  sapanca: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  genel: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const blogs = await getBlogs();

  const heroTitle = locale === 'en' ? 'Istanbul Travel & Transfer Guide' : locale === 'de' ? 'Istanbul Reise- & Transferguide' : locale === 'ru' ? 'Гид по Стамбулу и трансферам' : 'Istanbul Seyahat & Transfer Rehberi';
  const heroDesc = locale === 'en' ? 'Discover the best routes, hidden gems, and expert travel tips for Istanbul and beyond. Your premium journey starts here.' : locale === 'de' ? 'Entdecken Sie die besten Routen, Geheimtipps und Experten-Reisetipps fur Istanbul und daruber hinaus.' : locale === 'ru' ? 'Откройте лучшие маршруты, скрытые жемчужины и экспертные советы по путешествиям в Стамбуле.' : 'Istanbul ve otesindeki en iyi rotalar, gizli hazineler ve uzman seyahat onerileri. Premium yolculugunuz burada baslar.';
  const emptyText = locale === 'en' ? 'No blog posts yet.' : locale === 'de' ? 'Noch keine Blogbeitrage.' : locale === 'ru' ? 'Постов пока нет.' : 'Henuz blog yazisi bulunmuyor.';
  const readMoreLabel = locale === 'en' ? 'Read More' : locale === 'de' ? 'Weiterlesen' : locale === 'ru' ? 'Читать далее' : 'Devamini Oku';
  const readLabel = locale === 'en' ? 'min read' : locale === 'de' ? 'Min.' : locale === 'ru' ? 'мин' : 'dk';
  const badgeText = locale === 'en' ? 'Travel Stories & Tips' : locale === 'de' ? 'Reiseberichte & Tipps' : locale === 'ru' ? 'Путевые заметки' : 'Seyahat Hikayeleri & Ipuclari';

  return (
    <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
      <Header />
      
      {/* HERO SECTION */}
      <section className="text-white py-24 md:py-32 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/images/blog-hero.png" 
            alt="Istanbul Seyahat Rehberi"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/85 via-[#0a192f]/75 to-[#0a192f]/90" />
          {/* Gold accent glow */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#B58A32]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px]" />
        </div>
        <div className="container-custom px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B58A32]/20 text-sm font-medium text-[#B58A32] mb-6 border border-[#B58A32]/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            {badgeText}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            {heroDesc}
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#B58A32]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Istanbul
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#B58A32]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {locale === 'en' ? 'Multilingual' : locale === 'de' ? 'Mehrsprachig' : locale === 'ru' ? 'Многоязычный' : 'Cok Dilli'}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#B58A32]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              {locale === 'en' ? 'Premium Experience' : locale === 'de' ? 'Premium-Erlebnis' : locale === 'ru' ? 'Премиум' : 'Premium Deneyim'}
            </span>
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-16 md:py-24">
        <div className="container-custom px-4">
          {blogs.length > 0 && (
            <p className="text-sm text-gray-400 mb-8">{blogs.length} {locale === 'en' ? 'posts' : locale === 'de' ? 'Beitrage' : locale === 'ru' ? 'статей' : 'yazi'}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-gray-400 text-lg">{emptyText}</p>
              </div>
            ) : (
              blogs.map((blog: any) => {
                const blogTitle = getLocalizedContent(blog, locale, 'title') || blog.title_tr;
                const blogContent = getLocalizedContent(blog, locale, 'content') || blog.content_tr;
                const category = blog.category || 'genel';
                const catLabel = categoryLabels[category]?.[locale] || categoryLabels['genel'][locale] || 'Rehber';
                const catColor = categoryColors[category] || categoryColors['genel'];
                const rt = estimateReadingTime(blogContent);

                return (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100">
                    <div className="relative h-56 overflow-hidden">
                      {blog.image_url ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/static/${blog.image_url}`}
                          alt={blogTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          quality={75}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a192f] via-[#0d2847] to-[#1a3a5c] flex items-center justify-center relative">
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20zM0 0h20v20H0V0z\'/%3E%3C/g%3E%3C/svg%3E")'}} />
                          <svg className="w-16 h-16 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${catColor}`}>
                          {catLabel}
                        </span>
                      </div>
                      {/* Reading time */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm">
                          {rt} {readLabel}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center text-xs text-gray-400 mb-3">
                        <span>{new Date(blog.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {blog.author && <><span className="mx-2">·</span><span className="font-semibold text-gray-500">{blog.author}</span></>}
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#B58A32] transition-colors leading-snug">
                        {blogTitle}
                      </h2>
                      <p className="text-gray-500 line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                        {blogContent.replace(/<[^>]*>?/gm, '').replace(/[#*_]/g, '').substring(0, 160)}...
                      </p>
                      <div className="flex items-center text-[#0a192f] font-bold text-sm mt-auto group-hover:text-[#B58A32] transition-colors">
                        {readMoreLabel}
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
