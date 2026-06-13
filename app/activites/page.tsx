import Link from 'next/link';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import ActivityIcons from '../components/ActivityIcons';
import { ACTIVITIES } from '@/lib/activities';
import { getGeoIndex } from '@/lib/clubsData';
import { slugify } from '@/lib/slug';

export const metadata: Metadata = {
  title: 'Toutes les activités nautiques | ClubsVoile.fr',
  description: 'Optimist, catamaran, wingfoil, kitesurf, paddle, char à voile... Découvrez toutes les activités pratiquées dans les clubs de voile français, avec le nombre de clubs et la tranche d\'âge recommandée.',
};

export default async function ActivitesPage() {
  const index = await getGeoIndex();

  const activities = ACTIVITIES.map((a) => {
    const slug = slugify(a.key);
    const entry = index.activities.get(slug);
    const clubCount = entry ? Array.from(entry.cities.values()).reduce((sum, c) => sum + c.clubs.length, 0) : 0;
    return { ...a, slug, clubCount };
  });

  return (
    <div className="cv">
      <ActivityIcons />
      <CvNav />

      <header className="search-hero act-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Activités</span>
          </nav>
          <span className="eyebrow">Annuaire ClubsVoile</span>
          <h1>Toutes les <em>activités</em> nautiques</h1>
          <p className="lede">Du premier Optimist au wingfoil, en passant par le char à voile : découvrez chaque activité, le nombre de clubs qui la proposent et la tranche d&apos;âge conseillée.</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="act-grid">
            {activities.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`} className="act-card">
                <div className="act-img" style={{ backgroundImage: `url(${a.image})` }}>
                  {a.trend && <span className="trend">Tendance</span>}
                  <svg className="act-icon ic"><use href={'#' + a.icon} /></svg>
                </div>
                <div className="act-body">
                  <h3>{a.key}</h3>
                  <p>{a.description}</p>
                  <div className="act-meta">
                    <span className="count-badge">{a.clubCount} club{a.clubCount > 1 ? 's' : ''}</span>
                    {a.ageRange && <span className="age-badge">{a.ageRange}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
