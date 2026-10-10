# Contribuer à finance-raven

Merci de vouloir aider ! Les corrections de taux, les signalements de bugs et les petites améliorations sont les bienvenus.

## Signaler un problème

Ouvre une issue en précisant :

- ce que tu as fait, ce que tu attendais et ce qui s'est passé ;
- ton appareil et ton navigateur (et si l'app est installée sur l'écran d'accueil) ;
- pour un calcul faux : ton activité, l'année, les montants concernés et la source officielle qui donne le bon résultat.

**N'inclus jamais tes vraies données** (sauvegarde JSON, noms de clients, montants réels) : invente un exemple qui reproduit le problème.

## Mettre à jour les taux

Les taux, plafonds et barèmes sont dans `src/domain/rules/rules.constants.ts`, une entrée par année.

1. Ajoute ou corrige l'année concernée, avec la source officielle en commentaire (urssaf.fr, impots.gouv.fr, service-public.fr).
2. Mets à jour les tests de `src/domain/` qui en dépendent.
3. Mentionne la source dans la description de la pull request.

## Installer le projet

Il faut Node 22+ et pnpm (la version est fixée dans `package.json` via `packageManager`).

```bash
pnpm install
pnpm dev
```

## Avant d'ouvrir une pull request

La CI lance exactement ces commandes, elles doivent toutes passer :

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e        # nécessite `pnpm exec playwright install chromium webkit`
```

Si tu modifies l'interface, régénère les captures du README avec `pnpm screenshots` et ajoute-les à la PR.

## Conventions

- **pnpm** uniquement (pas de `npm` ni de `yarn`).
- **Un fichier, une responsabilité.** Sépare la logique (utils, hooks) de la mise en page ; évite les fichiers très longs.
- **Un dossier par composant**, sur ce modèle :

  ```
  src/components/Pill/
    index.ts            # export public
    Pill.tsx            # le composant
    Pill.types.ts       # ses types
    Pill.constants.ts   # constantes, si utile
    Pill.module.css     # styles
    Pill.test.tsx       # tests
    Pill.stories.tsx    # story Storybook
  ```

- **Calculs dans `src/domain/`** : TypeScript pur, sans React, entièrement testé.
- **Styles** : CSS Modules et les tokens de `src/styles/tokens.css`. Pas de couleurs en dur. Pense au mode sombre.
- **Mobile d'abord** : vérifie à 360 px de large ; les zones tactiles font au moins 44 px.
- **Textes de l'interface en français**, en tutoyant l'utilisateur.
- **Aucun serveur** : les données restent dans le `localStorage`. Pas de traceur ni d'appel réseau vers un tiers.
- **Commits** au format [Conventional Commits](https://www.conventionalcommits.org/fr/) : `feat(entries): …`, `fix(domain): …`.

## Licence

En contribuant, tu acceptes que ton code soit publié sous la [licence MIT](LICENSE) du projet.
