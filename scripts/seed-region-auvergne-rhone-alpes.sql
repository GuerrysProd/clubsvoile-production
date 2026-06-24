-- Contenu éditorial SEO de la région Auvergne-Rhône-Alpes (page manquante).
-- À exécuter dans Supabase → SQL Editor.
insert into public.seo_content (path, page_type, meta_title, meta_description, intro_html, faq, status)
values (
  '/auvergne-rhone-alpes', 'region', 'Clubs de voile en Auvergne-Rhône-Alpes | ClubsVoile.fr', 'Clubs de voile en Auvergne-Rhône-Alpes : naviguez sur les lacs d''Annecy, du Bourget et de Savoie. Trouvez votre club par département.',
  '<p>Loin des côtes, l''Auvergne-Rhône-Alpes cultive une tradition de voile bien vivante sur ses grands lacs alpins. Du <a href="/auvergne-rhone-alpes/haute-savoie">lac d''Annecy en Haute-Savoie</a> au <a href="/auvergne-rhone-alpes/savoie">lac du Bourget en Savoie</a>, le plus grand lac naturel de France, la région offre des plans d''eau d''exception, cernés de montagnes, pour s''initier comme se perfectionner.</p>
<h2>Naviguer sur les lacs de la région</h2>
<p>Les clubs de voile d''Auvergne-Rhône-Alpes proposent dériveur, catamaran et planche à voile, ainsi que les nouvelles glisses comme le wingfoil. Les vents thermiques réguliers des lacs alpins en font un terrain d''apprentissage idéal. Explorez les clubs par département : <a href="/auvergne-rhone-alpes/isere">Isère</a>, <a href="/auvergne-rhone-alpes/drome">Drôme</a> ou <a href="/auvergne-rhone-alpes/cantal">Cantal</a>.</p>
<p>Pour les conditions de navigation et les formations diplômantes, la <a href="https://www.ffvoile.fr/" target="_blank" rel="noopener">Fédération Française de Voile</a> reste la référence.</p>', '[{"q":"Où faire de la voile en Auvergne-Rhône-Alpes ?","a":"Principalement sur les grands lacs : le lac d''Annecy (Haute-Savoie) et le lac du Bourget (Savoie), ainsi que sur des plans d''eau en Isère, dans la Drôme et le Cantal."},{"q":"Peut-on apprendre la voile sur un lac ?","a":"Oui. Les lacs alpins sont parfaits pour débuter : eaux fermées, vents thermiques réguliers et clubs proposant dériveur, catamaran et planche à voile."},{"q":"Quelles activités proposent les clubs de la région ?","a":"Dériveur, catamaran et planche à voile principalement, et selon les clubs, du wingfoil et du paddle."}]'::jsonb, 'published'
)
on conflict (path) do update set
  meta_title=excluded.meta_title, meta_description=excluded.meta_description,
  intro_html=excluded.intro_html, faq=excluded.faq, status='published', updated_at=now();
