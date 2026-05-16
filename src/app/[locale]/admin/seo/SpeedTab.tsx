"use client";
import React, { useState, useRef, useEffect } from 'react';

const SEO_API = "http://localhost:8001/api/seo";

const PAGES = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/hakkimizda', label: 'Hakkimizda' },
  { path: '/iletisim', label: 'Iletisim' },
  { path: '/sss', label: 'SSS' },
  { path: '/blog', label: 'Blog' },
  { path: '/turlar', label: 'Turlar' },
  { path: '/vehicles', label: 'Araclar' },
  { path: '/gizlilik', label: 'Gizlilik' },
  { path: '/kullanim', label: 'Kullanim Kosullari' },
  { path: '/tasiyici', label: 'Tasiyici' },
];

const SPEED_FIX: Record<string, string> = {
  lcp: "LCP iyilestirmek icin: Hero gorsellerini WebP formatina donusturun, lazy loading kullanin, CDN uzerinden sunun ve font preload edin.",
  cls: "CLS iyilestirmek icin: Gorsellere width/height belirtin, font-display: swap kullanin ve dinamik icerik alanlarina sabit boyut verin.",
  fcp: "FCP iyilestirmek icin: Kritik CSS'i inline yapin, render-blocking kaynaklari azaltin ve server response suresini kisaltin.",
  tbt: "TBT iyilestirmek icin: Uzun JavaScript task'larini parcalayin, kullanilmayan JS'i kaldiris ve 3. parti scriptleri lazy yukleyin.",
  si: "SI iyilestirmek icin: Above-the-fold icerik oncelikli yuklensin, skeleton loader kullanin ve gorsel boyutlarini optimize edin.",
  performance: "Genel performans icin: Gorselleri optimize edin, gereksiz JS/CSS'i kaldirin, HTTP/2 kullanin ve cache stratejisi uygulayin.",
};

interface SpeedResult {
  url?: string;
  label?: string;
  strategy?: string;
  performance_score?: number;
  seo_score?: number;
  lcp_ms?: number;
  cls?: number;
  fcp_ms?: number;
  tbt_ms?: number;
  si_ms?: number;
  issues?: Array<{ severity: string; message: string }>;
  error?: string;
  // batch icin
  mobile_score?: number;
  desktop_score?: number;
  mobile_lcp?: number;
  desktop_lcp?: number;
  mobile_cls?: number;
  desktop_cls?: number;
  mobile_opportunities?: Array<{ id: string; title: string; description: string; savings_ms: number; savings_bytes: number; displayValue: string }>;
  desktop_opportunities?: Array<{ id: string; title: string; description: string; savings_ms: number; savings_bytes: number; displayValue: string }>;
}

interface SpeedTabProps {
  showToast: (msg: string, type: 'ok' | 'err') => void;
}

const DAY_MAP: Record<string, string> = {
  mon: 'Pazartesi', tue: 'Sali', wed: 'Carsamba', thu: 'Persembe', fri: 'Cuma', sat: 'Cumartesi', sun: 'Pazar',
};
const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

interface SpeedSchedule {
  day: string;
  hour: number;
  minute: number;
  enabled: boolean;
  auto_after_blog: boolean;
}

