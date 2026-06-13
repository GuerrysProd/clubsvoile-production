import Link from 'next/link';

export default function CvNav() {
  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="logo"><span className="dot" />ClubsVoile.fr</Link>
        <div className="nav-links">
          <Link href="/#supports">Supports</Link>
          <Link href="/activites">Activités</Link>
          <Link href="/#carte">La carte</Link>
          <Link href="/search">Explorer</Link>
          <Link href="/admin/login" className="nav-cta">Inscrire mon club</Link>
        </div>
      </div>
    </nav>
  );
}
