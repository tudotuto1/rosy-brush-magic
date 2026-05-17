# Audit Backend — État des lieux (lecture seule)

> Audit réalisé le 2026-05-17 sur la branche `claude/audit-routes-payments-NlOOp`.
> Périmètre : `src/routes/index.tsx` + composants importés depuis `src/components/`.
> Aucune modification de code n'a été effectuée.

## 1. Produits identifiés

Le site est un **mono-produit** (landing page one-product). Un seul produit/offre est vendu.

| # | Nom | Description | Prix affiché | Prix barré | Devise |
|---|-----|-------------|--------------|-----------|--------|
| 1 | **LuminaBrush — Édition Rose Gold** | Nettoyeur de pinceaux de maquillage électrique. Nettoie et sèche les pinceaux en moins de 30 secondes, élimine 99% des bactéries. Fourni avec 3 colliers en silicone multi-tailles, rechargeable USB-C. | **29,90 €** | 59,90 € (−50%, « Économisez 30€ ») | EUR (€) |

Détails marketing associés au produit :
- Badge promo : « -50% Aujourd'hui » (`index.tsx:260-262`)
- Note/avis : 5 étoiles, « 2 187 avis » (`index.tsx:266-269`)
- Argument de rareté : « Stock limité — forte demande suite à sa viralité sur TikTok » (`index.tsx:275-278`)
- Moyens de paiement annoncés (texte uniquement, non fonctionnels) : « Visa · Mastercard · PayPal » (`index.tsx:288`)

> Remarque : aucun catalogue, aucune variante (couleur/taille), aucun panier réel. Le badge panier de l'en-tête affiche un « 1 » codé en dur (`index.tsx:69`).

## 2. Boutons d'achat (CTA)

| Composant | Ligne | Texte du bouton | Type d'élément | Rôle |
|-----------|-------|-----------------|----------------|------|
| `src/routes/index.tsx` | 92-98 | « Obtenir mon nettoyeur maintenant » | `<a href="#buy">` | CTA hero — ancre interne vers la section d'achat (`id="buy"`), ne déclenche pas de paiement |
| `src/routes/index.tsx` | 279-285 | « Ajouter au panier — 29,90€ » | `<a href="#">` | **CTA d'achat principal** — censé mener au paiement, actuellement inerte |
| `src/routes/index.tsx` | 67-70 | (icône panier, badge « 1 ») | `<button>` | Icône panier de l'en-tête, `aria-label="Panier"` |

Le seul CTA destiné à mener à un paiement est **« Ajouter au panier — 29,90€ »** (`index.tsx:279`).

## 3. État actuel des handlers

Aucun bouton n'a de logique de paiement. Détail :

| Élément | Ligne | `onClick` ? | URL / destination | Balise |
|---------|-------|-------------|-------------------|--------|
| « Obtenir mon nettoyeur maintenant » | 92 | Non | `href="#buy"` (ancre vers section `id="buy"`, `index.tsx:250`) | `<a>` |
| « Ajouter au panier — 29,90€ » | 279 | Non | `href="#"` (placeholder — ne mène nulle part) | `<a>` |
| Bouton panier en-tête | 67 | Non | Aucune | `<button>` (sans `type`) |
| Logo « LuminaBrush » en-tête | 64 | Non | `href="#"` | `<a>` |
| Liens footer (Contact, Politique de confidentialité, CGV, Retours) | 341-343 | Non | `href="#"` (tous placeholders) | `<a>` |

**Conclusion section 3** : aucun handler `onClick`, aucun appel réseau, aucune redirection vers un prestataire de paiement (Stripe, PayPal, etc.). Le CTA d'achat est un `<a href="#">` purement décoratif. Aucune intégration de checkout n'existe à ce jour.

Les seuls `onClick` du projet se trouvent dans `src/routes/__root.tsx:50` (bouton « Try again » de la page d'erreur) — sans rapport avec le paiement.

## 4. Routes existantes

Fichiers présents dans `src/routes/` :

| Fichier | Rôle |
|---------|------|
| `src/routes/__root.tsx` | Route racine (TanStack Router) : shell HTML, `<head>`/SEO, providers React Query, composants `NotFound` (404) et `Error` |
| `src/routes/index.tsx` | Route `/` : la landing page complète (mono-produit) |

Routing : **TanStack Router** (file-based). Aucune route dédiée au panier, au checkout, à la confirmation de commande ou à un webhook. Arbre de routes généré dans `src/routeTree.gen.ts`.

## 5. Variables d'environnement déjà utilisées

Recherche de `import.meta.env`, `process.env` et `env.` dans tout `src/` :

```
grep -rn -E "import\.meta\.env|process\.env|env\." src/   →  AUCUNE OCCURRENCE
```

Recherche élargie (`import.meta.env` / `process.env`) sur l'ensemble du dépôt (`*.ts`, `*.tsx`, `*.js`, `*.mjs`, hors `node_modules`) :

```
→  AUCUNE OCCURRENCE
```

**Conclusion section 5** : le projet n'utilise actuellement **aucune variable d'environnement**. Aucune clé d'API, aucun secret, aucun fichier `.env` référencé dans le code. Tout ajout d'intégration de paiement nécessitera donc de définir les variables d'environnement à partir de zéro.

## Synthèse

- **1 produit** vendu : LuminaBrush Édition Rose Gold à **29,90 €**.
- **1 CTA d'achat réel** : « Ajouter au panier — 29,90€ » (`src/routes/index.tsx:279`), actuellement un `<a href="#">` inerte.
- **Aucun backend de paiement** : pas de `onClick`, pas d'appel réseau, pas de prestataire de paiement, pas de routes de checkout.
- **Aucune variable d'environnement** définie ou utilisée.
- Composants `src/components/` : seul `@/components/ui/accordion` est importé par `index.tsx` ; le reste de `src/components/ui/` est une bibliothèque shadcn/ui non utilisée par la landing page.
