"use client";
import React, { useState, useEffect } from 'react';

interface Blog {
  id: number;
  title_tr: string;
  title_en: string | null;
  slug: string;
  content_tr: string;
  content_en: string | null;
  image_url: string | null;
  seo_title_tr: string | null;
  seo_title_en: string | null;
  seo_desc_tr: string | null;
  seo_desc_en: string | null;
  active: boolean;
  author: string | null;
  created_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    slug: '',
    content_tr: '',
    content_en: '',
    seo_title_tr: '',
    seo_title_en: '',
    seo_desc_tr: '',
    seo_desc_en: '',
    active: true,
    author: '',
    image_url: null as string | null
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/all`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBlog 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${editingBlog.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`;
      
      const payload = {
        title_tr: formData.title_tr,
        title_en: formData.title_en || null,
        slug: formData.slug || generateSlug(formData.title_tr),
        content_tr: formData.content_tr,
        content_en: formData.content_en || null,
        seo_title_tr: formData.seo_title_tr || null,
        seo_title_en: formData.seo_title_en || null,
        seo_desc_tr: formData.seo_desc_tr || null,
        seo_desc_en: formData.seo_desc_en || null,
        active: formData.active,
        author: formData.author || null,
        image_url: formData.image_url || editingBlog?.image_url || null
      };

      const res = await fetch(url, {
        method: editingBlog ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingBlog(null);
        fetchBlogs();
      } else {
        const err = await res.json();
        alert("Hata: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleMainFileUpload = async (blogId: number | null, file: File) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/upload-image`, {
        method: 'POST',
        body: formDataUpload
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        setFormData(prev => ({ ...prev, image_url: data.image_url }));
        
        if (blogId) {
            const blogToUpdate = blogs.find(b => b.id === blogId);
            if (blogToUpdate) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...blogToUpdate, image_url: data.image_url })
                });
            }
            fetchBlogs();
            const updatedBlogs = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/all`)).json();
            const updated = updatedBlogs.find((b: Blog) => b.id === blogId);
            if (updated) setEditingBlog(updated);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Yükleme sırasında hata oluştu.');
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title_tr: '',
      title_en: '',
      slug: '',
      content_tr: '',
      content_en: '',
      seo_title_tr: '',
      seo_title_en: '',
      seo_desc_tr: '',
      seo_desc_en: '',
      active: true,
      author: '',
      image_url: null
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title_tr: blog.title_tr,
      title_en: blog.title_en || '',
      slug: blog.slug,
      content_tr: blog.content_tr,
      content_en: blog.content_en || '',
      seo_title_tr: blog.seo_title_tr || '',
      seo_title_en: blog.seo_title_en || '',
      seo_desc_tr: blog.seo_desc_tr || '',
      seo_desc_en: blog.seo_desc_en || '',
      active: blog.active,
      author: blog.author || '',
      image_url: blog.image_url
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Blog Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki blog yazılarını buradan yönetebilirsiniz.</p>
        </div>
        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Yeni Blog Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Blog Başlığı</th>
              <th className="px-6 py-4">Yazar</th>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold overflow-hidden">
                      {blog.image_url ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/static/${blog.image_url}`} alt="Blog" className="w-full h-full object-cover" />
                      ) : (
                        blog.title_tr.charAt(0)
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-slate-900">{blog.title_tr}</div>
                      <div className="text-xs text-slate-500">Slug: {blog.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{blog.author || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(blog.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {blog.active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEditModal(blog)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg mr-2">Düzenle</button>
                  <button onClick={() => handleDelete(blog.id)} className="text-rose-600 hover:text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">{editingBlog ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Başlık (TR) *</label>
                  <input type="text" required value={formData.title_tr} onChange={(e) => setFormData({...formData, title_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Başlık (EN)</label>
                  <input type="text" value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL (Slug) - Boş bırakırsanız otomatik oluşur</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yazar</label>
                  <input type="text" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (TR) * (Markdown veya HTML kullanabilirsiniz)</label>
                  <textarea required value={formData.content_tr} onChange={(e) => setFormData({...formData, content_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={8}></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (EN)</label>
                  <textarea value={formData.content_en} onChange={(e) => setFormData({...formData, content_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={8}></textarea>
                </div>

                <div className="col-span-2 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">SEO Ayarları</h3>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title (TR)</label>
                  <input type="text" value={formData.seo_title_tr} onChange={(e) => setFormData({...formData, seo_title_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title (EN)</label>
                  <input type="text" value={formData.seo_title_en} onChange={(e) => setFormData({...formData, seo_title_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description (TR)</label>
                  <textarea value={formData.seo_desc_tr} onChange={(e) => setFormData({...formData, seo_desc_tr: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={2}></textarea>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description (EN)</label>
                  <textarea value={formData.seo_desc_en} onChange={(e) => setFormData({...formData, seo_desc_en: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5" rows={2}></textarea>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Görseller</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kapak Fotoğrafı</label>
                  <div className="flex gap-4 items-end">
                    {formData.image_url && (
                      <div className="w-40 h-24 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/static/${formData.image_url}`} alt="Main" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="cursor-pointer text-sm bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium">
                      Fotoğraf Yükle
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handleMainFileUpload(editingBlog?.id || null, e.target.files[0])
                      }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">İptal</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200">{editingBlog ? 'Değişiklikleri Kaydet' : 'Blogu Oluştur'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
