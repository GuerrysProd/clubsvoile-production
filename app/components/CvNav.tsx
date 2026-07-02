'use client';

import Link from 'next/link';
import { useState } from 'react';
import CvLogo from './CvLogo';

export default function CvNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav nav-cap">
      <div className="wrap nav-in">
        <Link href="/" className="logo" onClick={close}><CvLogo size={32} /></Link>

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
          <Link href="/activites" onClick={close}>Activités</Link>
          <Link href="/#regions" onClick={close}>Régions</Link>
          <Link href="/stage-de-voile" onClick={close}>Stages</Link>
          <Link href="/ecole-de-voile" onClick={close}>Écoles</Link>
          <Link href="/club-de-voile" onClick={close}>Clubs</Link>
          <Link href="/blog" onClick={close}>Blog</Link>
        </div>

        <div className="nav-actions">
          <Link href="/contact" className="nav-ghost" onClick={close}>Ajouter mon club</Link>
          <Link href="/search" className="nav-cta" onClick={close}>Trouver un club</Link>
        </div>
      </div>
    </nav>
  );
}
