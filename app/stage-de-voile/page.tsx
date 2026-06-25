import type { Metadata } from 'next';
import PillarPage from '../components/PillarPage';
import { PILLARS, pillarMetadata } from '@/lib/pillars';

// ISR : page-pilier mise en cache, régénérée au plus toutes les heures.
export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return pillarMetadata('stage-de-voile');
}

export default function Page() {
  return <PillarPage config={PILLARS['stage-de-voile']} />;
}
