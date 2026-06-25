# Mots-clés cibles — ClubsVoile.fr

> Tri de ~270 000 lignes Semrush (16 exports broad-match FR, 25/06/2026).
> J'ai écarté 3 grandes familles de bruit : **e-commerce/matériel** (decathlon, gonflable,
> occasion, ailes, casques…), **voyage** (« kayak vol » = billets d'avion !, ferry Corse,
> Ibiza/Formentera/Maurice), et **marques/lieux nommés navigationnels** (yacht club de Monaco,
> Glénans, « centre nautique Tony Bertrand » = piscine municipale de Lyon).
> Ne restent ici que les requêtes **exploitables par un annuaire de clubs**.

---

## 0. Lecture rapide — les 5 enseignements

1. **Les watersports « non-voile » écrasent la voile en volume.** `kayak` 823k, `paddle` 74k,
   `catamaran` 27k, `kitesurf` 14,8k, `wingfoil` 12,1k vs `club de voile` 1k / `école de voile` 1,9k.
   → Le trafic est dans **kayak / paddle / kitesurf**, qui sont déjà des activités de l'annuaire.
   C'est notre plus gros gisement et il est sous-exploité.
2. **L'intention locale est massive et explicite** : `paddle autour de moi` 1600, `kayak autour de moi`
   1300, `best places to kayak near me` 3600, `paddle à proximité` 720, `kitesurf à proximité` 590.
   Un annuaire géolocalisé est *exactement* la réponse — mais le site n'a aucune page/feature « près de moi ».
3. **L'activité×ville est une demande validée**, pas une hypothèse : `paddle paris` 1600, `kayak cassis`
   1000, `paddle annecy` 1000, `catamaran la rochelle` 1000, `kayak marseille` 880, `paddle marseille` 720…
   Ces pages existent déjà (`/[activite]/[ville]`) → il faut **couvrir les villes qui ont du volume**.
4. **3 têtes de requête commerciales sans page dédiée** : `école de voile` (1900, KD44),
   `club de voile` (1000, KD42), `stage de voile` (720, KD20). Le site s'appelle ClubsVoile mais
   n'a pas de page-pilier optimisée pour ces termes exacts. Quick win à fort levier.
5. **« centre nautique » (3600) est un piège** : 80 % des requêtes pointent vers des piscines
   municipales nommées. À ne PAS poursuivre comme axe principal.

---

## 1. Têtes de requête (pages-piliers nationales à créer)

| Mot-clé | Volume | KD | Intention | Page cible recommandée |
|---|---|---|---|---|
| école de voile | 1 900 | 44 | Commercial | `/ecole-de-voile` (pilier + liste villes) |
| club de voile | 1 000 | 42 | Commercial | `/club-de-voile` ou homepage renforcée |
| stage de voile | 720 | 20 | Commercial | `/stage-de-voile` (KD faible = priorité) |
| stage de voile adulte / débutant / senior | 170–260 | 16–18 | Info/Comm | sections de la page stage |
| cours de paddle | 320 | 19 | Commercial | section pilier paddle |
| stage kitesurf / cours de kitesurf | 210–590 | 22–49 | Commercial | pilier kitesurf |
| stage wingfoil | 260 | 12 | Commercial | pilier wingfoil (KD très faible) |
| stage catamaran | 140 | 13 | Commercial | pilier catamaran |

**Note** : `école/club/stage de voile` valent à eux seuls ~3 600 recherches/mois en commercial pur,
sur un site qui porte le nom. C'est l'angle mort le plus rentable.

---

## 2. Activités nationales — dimensionner les piliers `/[activite]`

Volume de la requête générique (proxy de l'intérêt de la page pilier d'activité) :

| Activité (slug site) | Requête | Volume | KD | Priorité |
|---|---|---|---|---|
| Kayak | kayak / kayak en mer / kayak de pêche | 823k / 1600 / 590 | 8–57 | ⭐⭐⭐ |
| Paddle | paddle / cours de paddle | 74k / 320 | 19–35 | ⭐⭐⭐ |
| Catamaran | catamaran | 27 100 | 40 | ⭐⭐ |
| KiteSurf | kitesurf | 14 800 | 34 | ⭐⭐ |
| WingFoil | wingfoil | 12 100 | 28 | ⭐⭐ |
| Planche à voile | planche à voile | 2 900 | 17 | ⭐⭐ (KD faible) |
| E-Foil | efoil | 2 400 | 16 | ⭐ (KD faible, niche) |
| Dériveur / Optimist | (faible vol générique) | <500 | — | ⭐ (longue traîne ville) |

⚠️ **Intention mixte à cadrer dans le contenu** : `kayak` et `catamaran` ont une forte composante
« location/excursion touristique » et « matériel ». La page pilier doit clairement parler **club /
cours / pratique encadrée**, sinon on cannibalise mal et le CTR souffre.

