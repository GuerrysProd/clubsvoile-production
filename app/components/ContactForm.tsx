'use client';

import { useState } from 'react';

const EMAIL = 'contact@clubsvoile.fr';

export default function ContactForm() {
  const [club, setClub] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club, name, email, phone, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Une erreur est survenue.');
      }
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="contact-card">
        <div className="contact-sent">
          <div className="bigic">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h3>Message bien reçu&nbsp;!</h3>
          <p>Merci {name.split(' ')[0] || ''}. Notre équipe revient vers vous très vite pour référencer {club || 'votre club'}. À bientôt sur ClubsVoile.fr&nbsp;!</p>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-card" onSubmit={submit}>
      <span className="contact-free">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
        Référencement 100% gratuit
      </span>
      <div className="field">
        <label htmlFor="cf-club">Nom du club</label>
        <input id="cf-club" required value={club} onChange={(e) => setClub(e.target.value)} placeholder="Cercle Nautique de…" />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-name">Votre nom</label>
          <input id="cf-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom Nom" />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Téléphone</label>
          <input id="cf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optionnel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@club.fr" />
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Votre message</label>
        <textarea id="cf-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Parlez-nous de votre club, vos activités, vos envies de visibilité…" />
      </div>

      {status === 'error' && <p className="contact-err">{error}</p>}

      <button type="submit" className="sim-go" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
        {status !== 'sending' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        )}
      </button>
      <p className="contact-alt">Ou directement par mail : <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </form>
  );
}
