import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Calendar, User, ArrowLeft } from 'lucide-react';

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

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string, slug: string } }): Promise<Metadata> {
  const blog = await getBlog(slug);
  
  if (!blog) return { title: 'Not Found' };

  const title = locale === 'en' && blog.seo_title_en ? blog.seo_title_en : (blog.seo_title_tr || blog.title_tr);
  const description = locale === 'en' && blog.seo_desc_en ? blog.seo_desc_en : (blog.seo_desc_tr || '');

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

  const title = locale === 'en' && blog.title_en ? blog.title_en : blog.title_tr;
  const content = locale === 'en' && blog.content_en ? blog.content_en : blog.content_tr;

  return (
    <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
      <Header />
      
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="container-custom px-4 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0a192f] transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/blog" className="hover:text-[#0a192f] transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#0a192f] font-medium truncate max-w-md">{title}</span>
          </nav>
        </div>
      </div>

      <article className="pb-16 md:pb-24">
        {/* HERO IMAGE */}
        {blog.image_url && (
          <div className="w-full h-[30vh] md:h-[50vh] relative">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL}/static/${blog.image_url}`} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>
        )}

        <div className={`container-custom px-4 ${blog.image_url ? '-mt-24 md:-mt-32 relative z-10' : 'pt-12'}`}>
          <div className="max-w-4xl mx-auto">
            {/* CONTENT CARD */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
              <div className="mb-8">
                <Link href="/blog" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 mb-6 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Bloglara Dön
                </Link>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#B58A32]" />
                    <span>{new Date(blog.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#B58A32]" />
                      <span className="font-semibold text-gray-700">{blog.author}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MARKDOWN CONTENT */}
              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#B58A32] hover:prose-a:text-[#0a192f] prose-img:rounded-xl">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
