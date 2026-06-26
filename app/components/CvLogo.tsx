// Logo ClubsVoile.fr — système « Cap ». Pictogramme = pin (carré arrondi à
// 3 coins + 1 coin pointu, pivoté 45°) contenant une voile triangulaire.
// Variante claire (fond clair) : pin marine + voile corail.
// Variante sombre (fond sombre, footer) : pin corail + voile blanche.

export function CvLogoMark({ size = 32, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  const pin = variant === 'dark' ? '#FF5436' : '#0B1E33';
  const sail = variant === 'dark' ? '#ffffff' : '#FF5436';
  const side = Math.round(size * 0.16);
  const tri = Math.round(size * 0.375);
  return (
    <span
      className="cv-mark"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: pin,
        borderRadius: '50% 50% 50% 3px',
        transform: 'rotate(45deg)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
      }}
    >
      <span
        style={{
          transform: 'rotate(-45deg)',
          width: 0,
          height: 0,
          borderLeft: `${side}px solid transparent`,
          borderRight: `${side}px solid transparent`,
          borderBottom: `${tri}px solid ${sail}`,
        }}
      />
    </span>
  );
}

// Verrou complet (pictogramme + mot). La couleur du mot est héritée du parent.
export default function CvLogo({ size = 32, variant = 'light' }: { size?: number; variant?: 'light' | 'dark' }) {
  return (
    <>
      <CvLogoMark size={size} variant={variant} />
      <span className="cv-logo-word">
        ClubsVoile<span className="tld">.fr</span>
      </span>
    </>
  );
}
