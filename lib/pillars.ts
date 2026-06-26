import type { Metadata } from 'next';
import { pageMeta } from './seo';
import { getSeoContent } from './seoContent';

/**
 * Configuration d'une page-pilier nationale (ex. /stage-de-voile).
 * Ces pages ciblent des têtes de requête commerciales à fort volume
 * (« école de voile » 1 900/mois, « club de voile » 1 000, « stage de voile »
 * 720) que le reste de l'annuaire ne capte pas directement. Le contenu par
 * défaut ci-dessous peut être surchargé page par page via la table
 * `seo_content` (même mécanisme que les pages géo/activité).
 */
export interface PillarConfig {
  slug: string;
  eyebrow: string;
  h1: string;
  h1Em: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  introHtml: string;
  faq: { q: string; a: string }[];
  activitiesTitle: string;
  regionsTitle: string;
  citiesTitle: string;
  /** Repère visuel du hero (texte générique, pas de chiffre inventé). */
  photoBadge: { label: string; value: string };
  /** 3 bénéfices courts affichés sous le hero. */
  benefits: { icon: 'progress' | 'diploma' | 'ages'; title: string; text: string }[];
  /** 3 profils types, pour aider l'utilisateur à se situer. */
  profiles: { tag: string; title: string; text: string }[];
}

