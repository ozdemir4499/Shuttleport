import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import TurlarClient from './TurlarClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Turlar' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

async function getTours(locale: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    
    // Map to required format
    const t = await getTranslations({ locale, namespace: 'Tours' });
    return data.map((tData: any) => ({
      id: tData.id,
      slug: tData.slug,
      title: locale === 'en' && tData.title_en ? tData.title_en : tData.title_tr,
      shortTitle: locale === 'en' && tData.title_en ? tData.title_en : tData.title_tr,
      image: tData.image_url ? `${process.env.NEXT_PUBLIC_API_URL}/static/${tData.image_url}` : 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800',
      badge: locale === 'en' && tData.badge_en ? tData.badge_en : tData.badge_tr,
      duration: t('notSpecified'),
      groupSize: t('notSpecified'),
      date: t('everyday'),
      prices: { adult: { try: tData.price, eur: tData.price / 35, usd: tData.price / 32, gbp: tData.price / 40 } },
      oldPrices: { adult: { try: tData.price * 1.2, eur: (tData.price * 1.2) / 35, usd: (tData.price * 1.2) / 32, gbp: (tData.price * 1.2) / 40 } }
    }));
  } catch (error) {
    console.error('Failed to fetch tours', error);
    return [];
  }
}

export default async function TurlarPage({ params: { locale } }: { params: { locale: string } }) {
  const tours = await getTours(locale);
  return <TurlarClient initialTours={tours} />;
}
