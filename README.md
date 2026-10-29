# Grimoire de platine

Web app (PWA) de suivi de trophées, façon grimoire BG3 : jet de platine sur un d20, codex parchemin, sceaux de cire.
Installable sur téléphone, fonctionne hors ligne, synchronisée entre appareils via Supabase.

## Fonctionnalités

- **Grimoire** : jet de platine (le d20 se remplit avec ta progression), médailles par métal, journal de quête par acte, guides.
- **Dé du destin** : tire au sort ta prochaine quête parmi celles faisables, façon jet de compétence (classe de difficulté calculée d'après la rareté).
- **Registre** : onglets À faire / En cours / Obtenus, recherche, filtres en codex parchemin (catégories, métal, « faisable maintenant », « manquable », « 1 partie », rares).
- **Fiche détaillée** : statut, compteur, **checklist** (étapes prévues + étapes perso), astuce, date d'obtention modifiable, liens soluces/vidéos, notes.
- **Journal de bord · Compagnie** : niveau du groupe (seuils d'XP, repères par acte), qui est dans ton groupe (3 places), au camp, à recruter (où les trouver) ou parti. Rappel automatique quand un compagnon doit monter de niveau.
- **Fiche compagnon** (10 compagnons) : caractéristiques modifiables avec modificateurs et priorités, build conseillé et variantes, classe après respécialisation, sous-classe, **plan de niveaux 1 → 12** (ce que la classe gagne, dons, sorts clés, prochain niveau mis en avant), relation, romance, conseils, trophées liés, notes.
- **Portraits** : touche le médaillon d'un compagnon ou de ton personnage pour y mettre ta propre image (capture d'écran du jeu par exemple). Elle est recadrée, réduite à 192 px et synchronisée avec ton compte.
- **Journal de bord · Mon perso** : nom, origine, race, classe, sous-classe, niveau, caractéristiques et le même plan de niveaux pour ta classe (avec le guide du compagnon si tu joues une origine).
- **Journal de bord · Partie** : origine, classe, difficulté, acte en cours. Le grimoire calcule ce qui est faisable maintenant, signale les **manquables** et demande confirmation avant un **point de non-retour**. « Nouvelle partie » archive la fiche et remet à zéro les compteurs « 1 partie ».
- **Chronique** : courbe de progression dans le temps et frise des sceaux par mois.
- **Partage** : carte PNG 1080×1350 avec ton d20 et tes médailles.
- **Multi-jeux** : importe d'autres platines à partir du modèle `games/modele-jeu.json`.
- **Sauvegarde** : export / restauration JSON. **Sons** synthétisés (coupables).

## Mise en ligne

### 1. Supabase (synchronisation)

1. Crée un projet sur [supabase.com](https://supabase.com) (offre gratuite), **ou réutilise un projet existant** : le grimoire n'ajoute qu'une table, `grimoire_entries`, qui ne touche pas aux autres. Les comptes sont alors partagés avec l'autre app.
2. **SQL Editor → New query** : colle le contenu de `supabase/schema.sql`, puis **Run**.
3. **Project Settings → API** : copie la **Project URL** et la clé **anon / public**, colle-les dans `config.js`.
   Cette clé est publique par conception : ce sont les règles RLS du schéma qui protègent tes données.
4. **Authentication → URL Configuration** : mets l'adresse GitHub Pages (étape 2) dans **Site URL**, pour que le lien de confirmation d'email ramène vers l'app.
5. Après avoir créé ton compte depuis l'app, tu peux désactiver **Authentication → Sign In / Providers → Allow new users to sign up** pour que personne d'autre ne puisse s'inscrire.

### 2. GitHub Pages (hébergement)

1. Pousse ce dossier sur un dépôt GitHub.
2. **Settings → Pages** : *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. L'app est servie sur `https://<ton-compte>.github.io/<nom-du-depot>/`.

Aucune étape de build : ce sont des fichiers statiques. À chaque mise à jour, incrémente `VERSION` dans `sw.js` pour que les téléphones récupèrent la nouvelle version.

### 3. Installer sur le téléphone

- **iPhone (Safari)** : ouvre l'adresse, bouton Partager, puis « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮, puis « Installer l'application » (ou le bouton dans l'onglet *Plus*).

Ouvre ensuite l'onglet **Plus** pour te connecter : ta progression se synchronise.

## Ajouter un jeu

1. Onglet *Plus* → **Modèle de jeu** (ou `games/modele-jeu.json`).
2. Remplis la liste `trophies` : `id`, `n` (nom), `d` (description), `t` (`p` platine, `g` or, `s` argent, `b` bronze), `c` (catégorie), `a` (acte ou `any`), `r` (rareté en %), et au besoin `goal` + `u` (compteur), `steps` (checklist), `tip`, `req` (conditions de partie).
3. Onglet *Plus* → **Importer un jeu**. Le jeu est synchronisé avec ton compte.

Icônes de catégorie disponibles : `book`, `crown`, `skull`, `helm`, `heart`, `chest`, `vial`, `sword`, `d20`, `map`, `star`, `gem`.

## Structure

```
index.html            coquille de l'app
config.js             connexion Supabase
sw.js                 hors ligne (service worker)
manifest.webmanifest  installation PWA
css/app.css           design
js/app.js             vues et interactions
js/store.js           stockage local horodaté
js/sync.js            synchronisation Supabase
js/games.js           registre des jeux + modèle
js/die.js             d20
js/icons.js           icônes encre, coupes, volutes
js/share.js           carte de partage
js/sound.js           sons
js/motes.js           braises en fond
games/bg3.js          données Baldur's Gate 3 (trophées)
games/bg3-party.js    classes, compagnons, seuils d'XP
supabase/schema.sql   table et règles d'accès
```

Tester en local : `python3 -m http.server` dans ce dossier, puis http://localhost:8000.