export const PILLARS: Record<string, PillarConfig> = {
  'stage-de-voile': {
    slug: 'stage-de-voile',
    eyebrow: 'Annuaire ClubsVoile',
    h1: 'Stage de voile',
    h1Em: 'en France',
    lede:
      'Trouvez un stage de voile près de chez vous : stages enfants, ados et adultes, à la journée ou à la semaine, encadrés par des moniteurs diplômés.',
    metaTitle: 'Stage de voile : trouver un stage près de chez vous | ClubsVoile.fr',
    metaDescription:
      'Stages de voile pour enfants, ados et adultes partout en France : à la semaine ou à la journée, débutant ou perfectionnement, sur tous les supports. Trouvez le stage le plus proche.',
    introHtml: `
      <h2>Qu'est-ce qu'un stage de voile ?</h2>
      <p>Un <strong>stage de voile</strong> est une formation courte et intensive — généralement une
      semaine pendant les vacances scolaires, ou quelques journées — qui permet de découvrir la voile
      ou de progresser rapidement. Les stages sont encadrés par des moniteurs diplômés et se déroulent
      dans des écoles et clubs affiliés à la Fédération Française de Voile (FFVoile).</p>
      <h2>Pour qui ?</h2>
      <p>Il existe des stages adaptés à chaque public : <strong>moussaillons</strong> dès 4 ans,
      <strong>enfants</strong> en Optimist, <strong>ados</strong> en dériveur ou catamaran, et
      <strong>adultes débutants</strong> comme confirmés. Beaucoup de clubs proposent aussi des stages
      de perfectionnement et des stages sur les supports de glisse (planche à voile, wingfoil, kitesurf).</p>
      <h2>Quand et comment s'inscrire ?</h2>
      <p>Les stages ont surtout lieu l'été et pendant les vacances scolaires. Choisissez votre région
      ou votre ville ci-dessous pour trouver les clubs qui proposent des stages, puis contactez-les
      directement pour connaître les dates, les tarifs et les disponibilités.</p>
    `,
    faq: [
      { q: 'À partir de quel âge peut-on faire un stage de voile ?', a: 'Dès 4 ans avec les stages « moussaillon » (jardin des mers), puis vers 7 ans en Optimist. Les stages ados et adultes sont accessibles à tout âge, débutants compris.' },
      { q: 'Combien coûte un stage de voile ?', a: 'Le tarif d\'un stage à la semaine varie le plus souvent entre 120 € et 300 € selon le support, la région et le club. Les tarifs exacts sont indiqués par chaque club ; contactez-le directement.' },
      { q: 'Faut-il savoir nager pour faire un stage de voile ?', a: 'Oui, un test d\'aisance aquatique (savoir nager environ 25 mètres et s\'immerger) est généralement demandé. Un certificat ou une attestation peut être exigé selon le club.' },
      { q: 'Quand ont lieu les stages de voile ?', a: 'Principalement pendant les vacances scolaires et l\'été, en formules à la semaine. Certains clubs proposent aussi des stages le week-end ou à la carte hors saison.' },
      { q: 'Quel support choisir pour débuter ?', a: 'L\'Optimist pour les enfants, le dériveur (type Open ou Laser) ou le catamaran pour les ados et adultes. Un moniteur vous orientera selon votre âge et vos objectifs.' },
    ],
    activitiesTitle: 'Quel support pour votre stage de voile ?',
    regionsTitle: 'Stages de voile par région',
    citiesTitle: 'Stages de voile : les villes les plus actives',
    photoBadge: { label: 'Stages encadrés', value: 'dès 4 ans' },
    benefits: [
      { icon: 'progress', title: 'Progresser vite', text: 'Un format intensif sur plusieurs jours fait souvent plus progresser qu’une saison de séances espacées.' },
      { icon: 'diploma', title: 'Encadrement diplômé', text: 'Clubs et écoles labellisés FFVoile, moniteurs diplômés, matériel et sécurité encadrés.' },
      { icon: 'ages', title: 'Pour tous les âges', text: 'Du moussaillon au grand débutant adulte : un format adapté à chaque profil.' },
    ],
    profiles: [
      { tag: '4 — 12 ANS', title: 'Enfant', text: 'Moussaillon et Optimist, en séances ludiques encadrées. Sécurité, jeux et premières sensations sur l’eau.' },
      { tag: '12 — 17 ANS', title: 'Ado', text: 'Catamaran, planche, dériveur double. Stages à la semaine, esprit de groupe et premiers apprentissages techniques.' },
      { tag: '18 ANS ET +', title: 'Adulte', text: 'Initiation ou perfectionnement, cours particuliers, habitable ou glisse. Formats week-end ou semaine selon le club.' },
    ],
  },
  'ecole-de-voile': {
    slug: 'ecole-de-voile',
    eyebrow: 'Annuaire ClubsVoile',
    h1: 'École de voile',
    h1Em: 'en France',
    lede:
      'Toutes les écoles de voile françaises : cours, initiation et perfectionnement, du moussaillon à l\'adulte, sur tous les supports.',
    metaTitle: 'École de voile : trouver une école près de chez vous | ClubsVoile.fr',
    metaDescription:
      'Annuaire des écoles de voile en France : cours et initiation pour enfants et adultes, écoles labellisées FFVoile, sur tous les supports. Trouvez l\'école de voile la plus proche.',
    introHtml: `
      <h2>Qu'est-ce qu'une école de voile ?</h2>
      <p>Une <strong>école de voile</strong> enseigne la pratique de la voile à tous les niveaux, des
      premiers bords aux régates. La plupart sont labellisées <strong>« École Française de Voile »</strong>
      par la Fédération Française de Voile (FFVoile), un gage de qualité de l'encadrement et du matériel.</p>
      <h2>Cours, stages et licences</h2>
      <p>Les écoles proposent des <strong>cours réguliers</strong> à l'année (souvent le mercredi et le
      week-end), des <strong>stages</strong> pendant les vacances, et la passation des <strong>niveaux
      FFVoile</strong>. La pratique encadrée nécessite généralement une licence (club ou temporaire),
      qui inclut l'assurance.</p>
      <h2>Débuter à tout âge</h2>
      <p>Il n'y a pas d'âge pour apprendre la voile : les écoles accueillent les enfants dès 4 ans et les
      adultes débutants. Choisissez votre région, votre ville ou votre support ci-dessous pour trouver
      l'école de voile la plus proche de chez vous.</p>
    `,
    faq: [
      { q: 'Qu\'est-ce que le label « École Française de Voile » ?', a: 'C\'est le label de qualité délivré par la Fédération Française de Voile aux écoles qui respectent un cahier des charges sur l\'encadrement, la sécurité et le matériel. C\'est un bon repère pour choisir.' },
      { q: 'Comment débuter la voile quand on est adulte ?', a: 'La plupart des écoles proposent des cours et stages « adultes débutants ». On commence en général en dériveur ou en catamaran avec un moniteur, sans aucun prérequis hormis savoir nager.' },
      { q: 'Faut-il une licence pour aller à l\'école de voile ?', a: 'Oui, la pratique encadrée nécessite une licence FFVoile (annuelle pour les adhérents, ou temporaire pour un stage). Elle comprend l\'assurance responsabilité civile.' },
      { q: 'Quelle différence entre une école de voile et un club de voile ?', a: 'L\'école est la composante « enseignement » d\'un club : beaucoup de clubs de voile abritent une école labellisée. Le club ajoute la vie associative, la location et la compétition.' },
      { q: 'À quel âge inscrire un enfant à l\'école de voile ?', a: 'Dès 4 ans en « jardin des mers » (moussaillon), puis vers 7 ans en Optimist. L\'enfant doit être à l\'aise dans l\'eau.' },
    ],
    activitiesTitle: 'Apprendre sur tous les supports',
    regionsTitle: 'Écoles de voile par région',
    citiesTitle: 'Écoles de voile : les villes les plus actives',
    photoBadge: { label: 'Écoles labellisées', value: 'FFVoile' },
    benefits: [
      { icon: 'diploma', title: 'Label FFVoile', text: 'Un repère de qualité sur l’encadrement, la sécurité et le matériel, à vérifier sur la fiche de chaque club.' },
      { icon: 'progress', title: 'Cours réguliers', text: 'À l’année, souvent le mercredi et le week-end, pour progresser à son rythme plutôt qu’en intensif.' },
      { icon: 'ages', title: 'Aucun âge requis', text: 'Les écoles accueillent les enfants dès 4 ans et les adultes débutants, sans prérequis sauf savoir nager.' },
    ],
    profiles: [
      { tag: 'DÉCOUVERTE', title: 'Premier contact', text: 'Une séance ou un stage découverte avant de s’engager à l’année — proposé par la plupart des écoles.' },
      { tag: 'COURS À L’ANNÉE', title: 'Pratique régulière', text: 'Inscription à l’école, licence FFVoile incluant l’assurance, passation des niveaux fédéraux.' },
      { tag: 'PERFECTIONNEMENT', title: 'Confirmé', text: 'Cours techniques, préparation à la régate, ou passage vers d’autres supports (catamaran, habitable, glisse).' },
    ],
  },
  'club-de-voile': {
    slug: 'club-de-voile',
    eyebrow: 'Annuaire ClubsVoile',
    h1: 'Club de voile',
    h1Em: 'près de chez vous',
    lede:
      'L\'annuaire des clubs de voile en France : trouvez le club le plus proche, par région, par ville et par activité.',
    metaTitle: 'Club de voile : l\'annuaire des clubs en France | ClubsVoile.fr',
    metaDescription:
      'Trouvez un club de voile près de chez vous : annuaire complet des clubs français par région, par ville et par activité. École, stages, location et compétition.',
    introHtml: `
      <h2>Que propose un club de voile ?</h2>
      <p>Un <strong>club de voile</strong> est une association qui réunit pratiquants débutants et
      confirmés autour d'un plan d'eau. Il abrite le plus souvent une <strong>école de voile</strong>
      (cours et stages), propose la <strong>location de matériel</strong>, organise des sorties et des
      <strong>régates</strong>, et anime une vie associative à l'année.</p>
      <h2>Affiliation et adhésion</h2>
      <p>La majorité des clubs sont affiliés à la <strong>Fédération Française de Voile</strong>.
      Rejoindre un club passe par une adhésion annuelle et une licence, qui donnent accès au matériel,
      à l'encadrement et aux événements. C'est la formule la plus économique pour pratiquer régulièrement.</p>
      <h2>Trouver son club</h2>
      <p>Mer, lac, rivière ou plan d'eau intérieur : il existe un club pour chaque type de navigation.
      Parcourez l'annuaire par région, par ville ou par activité ci-dessous pour trouver le club de voile
      le plus proche de chez vous.</p>
    `,
    faq: [
      { q: 'Comment trouver un club de voile près de chez moi ?', a: 'Parcourez l\'annuaire par région ou par ville ci-dessous, ou utilisez la recherche. Chaque fiche club indique les activités proposées, les coordonnées et la localisation.' },
      { q: 'Comment s\'inscrire dans un club de voile ?', a: 'L\'inscription se fait directement auprès du club, via une adhésion annuelle et une licence FFVoile. Beaucoup de clubs proposent une séance ou un stage de découverte avant de s\'engager.' },
      { q: 'Quel budget pour pratiquer la voile en club ?', a: 'Comptez en général une adhésion annuelle de 100 € à 300 € selon le club et le matériel mis à disposition, licence comprise. C\'est plus économique que la location à la séance.' },
      { q: 'Peut-on faire de la voile en club à tout âge ?', a: 'Oui. Les clubs accueillent les enfants dès 4 ans et les adultes de tous niveaux. Beaucoup proposent aussi de la voile loisir, du handivoile et de la compétition.' },
      { q: 'Quelles activités trouve-t-on dans un club de voile ?', a: 'Selon le plan d\'eau : Optimist, dériveur, catamaran, planche à voile, mais aussi wingfoil, kitesurf, kayak ou paddle. Le détail figure sur chaque fiche club.' },
    ],
    activitiesTitle: 'Les activités proposées en club',
    regionsTitle: 'Clubs de voile par région',
    citiesTitle: 'Clubs de voile : les villes les plus actives',
    photoBadge: { label: 'Vie associative', value: 'à l’année' },
    benefits: [
      { icon: 'ages', title: 'Vie associative', text: 'Sorties, régates et événements toute l’année, au-delà des seuls cours.' },
      { icon: 'progress', title: 'Matériel inclus', text: 'L’adhésion donne généralement accès à la flotte du club, sans avoir à acheter son propre bateau.' },
      { icon: 'diploma', title: 'Licence FFVoile', text: 'L’adhésion à un club inclut le plus souvent la licence fédérale et l’assurance responsabilité civile.' },
    ],
    profiles: [
      { tag: 'NOUVEAU PRATIQUANT', title: 'Première adhésion', text: 'Renseignez-vous sur les séances ou stages de découverte avant de vous engager à l’année.' },
      { tag: 'FAMILLE', title: 'Pratique en famille', text: 'Beaucoup de clubs proposent des formules enfant + parent ou des activités multi-supports adaptées.' },
      { tag: 'COMPÉTITION', title: 'Régate & performance', text: 'Certains clubs disposent d’une section compétition avec entraînements et calendrier de régates.' },
    ],
  },
};

/** Métadonnées d'une page-pilier, surchargeable via seo_content. */
export async function pillarMetadata(slug: string): Promise<Metadata> {
  const config = PILLARS[slug];
  if (!config) return {};
  const seo = await getSeoContent(`/${slug}`);
  return pageMeta({
    title: seo?.meta_title || config.metaTitle,
    description: seo?.meta_description || config.metaDescription,
    path: `/${slug}`,
  });
}