export default function SpeedTab({ showToast }: SpeedTabProps) {
  const [selectedPage, setSelectedPage] = useState('/');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [batchResults, setBatchResults] = useState<SpeedResult[]>([]);
  const [expandedFix, setExpandedFix] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [batchStatus, setBatchStatus] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [speedSchedule, setSpeedSchedule] = useState<SpeedSchedule>({
    day: 'mon', hour: 6, minute: 0, enabled: true, auto_after_blog: true,
  });
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [lastReportTime, setLastReportTime] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState<any | null>(null);

  const BASE_URL = "https://rideportx.com";

  // Fetch speed schedule + last report on mount
  useEffect(() => {
    fetch(`${SEO_API}/speed-schedule`)
      .then(r => r.json())
      .then(data => setSpeedSchedule(data))
      .catch(() => {});

    // Son toplu test raporunu cek
    fetch(`${SEO_API}/speed-test/last-report`)
      .then(r => r.json())
      .then(data => {
        if (data.report && data.report.results) {
          const results = typeof data.report.results === 'string'
            ? JSON.parse(data.report.results)
            : data.report.results;
          setBatchResults(results);
          setLastReportTime(data.report.created_at);
        }
      })
      .catch(() => {});
  }, []);

  // Timer
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    setElapsedSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}dk ${sec}sn` : `${sec}sn`;
  };

  // Tekli test
  const runTest = async () => {
    const url = `${BASE_URL}/tr${selectedPage === '/' ? '' : selectedPage}`;
    setLoading(true);
    try {
      const r = await fetch(`${SEO_API}/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`, { method: 'POST' });
      const data = await r.json();
      setResult(data);
      if (!data.error) showToast(`Hiz testi tamamlandi: ${data.performance_score}/100`, 'ok');
      else showToast('Test hatasi: ' + data.error, 'err');
    } catch { showToast('Hiz testi hatasi', 'err'); }
    setLoading(false);
  };

  // Toplu test — hem mobil hem masaustu
  const runBatchTest = async () => {
    setBatchLoading(true);
    setBatchResults([]);
    startTimer();
    const results: SpeedResult[] = [];
    const totalSteps = PAGES.length;

    for (let i = 0; i < PAGES.length; i++) {
      const page = PAGES[i];
      const url = `${BASE_URL}/tr${page.path === '/' ? '' : page.path}`;
      const entry: SpeedResult = { url, label: page.label };

      // Mobil test
      setBatchStatus(`[Mobil] ${page.label} — ${i + 1}/${totalSteps}`);
      try {
        const r = await fetch(`${SEO_API}/pagespeed?url=${encodeURIComponent(url)}&strategy=mobile`, { method: 'POST' });
        const data = await r.json();
        entry.mobile_score = data.performance_score;
        entry.mobile_lcp = data.lcp_ms;
        entry.mobile_cls = data.cls;
        entry.mobile_opportunities = data.opportunities || [];
      } catch { entry.mobile_score = 0; }

      // Masaustu test
      setBatchStatus(`[Masaustu] ${page.label} — ${i + 1}/${totalSteps}`);
      try {
        const r = await fetch(`${SEO_API}/pagespeed?url=${encodeURIComponent(url)}&strategy=desktop`, { method: 'POST' });
        const data = await r.json();
        entry.desktop_score = data.performance_score;
        entry.desktop_lcp = data.lcp_ms;
        entry.desktop_cls = data.cls;
        entry.desktop_opportunities = data.opportunities || [];
      } catch { entry.desktop_score = 0; }

      results.push(entry);
      setBatchResults([...results]);
    }

    stopTimer();
    setBatchLoading(false);
    setBatchStatus('');
    setLastReportTime(new Date().toISOString());
    showToast(`${results.length} sayfa test edildi (Mobil + Masaustu)`, 'ok');

    // Sonuclari DB'ye kaydet
    try {
      await fetch(`${SEO_API}/speed-test/batch`, { method: 'POST' });
    } catch {}
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const scoreBg = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-emerald-600';
    if (score >= 50) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const metricStatus = (name: string, value: number) => {
    const thresholds: Record<string, [number, number]> = {
      lcp: [2500, 4000], fcp: [1800, 3000], tbt: [200, 600], si: [3400, 5800], cls: [0.1, 0.25],
    };
    const t = thresholds[name];
    if (!t) return 'text-gray-700';
    if (value <= t[0]) return 'text-emerald-600';
    if (value <= t[1]) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* SPEED TEST COMMAND PANEL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Command Header — Manuel Test */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a192f] to-[#172a46] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Manuel Hiz Testi</h2>
              <p className="text-[10px] text-gray-400">Sayfa sec, cihaz sec, test et</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Son test tarihi */}
            {lastReportTime && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium bg-white/5 text-gray-400 border border-white/10">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Son: {new Date(lastReportTime).toLocaleDateString('tr-TR')} {new Date(lastReportTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <button
              onClick={runBatchTest}
              disabled={batchLoading}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-xs transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {batchLoading ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {batchResults.length}/{PAGES.length}</>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Tum Sayfalari Test Et
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-6">
            {[
              { label: 'Sayfa Sayisi', value: `${PAGES.length} sayfa`, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { label: 'Mod', value: 'Mobil + Masaustu', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { label: 'Istek / Test', value: `${PAGES.length * 2} API cagrisi`, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
              { label: 'Motor', value: 'Google PageSpeed', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
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

        {/* Single Page Test */}
        <div className="p-6">
          <div className="flex items-end gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                Sayfa
              </p>
              <select
                value={selectedPage}
                onChange={e => setSelectedPage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a192f]/20"
              >
                {PAGES.map(p => (
                  <option key={p.path} value={p.path}>{p.label} ({p.path})</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Cihaz
              </p>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {(['mobile', 'desktop'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStrategy(s)}
                    className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-1.5 ${
                      strategy === s ? 'bg-[#0a192f] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {s === 'mobile' ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    )}
                    {s === 'mobile' ? 'Mobil' : 'Masaustu'}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={runTest}
              disabled={loading}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-medium text-sm hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Test Ediliyor...</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Sayfa Test Et
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SPEED SCHEDULE CONFIG */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Hiz Testi Zamanlama</h3>
              <p className="text-[10px] text-gray-400">Otomatik toplu test zamanini ayarla</p>
            </div>
          </div>
          <button
            onClick={() => setSpeedSchedule(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              speedSchedule.enabled ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              speedSchedule.enabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className={`p-6 transition-opacity ${speedSchedule.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          {/* Day Selector */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Test Gunu
            </p>
            <div className="flex gap-2">
              {ALL_DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSpeedSchedule(prev => ({ ...prev, day }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    speedSchedule.day === day
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {DAY_MAP[day]?.slice(0, 3) || day}
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
                value={speedSchedule.hour}
                onChange={e => setSpeedSchedule(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
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
                value={speedSchedule.minute}
                onChange={e => setSpeedSchedule(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                {[0, 15, 30, 45].map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Auto After Blog Toggle */}
          <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4 border border-purple-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Blog Sonrasi Otomatik Test</p>
                <p className="text-[10px] text-gray-500">Blog yayinlandiginda 5dk sonra toplu hiz testi calisir</p>
              </div>
            </div>
            <button
              onClick={() => setSpeedSchedule(prev => ({ ...prev, auto_after_blog: !prev.auto_after_blog }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                speedSchedule.auto_after_blog ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                speedSchedule.auto_after_blog ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Summary + Save */}
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent rounded-xl p-4 border border-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="text-sm text-gray-600">
                Her{' '}
                <span className="font-bold text-[#0a192f]">{DAY_MAP[speedSchedule.day]}</span>
                {' '}gunu saat{' '}
                <span className="font-bold text-[#0a192f]">
                  {speedSchedule.hour.toString().padStart(2, '0')}:{speedSchedule.minute.toString().padStart(2, '0')}
                </span>
                &apos;da toplu hiz testi yapilacak
              </div>
            </div>
            <button
              onClick={async () => {
                setSavingSchedule(true);
                try {
                  const params = new URLSearchParams();
                  params.set('day', speedSchedule.day);
                  params.set('hour', speedSchedule.hour.toString());
                  params.set('minute', speedSchedule.minute.toString());
                  params.set('enabled', speedSchedule.enabled.toString());
                  params.set('auto_after_blog', speedSchedule.auto_after_blog.toString());
                  const r = await fetch(`${SEO_API}/speed-schedule?${params}`, { method: 'PUT' });
                  const data = await r.json();
                  if (data.status === 'ok') {
                    setSpeedSchedule(data.settings);
                    showToast('Hiz testi zamanlama kaydedildi!', 'ok');
                  }
                } catch {
                  showToast('Zamanlama kaydedilemedi', 'err');
                }
                setSavingSchedule(false);
              }}
              disabled={savingSchedule}
              className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {savingSchedule ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* BATCH PROGRESS */}
      {batchLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700">{batchStatus}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {formatTime(elapsedSeconds)}</span>
              <span className="font-semibold">{batchResults.length}/{PAGES.length}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
              style={{ width: `${(batchResults.length / PAGES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* SINGLE RESULT */}
      {result && !result.error && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { label: 'Performans', value: result.performance_score, suffix: '/100', key: 'performance' },
              { label: 'SEO', value: result.seo_score, suffix: '/100', key: 'seo' },
              { label: 'LCP', value: result.lcp_ms ? `${(result.lcp_ms / 1000).toFixed(1)}s` : '-', rawMs: result.lcp_ms, key: 'lcp' },
              { label: 'FCP', value: result.fcp_ms ? `${(result.fcp_ms / 1000).toFixed(1)}s` : '-', rawMs: result.fcp_ms, key: 'fcp' },
              { label: 'TBT', value: result.tbt_ms ? `${result.tbt_ms}ms` : '-', rawMs: result.tbt_ms, key: 'tbt' },
              { label: 'CLS', value: result.cls !== undefined ? result.cls.toFixed(3) : '-', rawMs: result.cls, key: 'cls' },
            ].map((metric, i) => {
              const isScore = typeof metric.value === 'number' && metric.suffix;
              const color = isScore
                ? scoreColor(metric.value as number)
                : metric.rawMs !== undefined ? metricStatus(metric.key, metric.rawMs) : 'text-gray-700';
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">{metric.label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{metric.value}{metric.suffix || ''}</p>
                  {SPEED_FIX[metric.key] && (
                    <button
                      onClick={() => setExpandedFix(expandedFix === metric.key ? null : metric.key)}
                      className="mt-2 text-[10px] text-blue-500 hover:text-blue-700 font-medium"
                    >
                      {expandedFix === metric.key ? 'Kapat' : '💡 Nasil Iyilestirilir?'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {expandedFix && SPEED_FIX[expandedFix] && (
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <p className="text-sm text-blue-800 leading-relaxed">{SPEED_FIX[expandedFix]}</p>
              </div>
            </div>
          )}

          {result.issues && result.issues.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">Sorunlar</h3>
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${
                    issue.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-100' :
                    issue.severity === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${issue.severity === 'critical' ? 'bg-red-500' : issue.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} /> {issue.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BATCH RESULTS TABLE */}
      {batchResults.length > 0 && !batchLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Toplu Test Sonuclari</h3>
              <span className="text-xs text-gray-400">
                {lastReportTime
                  ? `Son test: ${new Date(lastReportTime).toLocaleDateString('tr-TR')} ${new Date(lastReportTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
                  : elapsedSeconds > 0 ? `Sure: ${formatTime(elapsedSeconds)}` : ''}
              </span>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {(() => {
                const mScores = batchResults.filter(r => r.mobile_score).map(r => r.mobile_score!);
                const dScores = batchResults.filter(r => r.desktop_score).map(r => r.desktop_score!);
                const mAvg = mScores.length > 0 ? Math.round(mScores.reduce((a, b) => a + b, 0) / mScores.length) : 0;
                const dAvg = dScores.length > 0 ? Math.round(dScores.reduce((a, b) => a + b, 0) / dScores.length) : 0;
                return [
                  { label: 'Ort. Mobil', value: `${mAvg}/100`, color: scoreBg(mAvg) },
                  { label: 'Ort. Masaustu', value: `${dAvg}/100`, color: scoreBg(dAvg) },
                  { label: 'Test Edilen', value: `${batchResults.length} sayfa`, color: 'from-blue-500 to-blue-600' },
                  { label: 'Toplam Test', value: `${batchResults.length * 2} istek`, color: 'from-purple-500 to-purple-600' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">{s.label}</p>
                    <p className={`text-lg font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-2 bg-gray-50 border-y border-gray-100 grid grid-cols-12 gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4">Sayfa</div>
            <div className="col-span-2 text-center"><span className="flex items-center justify-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>Mobil</span></div>
            <div className="col-span-2 text-center"><span className="flex items-center justify-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Masaustu</span></div>
            <div className="col-span-2 text-center">LCP</div>
            <div className="col-span-2 text-center">CLS</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-50">
            {batchResults.map((r, i) => {
              const hasOpps = (r.mobile_opportunities && r.mobile_opportunities.length > 0) || (r.desktop_opportunities && r.desktop_opportunities.length > 0);
              const isExpanded = expandedRow === i;
              return (
                <div key={i}>
                  <div
                    className={`px-6 py-3 grid grid-cols-12 gap-2 items-center transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}
                    onClick={() => setExpandedRow(isExpanded ? null : i)}
                  >
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{r.label}</p>
                        {hasOpps && (
                          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 truncate">{r.url}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`text-lg font-bold ${r.mobile_score ? scoreColor(r.mobile_score) : 'text-gray-300'}`}>
                        {r.mobile_score || '-'}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`text-lg font-bold ${r.desktop_score ? scoreColor(r.desktop_score) : 'text-gray-300'}`}>
                        {r.desktop_score || '-'}
                      </span>
                    </div>
                    <div className="col-span-2 text-center text-xs">
                      <div className="flex flex-col gap-0.5">
                        {r.mobile_lcp !== undefined && (
                          <span className={metricStatus('lcp', r.mobile_lcp)}>M {(r.mobile_lcp / 1000).toFixed(1)}s</span>
                        )}
                        {r.desktop_lcp !== undefined && (
                          <span className={metricStatus('lcp', r.desktop_lcp)}>D {(r.desktop_lcp / 1000).toFixed(1)}s</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-xs">
                      <div className="flex flex-col gap-0.5">
                        {r.mobile_cls !== undefined && (
                          <span className={metricStatus('cls', r.mobile_cls)}>M {r.mobile_cls.toFixed(3)}</span>
                        )}
                        {r.desktop_cls !== undefined && (
                          <span className={metricStatus('cls', r.desktop_cls)}>D {r.desktop_cls.toFixed(3)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Diagnostics */}
                  {isExpanded && hasOpps && (
                    <div className="px-6 py-4 bg-gradient-to-b from-blue-50/40 to-white border-t border-blue-100/50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Mobil Oneriler */}
                        {r.mobile_opportunities && r.mobile_opportunities.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mobil Oneriler</span>
                            </div>
                            <div className="space-y-2">
                              {r.mobile_opportunities.map((opp, j) => (
                                <div key={j} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 min-w-0">
                                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 leading-tight">{opp.title}</p>
                                        {opp.displayValue && <p className="text-[10px] text-gray-400 mt-0.5">{opp.displayValue}</p>}
                                      </div>
                                    </div>
                                    {opp.savings_ms > 0 && (
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">
                                        -{(opp.savings_ms / 1000).toFixed(1)}s
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Masaustu Oneriler */}
                        {r.desktop_opportunities && r.desktop_opportunities.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Masaustu Oneriler</span>
                            </div>
                            <div className="space-y-2">
                              {r.desktop_opportunities.map((opp, j) => (
                                <div key={j} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 min-w-0">
                                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-800 leading-tight">{opp.title}</p>
                                        {opp.displayValue && <p className="text-[10px] text-gray-400 mt-0.5">{opp.displayValue}</p>}
                                      </div>
                                    </div>
                                    {opp.savings_ms > 0 && (
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">
                                        -{(opp.savings_ms / 1000).toFixed(1)}s
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Mobilde düşük skor açıklaması */}
                      {r.mobile_score && r.desktop_score && r.mobile_score < r.desktop_score - 10 && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                          <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            <span className="font-bold">Neden mobilde dusuk?</span> Google, mobil testi yavaslatilmis CPU (4x) ve yavas internet (4G) ile simule eder. 
                            Masaustune gore cok daha katı kosullar uygulanir. Buyuk gorseller, agir JavaScript ve yavaş sunucu yanitlari mobilde daha fazla etki yaratir.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REPORT HISTORY */}
      {!batchLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => {
              if (!historyExpanded && reportHistory.length === 0) {
                fetch(`${SEO_API}/speed-test/history`)
                  .then(r => r.json())
                  .then(data => setReportHistory(data.reports || []))
                  .catch(() => {});
              }
              setHistoryExpanded(!historyExpanded);
            }}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-sm">Rapor Gecmisi</h3>
                <p className="text-[10px] text-gray-400">Gecmis toplu hiz testi raporlari</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${historyExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>

          {historyExpanded && (
            <div className="border-t border-gray-100">
              {reportHistory.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-400">Henuz rapor gecmisi bulunmuyor</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {reportHistory.map((report, i) => (
                    <div key={report.id}>
                      <button
                        onClick={() => setSelectedHistoryReport(selectedHistoryReport?.id === report.id ? null : report)}
                        className={`w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left ${selectedHistoryReport?.id === report.id ? 'bg-purple-50/30' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">{i + 1}</div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {new Date(report.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {new Date(report.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} — {report.page_count} sayfa
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className={`text-sm font-bold ${scoreColor(report.mobile_avg)}`}>M {report.mobile_avg}</span>
                            <span className="text-gray-300 mx-1">/</span>
                            <span className={`text-sm font-bold ${scoreColor(report.desktop_avg)}`}>D {report.desktop_avg}</span>
                          </div>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${selectedHistoryReport?.id === report.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </button>

                      {selectedHistoryReport?.id === report.id && (
                        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
                          <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                            <div className="col-span-5">Sayfa</div>
                            <div className="col-span-2 text-center">Mobil</div>
                            <div className="col-span-2 text-center">Masaustu</div>
                            <div className="col-span-3 text-center">LCP</div>
                          </div>
                          {report.results.map((r: any, j: number) => (
                            <div key={j} className="grid grid-cols-12 gap-2 items-center py-1.5 px-1 text-xs">
                              <div className="col-span-5 truncate text-gray-600">{r.label || r.url}</div>
                              <div className="col-span-2 text-center">
                                <span className={`font-bold ${r.mobile_score ? scoreColor(r.mobile_score) : 'text-gray-300'}`}>{r.mobile_score || '-'}</span>
                              </div>
                              <div className="col-span-2 text-center">
                                <span className={`font-bold ${r.desktop_score ? scoreColor(r.desktop_score) : 'text-gray-300'}`}>{r.desktop_score || '-'}</span>
                              </div>
                              <div className="col-span-3 text-center text-[10px] text-gray-400">
                                {r.mobile_lcp ? `M ${(r.mobile_lcp / 1000).toFixed(1)}s` : ''}
                                {r.mobile_lcp && r.desktop_lcp ? ' / ' : ''}
                                {r.desktop_lcp ? `D ${(r.desktop_lcp / 1000).toFixed(1)}s` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {!result && batchResults.length === 0 && !loading && !batchLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Henuz hiz testi yapilmadi</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Tek sayfa test etmek icin yukaridaki secenekleri kullanin veya &quot;Tum Sayfalari Test Et&quot; ile hem mobil hem masaustu toplu test yapin.
          </p>
        </div>
      )}
    </div>
  );
}
