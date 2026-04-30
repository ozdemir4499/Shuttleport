"use client";
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Handle localized routes like /en/admin or /tr/admin as well as /admin
  if (pathname && (pathname.startsWith('/admin') || pathname.includes('/admin'))) {
    return null;
  }
  
  return <Footer />;
}
