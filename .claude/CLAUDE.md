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
