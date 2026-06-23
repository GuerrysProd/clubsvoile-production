// Logo ClubsVoile.fr — concept « Le repère » : pin de carte contenant un
// voilier (annuaire + voile). Le pin est corail, le voilier blanc → lisible
// sur fond marine comme sur crème.

export function CvLogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="ClubsVoile.fr"
    >
      <path
        d="M32 4 C18 4 8 15 8 27 C8 42 32 60 32 60 C32 60 56 42 56 27 C56 15 46 4 32 4 Z"
        fill="#FF5436"
      />
      <path d="M20 40 L44 40 L40 46 L24 46 Z" fill="#fff" />
      <rect x="30.25" y="13" width="3" height="26" rx="1.5" fill="#fff" />
      <path d="M33.5 14 C44 21 44 32 33.5 38 Z" fill="#fff" />
      <path d="M29 17 L20.5 38 L29 38 Z" fill="#fff" opacity="0.5" />
    </svg>
  );
}

// Verrou complet (pictogramme + mot). La couleur du mot est héritée du parent.
export default function CvLogo({ size = 28 }: { size?: number }) {
  return (
    <>
      <CvLogoMark size={size} className="cv-logo-mark" />
      <span className="cv-logo-word">
        ClubsVoile<span className="tld">.fr</span>
      </span>
    </>
  );
}
