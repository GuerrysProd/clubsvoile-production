import type { ReactNode } from 'react';
import MapSimple from './MapSimple';
import type { Club } from '@/lib/supabase';

const DAYS_FR: Record<string, string> = {
  Monday: 'Lundi',
  Tuesday: 'Mardi',
  Wednesday: 'Mercredi',
  Thursday: 'Jeudi',
  Friday: 'Vendredi',
  Saturday: 'Samedi',
  Sunday: 'Dimanche',
};

const TODAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

function parseSchedule(raw?: string) {
  if (!raw) return [];
  return raw.split('|').map((part) => {
    const [day, ...rest] = part.split(':');
    const dayKey = day.trim();
    return {
      day: DAYS_FR[dayKey] || dayKey,
      hours: rest.join(':').trim(),
      isToday: dayKey === TODAY_EN,
    };
  });
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2C9.6 20 4 14.4 4 7a2 2 0 011-3z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export default function ClubDetailView({ club, breadcrumb }: { club: Club; breadcrumb?: ReactNode }) {
  const cover = club.photos?.[0];
  const gallery = club.photos?.slice(1, 5) || [];
  const schedule = parseSchedule(club.schedule_open);
  const location = [club.city, club.region].filter(Boolean).join(', ');
  const mapsHref =
    club.google_maps_url ||
    (club.latitude && club.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${club.latitude},${club.longitude}`
      : undefined);

  return (
    <>
      <header className="club-hero">
        {cover ? (
          <div className="club-cover">
            <img src={cover} alt={club.name} />
            <div className="club-cover-overlay" />
          </div>
        ) : (
          <div className="club-cover-empty" />
        )}

        <div className="wrap club-head">
          {breadcrumb}
          <div className="club-logo">
            {club.logo_url ? <img src={club.logo_url} alt={club.name} /> : <span>{getInitials(club.name)}</span>}
          </div>
          <div className="club-head-info">
            {club.activities?.length > 0 && (
              <div className="club-tags">
                {club.activities.slice(0, 4).map((a) => (
                  <span key={a} className="pill-light">
                    {a}
                  </span>
                ))}
              </div>
            )}
            <h1>{club.name}</h1>
            <div className="club-meta">
              {location && (
                <span className="club-loc">
                  <LocationIcon />
                  {location}
                </span>
              )}
              {!!club.rating && (
                <span className="result-rate">
                  ★ {club.rating}
                  {club.review_count ? ` (${club.review_count} avis)` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="block club-block">
        <div className="wrap club-layout">
          <div className="club-main">
            {gallery.length > 0 && (
              <div className="club-gallery">
                {gallery.map((src, i) => (
                  <div className="club-gallery-item" key={i}>
                    <img src={src} alt={`${club.name} - photo ${i + 2}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            {club.description && (
              <section className="club-section">
                <h2>À propos</h2>
                <p>{club.description}</p>
              </section>
            )}

            {club.activities?.length > 0 && (
              <section className="club-section">
                <h2>Activités proposées</h2>
                <div className="club-tags">
                  {club.activities.map((a) => (
                    <span key={a} className="pill">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {club.age_range?.length > 0 && (
              <section className="club-section">
                <h2>Public accueilli</h2>
                <div className="club-tags">
                  {club.age_range.map((a) => (
                    <span key={a} className="pill">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {schedule.length > 0 && (
              <section className="club-section">
                <h2>Horaires d&apos;ouverture</h2>
                <div className="schedule-list">
                  {schedule.map((s) => (
                    <div key={s.day} className={'schedule-row' + (s.isToday ? ' today' : '')}>
                      <span className="day">{s.day}</span>
                      <span className="hours">{s.hours}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!!club.latitude && !!club.longitude && (
              <section className="club-section">
                <h2>Localisation</h2>
                <div className="club-map">
                  <MapSimple clubs={[club]} />
                </div>
              </section>
            )}
          </div>

          <aside className="club-side">
            <div className="sim">
              <div className="sim-head">Contact</div>
              <p className="sim-sub">Toutes les informations pour rejoindre le club.</p>

              {club.address && (
                <div className="contact-item">
                  <span className="contact-ic">
                    <PinIcon />
                  </span>
                  <span className="contact-text">
                    <span className="label">Adresse</span>
                    <span className="value">
                      {club.address}
                      {club.zip_code || club.city ? <>, {[club.zip_code, club.city].filter(Boolean).join(' ')}</> : null}
                    </span>
                  </span>
                </div>
              )}

              {club.phone && (
                <div className="contact-item">
                  <span className="contact-ic">
                    <PhoneIcon />
                  </span>
                  <span className="contact-text">
                    <span className="label">Téléphone</span>
                    <a className="value" href={`tel:${club.phone}`}>
                      {club.phone}
                    </a>
                  </span>
                </div>
              )}

              {club.email && (
                <div className="contact-item">
                  <span className="contact-ic">
                    <MailIcon />
                  </span>
                  <span className="contact-text">
                    <span className="label">Email</span>
                    <a className="value" href={`mailto:${club.email}`}>
                      {club.email}
                    </a>
                  </span>
                </div>
              )}

              {club.website && (
                <div className="contact-item">
                  <span className="contact-ic">
                    <GlobeIcon />
                  </span>
                  <span className="contact-text">
                    <span className="label">Site web</span>
                    <a className="value" href={club.website} target="_blank" rel="noopener noreferrer">
                      {club.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </span>
                </div>
              )}

              {schedule.length > 0 && (
                <div className="contact-item">
                  <span className="contact-ic">
                    <ClockIcon />
                  </span>
                  <span className="contact-text">
                    <span className="label">Aujourd&apos;hui</span>
                    <span className="value">{schedule.find((s) => s.isToday)?.hours || '—'}</span>
                  </span>
                </div>
              )}

              <div className="contact-buttons">
                {club.phone && (
                  <a className="sim-go as-link" href={`tel:${club.phone}`}>
                    Appeler le club
                  </a>
                )}
                {club.website && (
                  <a className="btn-outline" href={club.website} target="_blank" rel="noopener noreferrer">
                    Visiter le site
                  </a>
                )}
                {mapsHref && (
                  <a className="btn-outline" href={mapsHref} target="_blank" rel="noopener noreferrer">
                    Itinéraire
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
