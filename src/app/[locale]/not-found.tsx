import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Sayfa Bulunamadı / Page Not Found</h2>
      <p>Aradığınız sayfa mevcut değil. / The page you are looking for does not exist.</p>
      <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Ana Sayfaya Dön / Return to Home
      </Link>
    </div>
  );
}
