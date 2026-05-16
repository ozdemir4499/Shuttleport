"use client";
import React, { useState, useEffect } from 'react';

interface HistoryEntry {
  id: string;
  type: 'crawl' | 'broken';
  date: string;
  avgScore?: number;
  totalPages?: number;
  issueCount?: number;
  brokenCount?: number;
  crawlData?: PageReport[];
  brokenData?: BrokenLink[];
}

const SEO_API = "https://rideportx.com/api/seo";

interface PageReport {
  url: string;
  seo_score: number;
  title: string;
  locale?: string;
  issues: Array<{ type: string; severity: string; message: string }>;
}

interface BrokenLink {
  source: string;
  broken_url: string;
  status: number | string;
}

// Her sorun tipi icin fix onerisi
const FIX_SUGGESTIONS: Record<string, string> = {
  title_missing: "Sayfanin <head> bolumune <title> etiketi ekleyin. Ornek: <title>Istanbul Havalimani Transfer | RidePortX</title>",
  title_short: "Title etiketini en az 30 karakter olacak sekilde genisletin. Marka adi ve anahtar kelime icersin.",
  title_long: "Title etiketini 65 karaktere kisaltin. Google arama sonuclarinda kesilebilir.",
  meta_desc_missing: "Sayfaya <meta name='description' content='...'> etiketi ekleyin. 120-160 karakter arasi olmali.",
  meta_desc_short: "Meta description'i en az 120 karakter olacak sekilde genisletin. Sayfanin icerigini ozetlesin.",
  meta_desc_long: "Meta description'i 160 karaktere kisaltin. Fazla uzun aciklamalar Google tarafindan kesilir.",
  h1_missing: "Sayfaya bir adet <h1> etiketi ekleyin. Sayfanin ana basligini icermeli ve anahtar kelime barindirmali.",
  h1_multiple: "Sayfada birden fazla <h1> var. Sadece 1 adet <h1> kullanin, diger basliklar icin <h2>, <h3> kullanin.",
  img_alt_missing: "Alt etiketi olmayan gorsellere aciklayici alt text ekleyin. Ornek: alt='Istanbul Boğaz Koprusu manzarasi'",
  og_title_missing: "Open Graph title etiketi ekleyin: <meta property='og:title' content='...' />",
  og_image_missing: "Open Graph image etiketi ekleyin: <meta property='og:image' content='...' />. Sosyal medya paylasimlarinda gorsel gozukur.",
  canonical_missing: "Canonical URL ekleyin: <link rel='canonical' href='...' />. Duplicate content sorunlarini onler.",
  hreflang_incomplete: "Her dil icin hreflang etiketi ekleyin: <link rel='alternate' hreflang='tr' href='...' />. 4 dil icin 4 etiket olmali.",
  schema_missing: "JSON-LD schema markup ekleyin. Google zengin sonuc kartlari icin gerekli. Organization veya LocalBusiness schema kullanin.",
  favicon_missing: "Favicon ekleyin: <link rel='icon' href='/favicon.ico' />. Tarayici sekmesinde ve yer imlerinde gorunur.",
  few_internal_links: "Sayfaya daha fazla internal link ekleyin. Diger sayfalara yonlendiren en az 3-5 link olmali.",
  http_error: "Sayfa HTTP hata dondurdu. Sayfanin var oldugundan ve dogru route'a sahip oldugundan emin olun.",
};

const LOCALE_LABELS: Record<string, string> = {
  all: 'Tumu',
  tr: '🇹🇷 Turkce',
  en: '🇬🇧 English',
  de: '🇩🇪 Deutsch',
  ru: '🇷🇺 Русский',
};

interface CrawlerTabProps {
  showToast: (msg: string, type: 'ok' | 'err') => void;
}

