import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MapSimple from './MapSimple';
import type { Club } from '@/lib/supabase';
import type { ClubLite } from '@/lib/geo';

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

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v12H5.2L4 18z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
      <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function ClubDetailView({
  club,
  breadcrumb,
  activityLinks = {},
  similarClubs = [],
}: {
  club: Club;
  breadcrumb?: ReactNode;
  activityLinks?: Record<string, string>;
  similarClubs?: ClubLite[];
}) {
  const cover = club.photos?.[0];
  const gallery = club.photos?.slice(1, 5) || [];
  const schedule = parseSchedule(club.schedule_open);
  const todayHours = schedule.find((s) => s.isToday)?.hours;
  const location = [club.city, club.region].filter(Boolean).join(', ');
  const cityLabel = (club.city || '').replace(/^\d{4,5}\s+/, '').trim() || club.region || '';
  const mapsHref =
    club.google_maps_url ||
    (club.latitude && club.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${club.latitude},${club.longitude}`
      : undefined);

  return (
    <>
      <div className="cap-wrap">
        {breadcrumb}

        {/* ============ GALERIE ============ */}
        <div className="cap-gallery">
          <div className="cap-gallery-main">
            {cover && <Image src={cover} alt={`${club.name}, club de voile à ${cityLabel}`} fill priority sizes="(max-width:780px) 100vw, 60vw" style={{ objectFit: 'cover' }} />}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div className="cap-gallery-tile" key={i}>
              {gallery[i] && <Image src={gallery[i]} alt={`${club.name} — photo ${i + 2}`} fill sizes="20vw" style={{ objectFit: 'cover' }} />}
              {i === 3 && (club.photos?.length || 0) > 5 && (
                <span className="cap-gallery-count">▦ {club.photos!.length} photos</span>
              )}
            </div>
          ))}
        </div>

        {/* ============ BLOC TITRE ============ */}
        <div className="cap-title-block">
          <div className="cap-title-main">
            <div className="cap-title-logo">
              {club.logo_url ? <Image src={club.logo_url} alt={`Logo de ${club.name}`} fill sizes="74px" style={{ objectFit: 'cover' }} /> : getInitials(club.name)}
            </div>
            <div>
              <div className="cap-title-h1">
                <h1>{club.name}</h1>
                {club.is_premium && <span className="cap-title-badge">Référencement premium</span>}
              </div>
              <div className="cap-title-meta">
                {!!club.rating && (
                  <span className="rate">
                    ★ {club.rating}
                    {club.review_count ? <span style={{ color: 'var(--muted-2)', fontWeight: 500 }}> ({club.review_count.toLocaleString('fr-FR')} avis Google)</span> : null}
                  </span>
                )}
                {location && <span className="loc"><PinIcon />{location}</span>}
              </div>
              {club.activities?.length > 0 && (
                <div className="cap-title-tags">
                  {club.activities.map((a) => <span key={a} className="cap-title-tag">{a}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ CONTENU 2 COL ============ */}
      <div className="cap-wrap cap-club-main">
        <div>
          {club.description && (
            <>
              <h2>À propos du club</h2>
              <p>{club.description}</p>
            </>
          )}

          {club.activities?.length > 0 && (
            <>
              <h2>Activités proposées</h2>
              <div className="cap-title-tags">
                {club.activities.map((a) =>
                  activityLinks[a] ? (
                    <Link key={a} href={activityLinks[a]} className="cap-result-tag" style={{ textDecoration: 'none' }}>{a}</Link>
                  ) : (
                    <span key={a} className="cap-title-tag">{a}</span>
                  )
                )}
              </div>
            </>
          )}

          {club.age_range?.length > 0 && (
            <>
              <h2>Public accueilli</h2>
              <div className="cap-title-tags">
                {club.age_range.map((a) => <span key={a} className="cap-title-tag">{a}</span>)}
              </div>
            </>
          )}

          {schedule.length > 0 && (
            <>
              <h2>Horaires d&apos;ouverture</h2>
              <div className="cap-schedule">
                {schedule.map((s) => (
                  <div key={s.day} className={'cap-schedule-row' + (s.isToday ? ' today' : '')}>
                    <span className="day">{s.day}</span>
                    <span className="hours">{s.hours}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {!!club.rating && (
            <>
              <h2>Avis Google</h2>
              <div className="cap-rev-summary">
                <div className="cap-rev-n">
                  <div className="v">{club.rating}</div>
                  <div className="s">{'★'.repeat(Math.round(club.rating))}</div>
                  {!!club.review_count && <div className="c">{club.review_count.toLocaleString('fr-FR')} avis</div>}
                </div>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                  Note calculée à partir des avis Google laissés sur la fiche établissement du club.
                </p>
              </div>
              {mapsHref && (
                <div className="cap-rev-cta">
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer">Voir les avis sur Google →</a>
                </div>
              )}
            </>
          )}
        </div>

        {/* ============ SIDEBAR STICKY ============ */}
        <aside className="cap-side">
          <div className="cap-side-card">
            {todayHours && (
              <div className="when"><ClockIcon /><span><strong>Aujourd&apos;hui</strong> · {todayHours}</span></div>
            )}
            <div className="cap-side-actions">
              {club.phone && <a className="primary" href={`tel:${club.phone}`}>Appeler le club</a>}
              {club.website && (
                <a className="outline" href={club.website} target="_blank" rel="noopener noreferrer">
                  <GlobeIcon />Visiter le site
                </a>
              )}
            </div>
            <div className="cap-side-info">
              {club.address && (
                <div className="row"><PinIcon /><span>{club.address}{club.zip_code || club.city ? <>, {[club.zip_code, club.city].filter(Boolean).join(' ')}</> : null}</span></div>
              )}
              {club.phone && <div className="row"><PhoneIcon /><a href={`tel:${club.phone}`}>{club.phone}</a></div>}
              {club.email && <div className="row"><MailIcon /><a href={`mailto:${club.email}`}>{club.email}</a></div>}
              {club.website && (
                <div className="row"><GlobeIcon /><a href={club.website} target="_blank" rel="noopener noreferrer">{club.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></div>
              )}
            </div>
          </div>

          {!!club.latitude && !!club.longitude && (
            <div className="cap-mini-map">
              <div className="cap-mini-map-img">
                <MapSimple clubs={[club]} />
              </div>
              <div className="cap-mini-map-foot">
                <div className="addr">{cityLabel}{club.zip_code ? <><br />{club.zip_code}</> : null}</div>
                {mapsHref && <a href={mapsHref} target="_blank" rel="noopener noreferrer">Itinéraire →</a>}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ============ CLUBS SIMILAIRES ============ */}
      {similarClubs.length > 0 && (
        <section className="cap-wrap cap-sec cap-similar">
          <h2>Autres clubs <span className="accent">à {cityLabel}</span></h2>
          <div className="cap-similar-grid">
            {similarClubs.map((c) => (
              <Link key={c.id} href={c.path} className="cap-similar-card">
                <div className="cap-similar-img" />
                <div className="cap-similar-body">
                  <div className="name">{c.name}</div>
                  <div className="meta">{!!c.rating && <span className="rate">★ {c.rating}</span>} {!!c.rating && '· '}{c.cityName}</div>
                  <div className="cap-similar-foot">
                    <span>{(c.activities || []).slice(0, 1)[0] || 'Club de voile'}</span>
                    <span className="go">Voir →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
