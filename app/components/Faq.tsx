// FAQ visuelle (accordéon natif <details> : aucun JS, contenu présent dans le
// DOM pour le SEO et cohérent avec le JSON-LD FAQPage).
export default function Faq({ items }: { items?: { q: string; a: string }[] | null }) {
  if (!items?.length) return null;
  return (
    <section className="block faq-block">
      <div className="wrap">
        <div className="sec-eyebrow">Questions fréquentes</div>
        <h2 className="sec-title">Bon à savoir</h2>
        <div className="faq-list">
          {items.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.q}</summary>
              <p dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
