/* eslint-disable @next/next/no-img-element */
"use client"

import { useTranslation } from "react-i18next";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { EventItem } from "@/types";
import { eventData } from "@/data/eventData";

const SkeletonCard = () => (
  <Card gradient={false} className="animate-pulse">
    <div className="w-full h-48 bg-white/10"></div>
    <div className="p-6">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-full mb-4"></div>
      <div className="h-10 bg-white/10 rounded w-full"></div>
    </div>
  </Card>
);

export default function EventList() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const lang = params?.lang as string || 'en';

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEvents(eventData[lang as keyof typeof eventData] || eventData.zh);
      setLoading(false);
    }, 1000);
  }, [lang]);

  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.startDate) > currentDate);
  const currentEvents = events.filter(event => new Date(event.startDate) <= currentDate && new Date(event.endDate) >= currentDate);
  const pastEvents = events.filter(event => new Date(event.endDate) < currentDate);

  const renderEventCard = (event: EventItem) => (
    <div className="w-full px-2">
      <div className="card bg-base-100 shadow-xl h-[420px]">
        <figure className="h-48">
          <img
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-xl font-bold">{event.title}</h2>
          <p className="text-base-content/70 line-clamp-2 h-12">
            {event.content}
          </p>
          <div className="card-actions justify-end mt-auto">
            {event.buttons && event.buttons.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {event.buttons.map((button, index) => (
                  <Button 
                    key={index}
                    className="btn-primary"
                  >
                    <Link href={button.link} target="_blank">
                      {button.text}
                    </Link>
                  </Button>
                ))}
              </div>
            ) : (
              <Button className="btn-primary">
                {t('events.comingSoon')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {t('events.title')}
      </h1>
      
      {loading ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {t('common.loading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {currentEvents.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {t('events.current')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event, index) => (
                  <div key={index}>{renderEventCard(event)}</div>
                ))}
              </div>
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {t('events.upcoming')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <div key={index}>{renderEventCard(event)}</div>
                ))}
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {t('events.past')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event, index) => (
                  <div key={index}>{renderEventCard(event)}</div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
