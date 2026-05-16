import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import { ChevronRight, Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog', error);
    return null;
  }
}

async function getRelatedBlogs(currentSlug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const all = await res.json();
    return all.filter((b: any) => b.slug !== currentSlug).slice(0, 3);
  } catch {
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
  const fallbacks = [`${field}_tr`, `${field}_en`];
  
  if (blog[localeField]) return blog[localeField];
  for (const fb of fallbacks) {
    if (blog[fb]) return blog[fb];
  }
  return '';
}

const categoryLabels: Record<string, Record<string, string>> = {
  transfer: { tr: 'Transfer Rehberi', en: 'Transfer Guide', de: 'Transfer-Leitfaden', ru: 'Гид по трансферу' },
  tur: { tr: 'Turlar', en: 'Tours', de: 'Touren', ru: 'Туры' },
  sapanca: { tr: 'Sapanca & Cevre', en: 'Sapanca & Around', de: 'Sapanca & Umgebung', ru: 'Сапанджа' },
  genel: { tr: 'Seyahat Rehberi', en: 'Travel Guide', de: 'Reisefuhrer', ru: 'Путеводитель' },
};

const categoryColors: Record<string, string> = {
  transfer: 'bg-blue-100 text-blue-700 border-blue-200',
  tur: 'bg-purple-100 text-purple-700 border-purple-200',
  sapanca: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  genel: 'bg-amber-100 text-amber-700 border-amber-200',
};

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const blog = await getBlog(slug);
  
  if (!blog) return { title: 'Not Found' };

  const title = getLocalizedContent(blog, locale, 'title') || blog.title_tr;
  const description = getLocalizedContent(blog, locale, 'seo_desc') || '';

  return {
    title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || 'RidePortX'}`,
    description,
    openGraph: {
      title,
      description,
      images: blog.image_url ? [`${process.env.NEXT_PUBLIC_API_URL}/static/${blog.image_url}`] : []
    }
  };
}

export default async function BlogDetailPage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const title = getLocalizedContent(blog, locale, 'title') || blog.title_tr;
  const content = getLocalizedContent(blog, locale, 'content') || blog.content_tr;
  const readingTime = estimateReadingTime(content);
  const category = blog.category || 'genel';
  const categoryLabel = categoryLabels[category]?.[locale] || categoryLabels['genel'][locale] || 'Seyahat Rehberi';
  const categoryColor = categoryColors[category] || categoryColors['genel'];
  
  const relatedBlogs = await getRelatedBlogs(slug);
  
  const shareUrl = `https://rideportx.com/${locale}/blog/${slug}`;
  const shareText = encodeURIComponent(title);

  const readLabel = locale === 'en' ? 'min read' : locale === 'de' ? 'Min. Lesezeit' : locale === 'ru' ? 'мин чтения' : 'dk okuma';
  const backLabel = locale === 'en' ? 'Back to Blog' : locale === 'de' ? 'Zuruck zum Blog' : locale === 'ru' ? 'Назад к блогу' : 'Bloglara Don';
  const relatedLabel = locale === 'en' ? 'Related Posts' : locale === 'de' ? 'Ahnliche Beitrage' : locale === 'ru' ? 'Похожие статьи' : 'Ilgili Yazilar';
  const readMoreLabel = locale === 'en' ? 'Read More' : locale === 'de' ? 'Weiterlesen' : locale === 'ru' ? 'Читать далее' : 'Devamini Oku';

  return (
    <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
      <Header />
      
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="container-custom px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0a192f] transition-colors">
              {locale === 'en' ? 'Home' : locale === 'de' ? 'Startseite' : locale === 'ru' ? 'Главная' : 'Anasayfa'}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/blog" className="hover:text-[#0a192f] transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#0a192f] font-medium truncate max-w-md">{title}</span>
          </nav>
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden">
        {blog.image_url ? (
          <>
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_URL}/static/${blog.image_url}`} 
              alt={title} 
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#0d2847] to-[#1a3a5c]">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B58A32]/10 rounded-full blur-[120px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
          </div>
        )}
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-custom max-w-4xl mx-auto">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${categoryColor}`}>
              {categoryLabel}
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <article className="pb-16 md:pb-24">
        <div className="container-custom px-4 -mt-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* META BAR */}
            <div className="bg-white rounded-t-2xl shadow-lg px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#B58A32]" />
                  <span>{new Date(blog.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : locale === 'ru' ? 'ru-RU' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B58A32]" />
                    <span className="font-semibold text-gray-700">{blog.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B58A32]" />
                  <span>{readingTime} {readLabel}</span>
                </div>
              </div>
              
              {/* SHARE BUTTONS */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 mr-1"><Share2 className="w-4 h-4" /></span>
                <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors" title="WhatsApp">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition-colors" title="X / Twitter">
                  <svg className="w-4 h-4 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Facebook">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            {/* CONTENT CARD */}
            <div className="bg-white rounded-b-2xl shadow-lg p-6 md:p-12 pt-8 md:pt-10">
              <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#0a192f] hover:text-[#B58A32] mb-8 group transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {backLabel}
              </Link>

              {/* Keywords */}
              {blog.keywords && blog.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.keywords.map((kw: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {/* BLOG CONTENT */}
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#0a192f] prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100 prose-h3:text-xl prose-h3:mt-8 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-800 prose-a:text-[#B58A32] hover:prose-a:text-[#0a192f] prose-img:rounded-xl prose-ul:my-4"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* CTA BANNER */}
            <div className="mt-8 bg-gradient-to-r from-[#0a192f] to-[#1a3a5c] rounded-2xl p-8 md:p-10 text-center shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {locale === 'en' ? 'Plan Your Istanbul Journey Today' : locale === 'de' ? 'Planen Sie Ihre Istanbul-Reise' : locale === 'ru' ? 'Спланируйте поездку в Стамбул' : "Istanbul Seyahatinizi Hemen Planlayin"}
              </h3>
              <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
                {locale === 'en' ? 'VIP airport transfers, city tours, and yacht cruises with RidePortX' : locale === 'de' ? 'VIP-Flughafentransfers, Stadttouren und Yachtkreuzfahrten' : locale === 'ru' ? 'VIP трансферы из аэропорта, городские туры и яхт-круизы' : 'VIP havaalani transferi, sehir turlari ve yat turlari ile RidePortX'}
              </p>
              <Link 
                href="/"
                className="inline-block px-8 py-3 bg-[#B58A32] hover:bg-[#9a7429] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                {locale === 'en' ? 'Book Now' : locale === 'de' ? 'Jetzt Buchen' : locale === 'ru' ? 'Забронировать' : 'Hemen Rezervasyon Yap'}
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* RELATED POSTS */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="container-custom px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">{relatedLabel}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedBlogs.map((rb: any) => {
                const rbTitle = getLocalizedContent(rb, locale, 'title') || rb.title_tr;
                const rbContent = getLocalizedContent(rb, locale, 'content') || rb.content_tr;
                const rbCategory = rb.category || 'genel';
                const rbCatLabel = categoryLabels[rbCategory]?.[locale] || categoryLabels['genel'][locale] || 'Rehber';
                const rbCatColor = categoryColors[rbCategory] || categoryColors['genel'];
                
                return (
                  <Link key={rb.id} href={`/blog/${rb.slug}`} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      {rb.image_url ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/static/${rb.image_url}`}
                          alt={rbTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#1a3a5c] flex items-center justify-center">
                          <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rbCatColor}`}>{rbCatLabel}</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(rb.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#B58A32] transition-colors text-sm">
                        {rbTitle}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 flex-1">
                        {rbContent.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                      </p>
                      <div className="flex items-center text-[#0a192f] font-bold text-xs mt-3 group-hover:text-[#B58A32] transition-colors">
                        {readMoreLabel}
                        <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
