"use client";
import React, { useState, useEffect } from 'react';

const SEO_API = "http://localhost:8001/api/seo";

interface TopicSuggestion {
  title_tr: string;
  title_en: string;
  slug: string;
  keywords: string[];
}

interface BlogPost {
  slug: string;
  title_tr: string;
  title_en: string;
  status: string;
  created_at: string;
}

interface ScheduleSettings {
  days: string[];
  hour: number;
  minute: number;
  enabled: boolean;
}

const DAY_LABELS: Record<string, string> = {
  mon: 'Pzt', tue: 'Sal', wed: 'Car', thu: 'Per', fri: 'Cum', sat: 'Cmt', sun: 'Paz',
};

const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

interface BlogTabProps {
  suggestions: TopicSuggestion[];
  blogPosts: BlogPost[];
  loading: Record<string, boolean>;
  generating: string | null;
  suggestTopics: () => void;
  generateBlog: (topic: TopicSuggestion) => void;
  publishBlog: (slug: string) => void;
  rejectBlog: (slug: string) => void;
  showToast: (msg: string, type: 'ok' | 'err') => void;
}

export default function BlogTab({
  suggestions, blogPosts, loading, generating,
  suggestTopics, generateBlog, publishBlog, rejectBlog, showToast,
}: BlogTabProps) {
  const [schedule, setSchedule] = useState<ScheduleSettings>({
    days: ['mon', 'wed', 'fri'], hour: 10, minute: 0, enabled: true,
  });
  const [savingSchedule, setSavingSchedule] = useState(false);

  useEffect(() => {
    fetch(`${SEO_API}/schedule`)
      .then(r => r.json())
      .then(data => setSchedule(data))
      .catch(() => {});
  }, []);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const saveSchedule = async () => {
    setSavingSchedule(true);
    try {
      const params = new URLSearchParams();
      schedule.days.forEach(d => params.append('days', d));
      params.set('hour', schedule.hour.toString());
      params.set('minute', schedule.minute.toString());
      params.set('enabled', schedule.enabled.toString());

      const r = await fetch(`${SEO_API}/schedule?${params}`, { method: 'PUT' });
      const data = await r.json();
      if (data.status === 'ok') {
        setSchedule(data.settings);
        showToast('Zamanlama kaydedildi!', 'ok');
      }
    } catch {
      showToast('Zamanlama kaydedilemedi', 'err');
    }
    setSavingSchedule(false);
  };

  return (
    <div className="space-y-6">
      {/* AUTOMATION COMMAND PANEL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Automation Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a192f] to-[#172a46] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Otomasyon Merkezi</h2>
              <p className="text-[10px] text-gray-400">Blog uretim pipeline&apos;i</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Status Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${schedule.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
              <span className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
              {schedule.enabled ? 'AKTIF' : 'DEVRE DISI'}
            </div>
            {/* Toggle */}
            <button
              onClick={() => setSchedule(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                schedule.enabled ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                schedule.enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Automation Pipeline Stats */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-6">
            {[
              { label: 'Aktif Gunler', value: `${schedule.days.length}/7`, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { label: 'Calisma Saati', value: `${schedule.hour.toString().padStart(2, '0')}:${schedule.minute.toString().padStart(2, '0')}`, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Haftalik Uretim', value: `${schedule.days.length} yazi`, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { label: 'Motor', value: 'Gemini AI', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-semibold">{s.label}</p>
                  <p className="text-xs font-bold text-gray-700">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Config Body */}
        <div className={`p-6 transition-opacity ${schedule.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          {/* Day Selector */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Uretim Gunleri
            </p>
            <div className="flex gap-2">
              {ALL_DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    schedule.days.includes(day)
                      ? 'bg-[#0a192f] text-white shadow-md shadow-[#0a192f]/20'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selector */}
          <div className="flex items-center gap-4 mb-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Saat
              </p>
              <select
                value={schedule.hour}
                onChange={e => setSchedule(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Dakika
              </p>
              <select
                value={schedule.minute}
                onChange={e => setSchedule(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20"
              >
                {[0, 15, 30, 45].map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary + Save */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#0a192f]/5 to-transparent rounded-xl p-4 border border-[#0a192f]/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a192f]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#0a192f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="text-sm text-gray-600">
                Her{' '}
                <span className="font-bold text-[#0a192f]">
                  {schedule.days.map(d => DAY_LABELS[d]).join(', ')}
                </span>
                {' '}gunu saat{' '}
                <span className="font-bold text-[#0a192f]">
                  {schedule.hour.toString().padStart(2, '0')}:{schedule.minute.toString().padStart(2, '0')}
                </span>
                &apos;da otomatik blog uretilecek
              </div>
            </div>
            <button
              onClick={saveSchedule}
              disabled={savingSchedule || schedule.days.length === 0}
              className="px-5 py-2 bg-[#0a192f] text-white rounded-xl text-sm font-medium hover:bg-[#0a192f]/90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {savingSchedule ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TOPIC SUGGESTIONS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Konu Onerileri</h2>
            <p className="text-sm text-gray-500">Gemini AI ile SEO odakli blog konulari</p>
          </div>
          <button
            onClick={suggestTopics}
            disabled={loading.suggest}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading.suggest ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Oneriliyor...</>
            ) : 'Konu Oner'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-gray-800 text-sm">{topic.title_tr}</p>
                  <p className="text-xs text-gray-400 mt-1">{topic.title_en}</p>
                  <div className="flex gap-1 mt-2">
                    {topic.keywords?.slice(0, 3).map((kw, j) => (
                      <span key={j} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md border border-blue-100">{kw}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => generateBlog(topic)}
                  disabled={generating === topic.slug}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
                >
                  {generating === topic.slug ? (
                    <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Yaziliyor...</>
                  ) : 'Yaz'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BLOG LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Blog Yazilari</h2>
        {blogPosts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Henuz blog yazisi yok. Yukaridan konu onerisi alip yazdirin.</p>
        ) : (
          <div className="space-y-3">
            {blogPosts.map((post, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-gray-800 text-sm">{post.title_tr || post.slug}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.title_en}</p>
                </div>
                <div className="flex items-center gap-2">
                  {post.status === 'published' && (
                    <a
                      href={`/tr/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#0a192f] text-white rounded-lg text-xs font-medium hover:bg-[#0a192f]/80 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Goruntule
                    </a>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    post.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                    post.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {post.status === 'published' ? 'Yayinda' : post.status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                  </span>
                  {post.status === 'draft' && (
                    <>
                      <button onClick={() => publishBlog(post.slug)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700">Onayla</button>
                      <button onClick={() => rejectBlog(post.slug)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">Reddet</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
