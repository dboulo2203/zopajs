
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




