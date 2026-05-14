import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import TourDetailClient from './TourDetailClient';

async function getTour(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch tour', error);
    return null;
  }
}

export async function generateMetadata({ params: { locale, id } }: { params: { locale: string, id: string } }): Promise<Metadata> {
  const tour = await getTour(id);
  if (!tour) return { title: 'Not Found' };

  const title = locale === 'en' && tour.title_en ? tour.title_en : tour.title_tr;
  const description = locale === 'en' && tour.overview_en ? tour.overview_en : (tour.overview_tr || tour.description_tr || '');

  return {
    title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || 'RidePortX'}`,
    description,
    openGraph: {
      title,
      description,
      images: tour.image_url ? [`${process.env.NEXT_PUBLIC_API_URL}/static/${tour.image_url}`] : []
    }
  };
}

export default async function TourDetailPage({ params: { locale, id } }: { params: { locale: string, id: string } }) {
  const tour = await getTour(id);

  if (!tour) {
    notFound();
  }

  // Handle translations on the server if needed for passing to client
  const localizedTour = {
    ...tour,
    title_tr: locale === 'en' && tour.title_en ? tour.title_en : tour.title_tr,
    description_tr: locale === 'en' && tour.description_en ? tour.description_en : tour.description_tr,
    overview_tr: locale === 'en' && tour.overview_en ? tour.overview_en : tour.overview_tr,
    program_tr: locale === 'en' && tour.program_en ? tour.program_en : tour.program_tr,
    included_tr: locale === 'en' && tour.included_en ? tour.included_en : tour.included_tr,
    excluded_tr: locale === 'en' && tour.excluded_en ? tour.excluded_en : tour.excluded_tr,
    notes_tr: locale === 'en' && tour.notes_en ? tour.notes_en : tour.notes_tr,
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      <Header />
      <TourDetailClient tour={localizedTour} />
    </main>
  );
}
