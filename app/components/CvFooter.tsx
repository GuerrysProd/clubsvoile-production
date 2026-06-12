import Link from 'next/link';

export default function CvFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-logo"><span className="dot" />ClubsVoile.fr</div>
            <p style={{ marginTop: 12, maxWidth: 260 }}>L&apos;annuaire des clubs de voile français. De l&apos;Optimist à la croisière.</p>
          </div>
          <div className="foot-cols">
            <div className="foot-col"><h4>Explorer</h4><Link href="/#supports">Supports</Link><Link href="/#carte">La carte</Link><Link href="/search">Tous les clubs</Link></div>
            <div className="foot-col"><h4>Clubs</h4><Link href="/admin/login">Inscrire un club</Link><Link href="/admin/login">Connexion</Link></div>
            <div className="foot-col"><h4>Contact</h4><a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a></div>
          </div>
        </div>
        <div className="foot-bottom">© 2026 ClubsVoile.fr — Tous droits réservés.</div>
      </div>
    </footer>
  );
}