---

## 3. Activité × ville — la mine d'or (pages `/[activite]/[ville]`)

Demande **confirmée** par les données. À traiter en priorité **si un club de la base couvre la ville** ;
sinon → cible d'acquisition de clubs (cf. doc audit, axe revenus).

### Paddle
| Requête | Vol | KD |
|---|---|---|
| paddle paris | 1 600 | 25 |
| paddle annecy (+ location) | 1 000 / 880 | 23–27 |
| paddle marseille (+ location) | 720 / 320 | 19 |
| paddle bordeaux | 320 | 26 |
| paddle montpellier / nice / lyon | 390 / 260 / 480 | 15–22 |
| paddle hyères / rennes / nantes | 210–260 | 17–29 |

### Kayak
| Requête | Vol | KD |
|---|---|---|
| kayak cassis (+ « kayak a cassis ») | 1 000 / 720 | 20–50 |
| kayak marseille / marseille kayak | 880 / 480 | 31–37 |
| kayak lyon / lyon kayak | 720 | 19–23 |
| kayak paris / kayak à paris | 590 / 480 | 18–34 |
| kayak nantes / bordeaux / montpellier | 320–480 | 29–39 |
| kayak nice / annecy / rennes | 210–320 | 15–34 |

### Catamaran
| Requête | Vol | KD |
|---|---|---|
| catamaran la rochelle | 1 000 | 19 |
| catamaran marseille (+ location) | 480 | 14–24 |
| catamaran arcachon | 320 | 17 |
| location catamaran hyères | 260 | 19 |

### KiteSurf
| Requête | Vol | KD |
|---|---|---|
| kitesurf hyères / leucate | 260 | 30–32 |
| école kitesurf almanarre / kitesurf cours hyères | 480 | 0–45 |

### Voile / école (longue traîne ville, KD bas, navigationnel → fiches club)
ecole de voile courseulles (260), cherbourg (260), yacht club de toulon (720), toulon yacht club (480),
yacht club cannes (480), yacht club carnac (590), club de voile mulhouse (170)…
→ Ces requêtes nommées renforcent surtout les **fiches club** correspondantes (title/H1/contenu).

---

## 4. « Près de moi » / géolocalisé (feature à créer)

Intention idéale pour un annuaire — **aucune page actuelle ne la sert**.

| Requête | Vol | KD |
|---|---|---|
| best places to kayak near me | 3 600 | 28 |
| paddle autour de moi | 1 600 | 18 |
| kayak autour de moi | 1 300 | 23 |
| paddle à proximité | 720 | 21 |
| kitesurf à proximité | 590 | 18 |
| où faire du paddle autour de moi | 480 | 19 |
| canoë kayak à proximité / autour de moi | 320–390 | 21–32 |
| location kayak/paddle à proximité | 110–320 | 14–19 |
| ecole de voile autour de moi | 70 | 47 |

→ Recommandation : page `/pres-de-chez-moi` (géoloc navigateur + redirection vers la ville la plus proche)
**et** maillage « clubs près de {ville} » sur les pages ville. Détaillé dans l'audit V2.

---

## 5. Priorisation par ville (densité population × côte/plan d'eau)

Croisé avec `top_villes_13_83_06` (PACA) + villes à forte demande nationale identifiée ci-dessus :

**Tier 1 (volume prouvé + population)** : Marseille, Paris, Lyon, Annecy, Cassis, La Rochelle,
Bordeaux, Montpellier, Nice, Nantes, Hyères, Toulon, Cannes, Arcachon.
**Tier 2 (PACA dense, côte)** : Antibes, Fréjus, La Seyne-sur-Mer, Cagnes-sur-Mer, Sète, Leucate.
**Tier 3** : longue traîne départementale déjà générée par le programme N8N.

> Marseille / Paris / Lyon / Annecy ressortent sur **paddle ET kayak** → prioriser la présence de
> clubs paddle/kayak dans ces villes (souvent inland/lac, là où l'annuaire est aujourd'hui le plus mince).

---

## 6. À NE PAS cibler (bruit écarté — pour mémoire)

- **Matériel / e-commerce** : *gonflable, decathlon, occasion, prix, aile, casque, leash, pompe* → c'est Decathlon/Amazon.
- **Voyage / billets** : *kayak vol(s)* = billets d'avion (74k mais hors sujet total), *catamaran Manche/Ibiza/Maurice/Formentera*, ferries Corse.
- **Marques nationales** : *Glénans, yacht club de Monaco, Gong, MSC Yacht Club* → on ne battra pas la marque.
- **« centre nautique » nommés** : piscines municipales (Tony Bertrand, Etienne Gagnaire, Schiltigheim…) → intention « piscine », pas voile.
- **Autres sports** : *paddle tennis / padel* (sport de raquette, rien à voir).
