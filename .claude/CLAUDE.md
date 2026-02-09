<<<<<<< HEAD

# CLAUDE.md

## Project Overview
Le projet vise à construire une application de gestion des inscriptions à des retraites.

## Tech Stack
- javascript 
- bootstrap 5.3 
- bootstrap icons

## Common Commands

## Architecture

### application
/src/
|- shared
|- views

### répertoire shared
- le répertoire shared contient tous les fichiers et toutes les fonctions utilisées par les pages
/src/shared/ 
    |- assets
    |- bootstrapServices
    |- commonServices
    |- appServices
    |- appWSServices

### répertoire views
- le répertoire view contient les pages fonctionnelles de l'application (pages)
/src/shared/ 
    |- assets
    |- bootstrapServices
    |- commonServices
    |- appServices
    |- appWSServices

## Code Style
- générer un code simple plutôt que malin
- Si de petites fonctions sont nécessaires, il sera proposé de les intégrer dans les services communs (commonServices)
- ne pas utiliser de css, utiliser les styles bootstrap

### pageviews/pageName
- voir modèle de page dans le répertoire 
- une page est un ensemble fonctionnel cohérent.
- un page est appelée par son url. l'url peut comporter un id permettant l'accès à une entité de la base de données. 
- une page est dans un répertoire nommé pageName
|- pageName
    - pageName.html
    - pageNameViewController.js

- un page possède un pagetitle
- une page peut être constituée de 1 ou plusieurs blocks
- l'affichage des blocks est organisé par la page

### block
- un block est une partie fonctionelle de la page. 

### fields
simpleField-pattern : 
    `<div class="fieldSimpleDisplay" > <span class="fw-light">${fieldName}</span> : <span>${ fieldValue }</span></div>`



### data access
- les données de l'application sont extraites au moyen de web services situés dans le répertoire shared/appServices




=======
# Instructions pour Claude Code - Projet ZopaJS

## Structure des dossiers de pages

Lorsque tu crées un nouveau dossier pour une nouvelle page de Zopa, suis exactement la structure du dossier `views/restaurant/` :

```
views/[nomPage]/
├── css/                          # Dossier pour les styles CSS spécifiques
├── [nomPage].html                # Fichier HTML principal (point d'entrée)
├── [nomPage]Service.js           # Service pour les appels API
└── [nomPage]ViewController.js    # Contrôleur de vue
```

## Architecture du contrôleur

Le fichier `*ViewController.js` doit être **entièrement dynamique** :
- Le template HTML doit être défini en tant que template string dans le contrôleur
- Aucune donnée provenant des appels API ne doit être présente dans le contrôleur
- Les données sont récupérées via le fichier Service et injectées dynamiquement

Exemple :
```javascript
const nomPageContentString = `
    <div class="...">
        <!-- Template HTML ici, sans données API -->
    </div>
`;
```

## Responsive et affichage mobile

Pour éviter les problèmes d'affichage sur mobile (notamment le menu header avec les 3 points qui devient inaccessible), tous les tableaux susceptibles de dépasser la largeur de l'écran doivent être enveloppés dans un conteneur avec scroll horizontal :

```html
<div style="overflow-x: auto;">
    <table class="table table-bordered table-sm">
        <!-- contenu du tableau -->
    </table>
</div>
```

Cette règle s'applique à tous les tableaux de données (résultats, commandes, configurations, etc.).

## Appels API

### Clé API

En début de chaque fichier Service, déclare la clé API ainsi :

```javascript
const DOLAPIKEY = 'OpK1D8otonWg690PIoj570KdHSCqCc04';
```

Puis réfère-toi à cette constante pour tous les appels API du fichier.

### URL de base

Utilise le fichier `shared/assets/configuration.json` pour récupérer l'URL de base des appels API :

```javascript
import { getConfigurationValue } from '../../shared/services/configurationService.js';

const wsUrlformel = getConfigurationValue("wsUrlformel");
const apiUrl = `${wsUrlformel}endpoint?DOLAPIKEY=${DOLAPIKEY}`;
```

## Exemple de structure Service

```javascript
import { getConfigurationValue } from '../../shared/services/configurationService.js';

const DOLAPIKEY = 'OpK1D8otonWg690PIoj570KdHSCqCc04';

export async function fetchData() {
    try {
        const wsUrlformel = getConfigurationValue("wsUrlformel");
        const apiUrl = `${wsUrlformel}mon-endpoint?DOLAPIKEY=${DOLAPIKEY}`;
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
}
```
>>>>>>> bfed825639fed099b2ed3a021b5755a2729f7ee8
