// src/components/NotesCarouselClient.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ArticleCard from '@/components/ui/article-card';

interface NoteItem {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

interface Props {
  notes: NoteItem[];
}

export default function NotesCarouselClient({ notes }: Props) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Latest Notes</h2>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {notes.map(note => (
          <SwiperSlide key={note.href}>
            <ArticleCard
              href={note.href}
              title={note.title}
              excerpt={note.excerpt}
              date={note.date}
              readingTime={note.readingTime}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
