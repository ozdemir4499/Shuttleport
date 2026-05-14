import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  return {
    title: `Blog | ${process.env.NEXT_PUBLIC_SITE_NAME || 'RidePortX'}`,
    description: 'En güncel seyahat, turizm ve transfer rehberi yazılarımız.',
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

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
      <Header />
      
      {/* HERO SECTION */}
      <section className="bg-[#0a192f] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="container-custom px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Blog & Seyahat Rehberi
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            İstanbul ve çevresindeki en iyi turlar, transfer ipuçları ve seyahat önerileri.
          </p>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-16 md:py-24">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Henüz blog yazısı bulunmuyor.
              </div>
            ) : (
              blogs.map((blog: any) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {blog.image_url ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/static/${blog.image_url}`}
                        alt={locale === 'en' && blog.title_en ? blog.title_en : blog.title_tr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Görsel Yok</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{new Date(blog.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      {blog.author && <span className="font-semibold">{blog.author}</span>}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#B58A32] transition-colors">
                      {locale === 'en' && blog.title_en ? blog.title_en : blog.title_tr}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 mb-4 flex-1 text-sm">
                      {/* Removing markdown/html tags for preview */}
                      {(locale === 'en' && blog.content_en ? blog.content_en : blog.content_tr).replace(/<[^>]*>?/gm, '').replace(/[#*_]/g, '')}
                    </p>
                    <div className="flex items-center text-[#0a192f] font-bold text-sm mt-auto group-hover:text-[#B58A32] transition-colors">
                      Devamını Oku
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
