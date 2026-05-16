"use client";
import React, { useState, useEffect, useCallback } from 'react';
import BlogTab from './BlogTab';
import CrawlerTab from './CrawlerTab';
import SpeedTab from './SpeedTab';

const SEO_API = "http://localhost:8001/api/seo";

interface PageReport {
  url: string;
  seo_score: number;
  title: string;
  issues: Array<{ type: string; severity: string; message: string }>;
}

interface BlogPost {
  slug: string;
  title_tr: string;
  title_en: string;
  status: string;
  created_at: string;
}

interface TopicSuggestion {
  title_tr: string;
  title_en: string;
  slug: string;
  keywords: string[];
}

type ActiveTab = 'dashboard' | 'crawler' | 'blog' | 'speed';

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dashboard, setDashboard] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [kwSettingsOpen, setKwSettingsOpen] = useState(false);
  const [trackedKeywords, setTrackedKeywords] = useState<any[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [rankingLang, setRankingLang] = useState('tr');

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboard = useCallback(async () => {
    try {
      const r = await fetch(`${SEO_API}/dashboard`);
      const data = await r.json();
      setDashboard(data);
    } catch { showToast('Dashboard yuklenemedi', 'err'); }
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Mevcut ranking verilerini DB'den yukle
    fetch(`${SEO_API}/rankings/latest?lang=tr`)
      .then(r => r.json())
      .then(data => { if (data.rankings?.length) setRankings(data.rankings); })
      .catch(() => {});
  }, [fetchDashboard]);


  // === BLOG ===
  const fetchBlogs = async () => {
    try {
      const r = await fetch(`${SEO_API}/blog/list`);
      const data = await r.json();
      setBlogPosts(data.posts || []);
    } catch {}
  };

  const suggestTopics = async () => {
    setLoading(p => ({ ...p, suggest: true }));
    try {
      const r = await fetch(`${SEO_API}/blog/suggest?count=5`, { method: 'POST' });
      const data = await r.json();
      setSuggestions(data.topics || []);
    } catch { showToast('Konu onerisi alinamadi', 'err'); }
    setLoading(p => ({ ...p, suggest: false }));
  };

  const generateBlog = async (topic: TopicSuggestion) => {
    setGenerating(topic.slug);
    try {
      const params = new URLSearchParams({
        title_tr: topic.title_tr,
        title_en: topic.title_en,
        slug: topic.slug,
      });
      const r = await fetch(`${SEO_API}/blog/generate?${params}`, { method: 'POST' });
      const data = await r.json();
      if (data.status === 'draft') {
        showToast('Blog yazisi olusturuldu!');
        fetchBlogs();
        setSuggestions(s => s.filter(t => t.slug !== topic.slug));
      }
    } catch { showToast('Blog olusturulamadi', 'err'); }
    setGenerating(null);
  };

  const publishBlog = async (slug: string) => {
    try {
      await fetch(`${SEO_API}/blog/${slug}/publish`, { method: 'POST' });
      showToast('Blog yayinlandi!');
      fetchBlogs();
    } catch { showToast('Yayinlama hatasi', 'err'); }
  };

  const rejectBlog = async (slug: string) => {
    try {
      await fetch(`${SEO_API}/blog/${slug}/reject`, { method: 'POST' });
      showToast('Blog reddedildi');
      fetchBlogs();
    } catch {}
  };


  useEffect(() => {
    if (activeTab === 'blog') fetchBlogs();
  }, [activeTab]);

  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Genel Bakis', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'crawler' as ActiveTab, label: 'Site Tarama', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'blog' as ActiveTab, label: 'Blog Uretici', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'speed' as ActiveTab, label: 'Hiz Testi', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const scoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const severityBadge = (s: string) => {
    if (s === 'critical') return 'bg-red-100 text-red-700 border-red-200';
    if (s === 'warning') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#1a365d] shadow-lg shadow-[#0a192f]/20 flex items-center justify-center shrink-0 relative overflow-hidden">
          {/* Subtle glow effect inside */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#B58A32]/20 blur-xl rounded-full" />
          <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" className="text-[#B58A32]" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" className="text-[#B58A32]" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Bot</h1>
          <p className="text-gray-500 mt-1">Site analizi, blog uretimi ve indexleme yonetimi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#0a192f] text-white shadow-lg shadow-[#0a192f]/20'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* === DASHBOARD TAB === */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {dashboard?.summary ? (
            <>
              {/* Top Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Site Identity Card */}
                <button
                  onClick={() => setActiveTab('crawler')}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:ring-2 hover:ring-[#0a192f]/10 transition-all text-left cursor-pointer group relative overflow-hidden"
                >
                  {/* Ghosted homepage preview */}
                  <div className="absolute inset-0">
                    <img src="/site_preview.png" alt="" className="w-full h-full object-cover object-top opacity-[0.12]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>

                  <div className="relative p-5 flex flex-col h-full">
                    {/* Header: Logo + Name + Link */}
                    <div className="flex items-center gap-3 mb-auto">
                      <img src="/logo_transparent.png" alt="RidePortX" className="w-9 h-9 rounded-lg object-contain shadow-sm border border-gray-100 bg-white" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-gray-800 leading-tight">RidePortX</p>
                        <a
                          href="https://rideportx.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-blue-500 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-0.5"
                        >
                          rideportx.com
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-3">
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">{dashboard.summary.total_pages_tracked}</p>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">sayfa</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-gray-400">4 dilde toplam</p>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>
                </button>

                {/* SEO Score Card — Mini Gauge */}
                <button
                  onClick={() => setActiveTab('crawler')}
                  className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl border border-emerald-100/50 p-5 shadow-sm hover:shadow-md hover:ring-2 hover:ring-emerald-200/40 transition-all text-left cursor-pointer group"
                >
                  {(() => {
                    const score = dashboard.summary.average_seo_score;
                    const gaugeColor = score >= 90 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
                    const circumference = 2 * Math.PI * 38;
                    const offset = circumference - (score / 100) * circumference;
                    return (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Ort. SEO Skoru</p>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${score >= 80 ? 'bg-emerald-50 text-emerald-600' : score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-[100px] h-[100px] mb-2">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                              <circle
                                cx="50" cy="50" r="38" fill="none"
                                stroke={gaugeColor}
                                strokeWidth="7"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-bold" style={{ color: gaugeColor }}>{score}</span>
                              <span className="text-[8px] text-gray-400 font-semibold uppercase">/100</span>
                            </div>
                          </div>
                          <div className="w-full flex items-center justify-between">
                            <span className={`text-[11px] font-medium ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                              {score >= 90 ? 'Mukemmel' : score >= 80 ? 'Iyi durumda' : score >= 50 ? 'Gelistirilmeli' : 'Kritik'}
                            </span>
                            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </button>

                {/* Blog Card */}
                <button
                  onClick={() => setActiveTab('blog')}
                  className="bg-gradient-to-br from-purple-50/60 to-white rounded-2xl border border-purple-100/50 p-5 shadow-sm hover:shadow-md hover:ring-2 hover:ring-purple-200/40 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Blog Yazisi</p>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">{dashboard.summary.total_blog_posts}</p>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">yazi</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-gray-500">AI ile otomatik uretim</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="text-[10px] text-gray-500">SEO optimizeli icerik</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>

                {/* Site Hizi Card — Circular Gauge */}
                <button
                  onClick={() => setActiveTab('speed')}
                  className="bg-gradient-to-br from-cyan-50/60 to-white rounded-2xl border border-cyan-100/50 p-5 shadow-sm hover:shadow-md hover:ring-2 hover:ring-cyan-200/40 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Site Hizi</p>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${dashboard.summary.speed?.score >= 80 ? 'bg-emerald-50 text-emerald-600' : dashboard.summary.speed?.score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-orange-50 text-orange-600'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                  </div>
                  {dashboard.summary.speed ? (() => {
                    const s = dashboard.summary.speed;
                    const gaugeColor = s.score >= 90 ? '#10b981' : s.score >= 50 ? '#f59e0b' : '#ef4444';
                    const circumference = 2 * Math.PI * 38;
                    const offset = circumference - (s.score / 100) * circumference;
                    return (
                      <div className="flex flex-col items-center">
                        {/* Circular Gauge */}
                        <div className="relative w-[100px] h-[100px] mb-2">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                            <circle
                              cx="50" cy="50" r="38" fill="none"
                              stroke={gaugeColor}
                              strokeWidth="7"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold" style={{ color: gaugeColor }}>{s.score}</span>
                            <span className="text-[8px] text-gray-400 font-semibold uppercase">/100</span>
                          </div>
                        </div>
                        {/* Metric Pills */}
                        <div className="w-full grid grid-cols-3 gap-1">
                          {[
                            { label: 'LCP', value: `${(s.lcp_ms / 1000).toFixed(1)}s`, good: s.lcp_ms <= 2500 },
                            { label: 'CLS', value: s.cls.toFixed(3), good: s.cls <= 0.1 },
                            { label: 'TBT', value: `${s.tbt_ms}ms`, good: s.tbt_ms <= 200 },
                          ].map((m, mi) => (
                            <div key={mi} className={`rounded-lg py-1 px-1.5 text-center ${m.good ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                              <p className="text-[8px] text-gray-400 font-bold uppercase">{m.label}</p>
                              <p className={`text-[11px] font-bold ${m.good ? 'text-emerald-600' : 'text-amber-600'}`}>{m.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="flex flex-col items-center py-4">
                      <div className="relative w-[100px] h-[100px] mb-2">
                        <svg className="w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#d1d5db" strokeWidth="7" strokeDasharray={`${2 * Math.PI * 38 * 0.25} ${2 * Math.PI * 38 * 0.75}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400 font-medium">Olcuyor...</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400">Mobil performans</p>
                    </div>
                  )}
                </button>
              </div>

              {/* SEO Score Gauge + Indexing + System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* SEO Score Gauge */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">SEO Skor Dagilimi</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                        <circle cx="60" cy="60" r="52" fill="none" stroke={dashboard.summary.average_seo_score >= 80 ? '#10b981' : dashboard.summary.average_seo_score >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="12" strokeDasharray={`${(dashboard.summary.average_seo_score / 100) * 327} 327`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{dashboard.summary.average_seo_score}</span>
                        <span className="text-[10px] text-gray-400 uppercase">/ 100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 90+ Iyi</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 50-89</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> &lt;50 Kritik</span>
                  </div>
                </div>

                {/* Keyword Rankings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative flex flex-col" style={{ height: '460px' }}>
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-[#0a192f]/5 text-[#0a192f] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-bold text-gray-800">Anahtar Kelime Siralamasi</h3>
                        </div>
                        {rankings.length > 0 && rankings[0]?.recorded_at && (
                          <p className="text-[9px] text-gray-400 mt-1 ml-8">Son kontrol: {new Date(rankings[0].recorded_at).toLocaleString('tr-TR')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            fetch(`${SEO_API}/keywords?lang=${rankingLang}`)
                              .then(r => r.json())
                              .then(d => setTrackedKeywords(d.keywords || []))
                              .catch(() => {});
                            setKwSettingsOpen(!kwSettingsOpen);
                          }}
                          className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                          title="Kelime Yonetimi"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <button
                          onClick={async () => {
                            setRankingsLoading(true);
                            try {
                              const r = await fetch(`${SEO_API}/rankings?lang=${rankingLang}`);
                              const data = await r.json();
                              if (data.rankings) setRankings(data.rankings);
                            } catch {}
                            setRankingsLoading(false);
                          }}
                          disabled={rankingsLoading}
                          className="px-3 py-1.5 rounded-lg bg-[#0a192f] hover:bg-[#0a192f]/80 text-white text-[10px] font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                        >
                          {rankingsLoading ? (
                            <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kontrol...</>
                          ) : (
                            <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Kontrol Et</>
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Dil Tablari */}
                    <div className="flex gap-1">
                      {[
                        { code: 'tr', label: 'TR', flag: '🇹🇷' },
                        { code: 'en', label: 'EN', flag: '🇬🇧' },
                        { code: 'de', label: 'DE', flag: '🇩🇪' },
                        { code: 'ru', label: 'RU', flag: '🇷🇺' },
                      ].map(l => (
                        <button
                          key={l.code}
                          onClick={() => {
                            if (l.code === rankingLang) return;
                            setRankingLang(l.code);
                            setRankingsLoading(true);
                            fetch(`${SEO_API}/rankings/latest?lang=${l.code}`)
                              .then(r => r.json())
                              .then(d => setRankings(d.rankings?.length ? d.rankings : []))
                              .catch(() => setRankings([]))
                              .finally(() => setRankingsLoading(false));
                          }}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all ${
                            rankingLang === l.code
                              ? 'bg-[#0a192f] text-white'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-xs">{l.flag}</span> {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kelime Listesi */}
                  <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    {rankingsLoading ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-[#0a192f] rounded-full animate-spin" />
                      </div>
                    ) : rankings.length > 0 ? (
                      <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                        {rankings.map((r: any, i: number) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                              <span className="text-[10px] text-gray-300 font-mono w-4 text-right">{i + 1}</span>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">{r.keyword}</p>
                                {r.url && <p className="text-[9px] text-gray-400 truncate">{r.url.replace('https://rideportx.com', '')}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {r.change !== undefined && r.change !== 0 && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  r.change > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                                }`}>
                                  {r.change > 0 ? `↑${r.change}` : `↓${Math.abs(r.change)}`}
                                </span>
                              )}
                              {r.found ? (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  r.position <= 3 ? 'text-emerald-700 bg-emerald-50' :
                                  r.position <= 10 ? 'text-amber-700 bg-amber-50' :
                                  r.position <= 30 ? 'text-orange-700 bg-orange-50' :
                                  'text-red-700 bg-red-50'
                                }`}>
                                  #{r.position}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">50+</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <p className="text-xs text-gray-400">Kontrol Et butonuna basin</p>
                      </div>
                    )}
                  </div>

                  {/* Kelime Yonetimi Modal */}
                  {kwSettingsOpen && (
                    <div className="absolute inset-0 bg-white z-10 flex flex-col rounded-2xl">
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">Kelime Yonetimi <span className="text-[10px] font-semibold text-gray-400 ml-1">{rankingLang.toUpperCase()}</span></h3>
                        <button onClick={() => setKwSettingsOpen(false)} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newKeyword}
                            onChange={e => setNewKeyword(e.target.value)}
                            onKeyDown={async e => {
                              if (e.key === 'Enter' && newKeyword.trim()) {
                                const r = await fetch(`${SEO_API}/keywords?keyword=${encodeURIComponent(newKeyword)}&lang=${rankingLang}`, { method: 'POST' });
                                const d = await r.json();
                                if (d.keywords) setTrackedKeywords(d.keywords);
                                setNewKeyword('');
                              }
                            }}
                            placeholder="Yeni anahtar kelime..."
                            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 focus:border-[#B58A32] focus:ring-1 focus:ring-[#B58A32]/20 outline-none"
                          />
                          <button
                            onClick={async () => {
                              if (!newKeyword.trim()) return;
                              const r = await fetch(`${SEO_API}/keywords?keyword=${encodeURIComponent(newKeyword)}&lang=${rankingLang}`, { method: 'POST' });
                              const d = await r.json();
                              if (d.keywords) setTrackedKeywords(d.keywords);
                              setNewKeyword('');
                            }}
                            className="px-4 py-2 bg-[#B58A32] text-white text-xs rounded-lg hover:bg-[#c9a04a] transition-colors font-semibold"
                          >Ekle</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1">
                          {trackedKeywords.map((kw: any) => (
                            <div key={kw.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                              <span className="text-xs text-gray-700">{kw.keyword}</span>
                              <button
                                onClick={async () => {
                                  await fetch(`${SEO_API}/keywords/${kw.id}`, { method: 'DELETE' });
                                  setTrackedKeywords(prev => prev.filter((k: any) => k.id !== kw.id));
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center"
                              >
                                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-3 pt-3 border-t border-gray-100">{trackedKeywords.length} kelime takip ediliyor</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* System Status */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Sistem Durumu</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'SEO Bot', status: true, desc: 'Aktif' },
                      { label: 'Service Account', status: dashboard.summary.service_account_ready, desc: dashboard.summary.service_account_ready ? 'Bagli' : 'Eksik' },
                      { label: 'Blog Pipeline', status: true, desc: 'Otonom' },
                      { label: 'Crawler', status: true, desc: 'Hazir' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${s.status ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-sm font-medium text-gray-700">{s.label}</span>
                        </div>
                        <span className={`text-xs font-semibold ${s.status ? 'text-emerald-600' : 'text-red-600'}`}>{s.desc}</span>
                      </div>
                    ))}
                  </div>
                  {dashboard.timestamp && (
                    <p className="text-[10px] text-gray-400 mt-4 text-center">
                      Son guncelleme: {new Date(dashboard.timestamp).toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Hizli Islemler</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Site Tara', icon: '🔍', desc: 'SEO analizi baslat', tab: 'crawler' as ActiveTab, color: 'hover:bg-blue-50 hover:border-blue-200' },
                    { label: 'Blog Olustur', icon: '✍️', desc: 'Yeni icerik uret', tab: 'blog' as ActiveTab, color: 'hover:bg-purple-50 hover:border-purple-200' },
                    { label: 'Hiz Testi', icon: '⚡', desc: 'PageSpeed analizi', tab: 'speed' as ActiveTab, color: 'hover:bg-orange-50 hover:border-orange-200' },
                    { label: 'Dashboard Yenile', icon: '🔄', desc: 'Verileri guncelle', tab: 'dashboard' as ActiveTab, color: 'hover:bg-emerald-50 hover:border-emerald-200', action: fetchDashboard },
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.action ? action.action() : setActiveTab(action.tab)}
                      className={`p-4 rounded-xl border border-gray-100 text-left transition-all ${action.color} group`}
                    >
                      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{action.icon}</span>
                      <p className="text-sm font-bold text-gray-800">{action.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#0a192f] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Dashboard yukleniyor...</p>
            </div>
          )}
        </div>
      )}

      {/* === CRAWLER TAB === */}
      {activeTab === 'crawler' && (
        <CrawlerTab showToast={showToast} />
      )}

      {/* === BLOG TAB === */}
      {activeTab === 'blog' && (
        <BlogTab
          suggestions={suggestions}
          blogPosts={blogPosts}
          loading={loading}
          generating={generating}
          suggestTopics={suggestTopics}
          generateBlog={generateBlog}
          publishBlog={publishBlog}
          rejectBlog={rejectBlog}
          showToast={showToast}
        />
      )}

      {/* === SPEED TAB === */}
      {activeTab === 'speed' && (
        <SpeedTab showToast={showToast} />
      )}
    </div>
  );
}
