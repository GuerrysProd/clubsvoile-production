'use client';

import Link from 'next/link';
import { useState } from 'react';
import CvLogo from './CvLogo';

export default function CvNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="logo" onClick={close}><CvLogo size={30} /></Link>

        <button
          type="button"
          className={'nav-burger' + (open ? ' is-open' : '')}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <div className={'nav-links' + (open ? ' is-open' : '')}>
          <Link href="/activites" onClick={close}>Par activité</Link>
          <Link href="/#regions" onClick={close}>Par région</Link>
          <Link href="/#carte" onClick={close}>La carte</Link>
          <Link href="/search" onClick={close}>Rechercher</Link>
          <Link href="/contact" className="nav-cta" onClick={close}>Référencer mon club</Link>
        </div>
      </div>
    </nav>
  );
}