export default function CrawlerTab({ showToast }: CrawlerTabProps) {
  const [crawlResults, setCrawlResults] = useState<PageReport[]>([]);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expandedFix, setExpandedFix] = useState<string | null>(null);
  const [localeFilter, setLocaleFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'critical' | 'warning' | 'low'>('all');
  const [showBrokenLinks, setShowBrokenLinks] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<Record<string, any>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('seo_crawl_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveHistory = (entry: HistoryEntry) => {
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 20);
      localStorage.setItem('seo_crawl_history', JSON.stringify(updated));
      return updated;
    });
  };

  const runCrawl = async () => {
    setLoading(p => ({ ...p, crawl: true }));
    try {
      const r = await fetch(`${SEO_API}/crawl?use_local=true`, { method: 'POST' });
      const data = await r.json();
      const results = data.results || [];
      setCrawlResults(results);
      showToast(`${data.pages_crawled} sayfa tarandi`, 'ok');
      const avg = results.length > 0 ? Math.round(results.reduce((a: number, b: PageReport) => a + b.seo_score, 0) / results.length) : 0;
      const issues = results.filter((p: PageReport) => p.issues && p.issues.length > 0).length;
      saveHistory({ id: Date.now().toString(), type: 'crawl', date: new Date().toISOString(), avgScore: avg, totalPages: results.length, issueCount: issues, crawlData: results });
    } catch { showToast('Crawl hatasi', 'err'); }
    setLoading(p => ({ ...p, crawl: false }));
  };

  const checkBrokenLinks = async () => {
    setLoading(p => ({ ...p, broken: true }));
    setShowBrokenLinks(true);
    try {
      const r = await fetch(`${SEO_API}/broken-links?use_local=true`, { method: 'POST' });
      const data = await r.json();
      const links = data.broken_links || [];
      setBrokenLinks(links);
      showToast(`${data.total} kirik link bulundu`, data.total > 0 ? 'err' : 'ok');
      saveHistory({ id: Date.now().toString(), type: 'broken', date: new Date().toISOString(), brokenCount: links.length, brokenData: links });
    } catch { showToast('Kirik link kontrolu hatasi', 'err'); }
    setLoading(p => ({ ...p, broken: false }));
  };

  const runAiAnalyze = async (url: string) => {
    setAiLoading(url);
    try {
      const r = await fetch(`${SEO_API}/ai-analyze?url=${encodeURIComponent(url)}`, { method: 'POST' });
      const data = await r.json();
      if (data.error) { showToast('AI analiz hatasi: ' + data.error, 'err'); }
      else {
        setAiResult(prev => ({ ...prev, [url]: data }));
        showToast('AI analiz tamamlandi', 'ok');
      }
    } catch { showToast('AI analiz hatasi', 'err'); }
    setAiLoading(null);
  };

  // Locale cikart (URL'den)
  const getLocale = (url: string): string => {
    const match = url.match(/\/(tr|en|de|ru)\//);
    return match ? match[1] : 'tr';
  };

  // Filtrele
  const filtered = crawlResults.filter(page => {
    const locale = getLocale(page.url);
    if (localeFilter !== 'all' && locale !== localeFilter) return false;
    if (scoreFilter === 'critical' && page.seo_score > 50) return false;
    if (scoreFilter === 'warning' && (page.seo_score > 80 || page.seo_score <= 50)) return false;
    if (scoreFilter === 'low' && page.seo_score >= 80) return false;
    return true;
  });

  // Istatistikler
  const stats = {
    total: crawlResults.length,
    avgScore: crawlResults.length > 0 ? Math.round(crawlResults.reduce((a, b) => a + b.seo_score, 0) / crawlResults.length) : 0,
    critical: crawlResults.filter(p => p.seo_score <= 50).length,
    warnings: crawlResults.filter(p => p.issues && p.issues.length > 0).length,
    perfect: crawlResults.filter(p => p.seo_score === 100).length,
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const scoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const severityIcon = (s: string) => {
    if (s === 'critical') return <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></span>;
    if (s === 'warning') return <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01" /></svg></span>;
    return <span className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01" /></svg></span>;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Site Tarama & SEO Analiz</h2>
          <p className="text-sm text-gray-500">Tum sayfalari tarayip SEO sorunlarini bul ve duzelt</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={checkBrokenLinks}
            disabled={loading.broken}
            className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium text-sm hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading.broken ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kontrol...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> Kirik Linkler</>
            )}
          </button>
          <button
            onClick={runCrawl}
            disabled={loading.crawl}
            className="px-5 py-2.5 bg-[#0a192f] text-white rounded-xl font-medium text-sm hover:bg-[#0a192f]/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading.crawl ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Taraniyor...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Tarama Baslat</>
            )}
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      {crawlResults.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Taranan Sayfa', value: stats.total, iconSvg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, iconBg: 'bg-blue-50 text-blue-600', color: 'from-blue-500 to-blue-600' },
            { label: 'Ort. Skor', value: `${stats.avgScore}/100`, iconSvg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, iconBg: stats.avgScore >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600', color: stats.avgScore >= 80 ? 'from-emerald-500 to-emerald-600' : stats.avgScore >= 50 ? 'from-amber-500 to-amber-600' : 'from-red-500 to-red-600' },
            { label: 'Kritik Hata', value: stats.critical, iconSvg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, iconBg: stats.critical > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600', color: stats.critical > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600' },
            { label: 'Uyari', value: stats.warnings, iconSvg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.832c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>, iconBg: 'bg-amber-50 text-amber-600', color: 'from-amber-500 to-amber-600' },
            { label: 'Mukemmel', value: stats.perfect, iconSvg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, iconBg: 'bg-emerald-50 text-emerald-600', color: 'from-emerald-500 to-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  {stat.iconSvg}
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* FILTERS */}
      {crawlResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Locale Filter */}
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Dil Filtresi</p>
              <div className="flex gap-1.5 flex-wrap">
                {Object.entries(LOCALE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setLocaleFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      localeFilter === key
                        ? 'bg-[#0a192f] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Score Filter */}
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Skor Filtresi</p>
              <div className="flex gap-1.5 flex-wrap">
                {([
                  { key: 'all', label: 'Tumu', color: 'bg-gray-100 text-gray-600' },
                  { key: 'low', label: '< 80 Skor', color: 'bg-amber-100 text-amber-700' },
                  { key: 'critical', label: 'Kritik (< 50)', color: 'bg-red-100 text-red-700' },
                ] as const).map(f => (
                  <button
                    key={f.key}
                    onClick={() => setScoreFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      scoreFilter === f.key
                        ? 'bg-[#0a192f] text-white shadow-md'
                        : f.color + ' hover:opacity-80'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-end">
              <span className="text-xs text-gray-400 font-medium">{filtered.length} / {crawlResults.length} sayfa</span>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((page, i) => {
            const locale = getLocale(page.url);
            const localeFlag = locale === 'tr' ? '🇹🇷' : locale === 'en' ? '🇬🇧' : locale === 'de' ? '🇩🇪' : '🇷🇺';
            const pagePath = page.url.replace(/https?:\/\/[^\/]+/, '');
            
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm">{localeFlag}</span>
                      <p className="text-sm font-semibold text-gray-800 truncate">{pagePath}</p>
                      {page.title && <span className="text-xs text-gray-400 truncate hidden lg:inline">— {page.title}</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${scoreColor(page.seo_score)}`}>
                        {page.seo_score}/100
                      </span>
                      <a
                        href={page.url.replace('localhost:3000', 'rideportx.com')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all border border-gray-100 hover:border-blue-200"
                        title="Sayfayi yeni sekmede ac"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(page.seo_score)}`}
                      style={{ width: `${page.seo_score}%` }}
                    />
                  </div>
                </div>

                {/* Issues */}
                {page.issues && page.issues.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {page.issues.map((issue, j) => (
                        <div key={j}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{severityIcon(issue.severity)}</span>
                              <span className="text-xs text-gray-700 font-medium">{issue.message}</span>
                            </div>
                            {FIX_SUGGESTIONS[issue.type] && (
                              <button
                                onClick={() => setExpandedFix(expandedFix === `${i}-${j}` ? null : `${i}-${j}`)}
                                className="text-[10px] px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors shrink-0"
                              >
                                {expandedFix === `${i}-${j}` ? 'Kapat' : 'Nasil Duzeltilir?'}
                              </button>
                            )}
                          </div>
                          {expandedFix === `${i}-${j}` && FIX_SUGGESTIONS[issue.type] && (
                            <div className="mt-2 ml-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                <p className="text-xs text-blue-800 leading-relaxed">{FIX_SUGGESTIONS[issue.type]}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No issues */}
                {(!page.issues || page.issues.length === 0) && page.seo_score === 100 && (
                  <div className="px-4 pb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-xs text-emerald-600 font-medium">Sorun bulunamadi — Mukemmel!</span>
                  </div>
                )}

                {/* AI Analyze Button */}
                <div className="px-4 pb-3 flex items-center gap-2">
                  <button
                    onClick={() => runAiAnalyze(page.url)}
                    disabled={aiLoading === page.url}
                    className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {aiLoading === page.url ? (
                      <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> AI Analiz Ediliyor...</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> AI ile Analiz Et</>
                    )}
                  </button>
                  {aiResult[page.url] && !aiLoading && (
                    <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      Analiz hazir
                    </span>
                  )}
                </div>

                {/* AI Result Panel */}
                {aiResult[page.url] && (() => {
                  const ai = aiResult[page.url];
                  return (
                    <div className="mx-4 mb-4 rounded-xl border border-gray-200 overflow-hidden">
                      {/* AI Header */}
                      <div className="bg-gradient-to-r from-[#0a192f] to-[#1a365d] px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">AI SEO Onerileri</h4>
                            <p className="text-[9px] text-white/50">Gemini ile olusturuldu</p>
                          </div>
                        </div>
                        <button onClick={() => setAiResult(prev => { const n = {...prev}; delete n[page.url]; return n; })} className="p-1 rounded-md hover:bg-white/10 transition-colors">
                          <svg className="w-4 h-4 text-white/40 hover:text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      {/* AI Content */}
                      <div className="bg-gray-50/50 p-4 space-y-3">
                        {/* Title + Meta + H1 Cards */}
                        <div className="grid grid-cols-1 gap-2.5">
                          {ai.title_suggestion && (
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Onerilen Title</p>
                              </div>
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">{ai.title_suggestion}</p>
                            </div>
                          )}

                          {ai.meta_description_suggestion && (
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Onerilen Meta Description</p>
                              </div>
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">{ai.meta_description_suggestion}</p>
                            </div>
                          )}

                          {ai.h1_suggestion && (
                            <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-violet-50 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Onerilen H1</p>
                              </div>
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">{ai.h1_suggestion}</p>
                            </div>
                          )}
                        </div>

                        {/* Content Tips */}
                        {ai.content_tips && ai.content_tips.length > 0 && (
                          <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Icerik Iyilestirme</p>
                            </div>
                            <div className="space-y-2">
                              {ai.content_tips.map((tip: string, ti: number) => (
                                <div key={ti} className="flex items-start gap-2.5 pl-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  <p className="text-xs text-gray-700 leading-relaxed">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Keywords */}
                        {ai.missing_keywords && ai.missing_keywords.length > 0 && (
                          <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                              </div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Eksik Anahtar Kelimeler</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {ai.missing_keywords.map((kw: string, ki: number) => (
                                <span key={ki} className="px-2.5 py-1 bg-red-50 text-red-700 text-[11px] font-medium rounded-lg border border-red-100">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Overall Assessment */}
                        {ai.overall_assessment && (
                          <div className="bg-gradient-to-r from-[#0a192f] to-[#1a365d] rounded-xl p-3.5">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Genel Degerlendirme</p>
                            </div>
                            <p className="text-xs text-white/90 leading-relaxed">{ai.overall_assessment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {crawlResults.length === 0 && !loading.crawl && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Henuz tarama yapilmadi</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            &quot;Tarama Baslat&quot; butonuna basarak tum sitenizi tarayabilir ve SEO sorunlarini tespit edebilirsiniz.
          </p>
        </div>
      )}

      {/* BROKEN LINKS SECTION */}
      {showBrokenLinks && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Kirik Link Raporu</h3>
              <p className="text-xs text-gray-400">{brokenLinks.length} kirik link bulundu</p>
            </div>
          </div>

          {loading.broken ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-red-300 border-t-red-600 rounded-full animate-spin mr-3" />
              <span className="text-sm text-gray-500">Linkler kontrol ediliyor...</span>
            </div>
          ) : brokenLinks.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm text-emerald-600 font-medium mt-2">Kirik link bulunamadi!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {brokenLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-800 font-medium truncate">{link.broken_url}</p>
                    <p className="text-[10px] text-gray-400 truncate">Kaynak: {link.source}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md shrink-0 ml-2">
                    {link.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-800">Tarama Gecmisi</h3>
              <p className="text-[10px] text-gray-400">{history.length} kayit</p>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        {showHistory && (
          <div className="border-t border-gray-100">
            {history.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">Henuz gecmis yok</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {history.map(h => {
                  const isExpanded = expandedHistory === h.id;
                  return (
                    <div key={h.id}>
                      <button
                        onClick={() => setExpandedHistory(isExpanded ? null : h.id)}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.type === 'crawl' ? 'bg-blue-50' : 'bg-red-50'}`}>
                            {h.type === 'crawl' ? (
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            )}
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-700">
                              {h.type === 'crawl' ? 'Site Tarama' : 'Kirik Link Kontrolu'}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(h.date).toLocaleString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          {h.type === 'crawl' && (
                            <>
                              <span className="text-gray-500">{h.totalPages} sayfa</span>
                              <span className={`font-bold ${(h.avgScore || 0) >= 80 ? 'text-emerald-600' : (h.avgScore || 0) >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                {h.avgScore}/100
                              </span>
                              {(h.issueCount || 0) > 0 && <span className="text-amber-600">{h.issueCount} sorun</span>}
                            </>
                          )}
                          {h.type === 'broken' && (
                            <span className={(h.brokenCount || 0) > 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                              {h.brokenCount} kirik link
                            </span>
                          )}
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-4">
                          {h.type === 'crawl' && h.crawlData && h.crawlData.length > 0 && (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                              {h.crawlData.map((page, pi) => {
                                const pagePath = page.url.replace(/https?:\/\/[^\/]+/, '');
                                const hasIssues = page.issues && page.issues.length > 0;
                                return (
                                  <div key={pi} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-xs font-medium text-gray-700 truncate">{pagePath}</p>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${page.seo_score >= 80 ? 'bg-emerald-50 text-emerald-600' : page.seo_score >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                        {page.seo_score}/100
                                      </span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 rounded-full mb-1">
                                      <div className={`h-full rounded-full ${page.seo_score >= 80 ? 'bg-emerald-500' : page.seo_score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${page.seo_score}%` }} />
                                    </div>
                                    {hasIssues && (
                                      <div className="mt-2 space-y-1">
                                        {page.issues.map((issue, ii) => (
                                          <p key={ii} className="text-[10px] text-gray-500">
                                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${issue.severity === 'critical' ? 'bg-red-500' : issue.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} /> {issue.message}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {h.type === 'broken' && h.brokenData && (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {h.brokenData.length === 0 ? (
                                <div className="flex items-center justify-center gap-1.5 py-3">
                                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                  <p className="text-xs text-emerald-600">Kirik link bulunamadi</p>
                                </div>
                              ) : (
                                h.brokenData.map((link, li) => (
                                  <div key={li} className="flex items-center justify-between p-2.5 bg-red-50/50 rounded-lg border border-red-100">
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[11px] text-gray-800 font-medium truncate">{link.broken_url}</p>
                                      <p className="text-[10px] text-gray-400 truncate">Kaynak: {link.source}</p>
                                    </div>
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded shrink-0 ml-2">{link.status}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          {!h.crawlData && !h.brokenData && (
                            <p className="text-xs text-gray-400 text-center py-3">Detay verisi mevcut degil (eski kayit)</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {history.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100">
                <button
                  onClick={() => { setHistory([]); localStorage.removeItem('seo_crawl_history'); showToast('Gecmis temizlendi', 'ok'); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Gecmisi Temizle
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
