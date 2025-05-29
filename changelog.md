# Avancement
25-05 : --remplacer le append de la modale : jQuery("#" + htlmPartId)
24-05 : Création du login component
23-05 : remplacement jquery dans modal 
23-05 revent from clicking outside the modal data-bs-backdrop="static" data-bs-keyboard="false"
21-05 : remplacement des selectors jquery par querySelector == 
- 20-05-2025 : - Passage des fonctions de personSerice en async await, reprise du controler pour fonctionnement avec async/await
- 21-05 : organisation en composants et shared.
- 21-05 : Amélioration du "jsx like".
- 20-05 Gestion des erreurs ddans les fetchs
- 20-05 PPassage des webs services en async/await
- 19-05 :  Stopper exécution tant que les initialisations ne sont pas faites

-------------------------------------------------------------------------
# Components
## Composant person
- Finaliser la gestion du state.
- Service supprimer les callbacks.
(newModaleString);
- géer les érreurs de fetch

##  Login component
- TODO : faire le logout
- Tester le login et le niveau de droits
- placer le bouton dans le composant, afficher le nom de l'utilisateur loggé
- TODO : controller/view  de login,service de login, sauvegarde de l'utilisateur courant 
- TODO : crypter les mots de passe.
- TODO : se protéger contre les modifications manuelles des données du localstore
        https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- TODO : le component fournit même le bouton de login

## Search component
- Finaliser la gestion des résultats de recherche avec les autres types de recherche
- Bug affichage des images sur mobile

## Notice compnent
- Notice : note list to be displayed

## Translation component
- NEW : Version 1 opérationnelle,
- TODO : ajouter capacité à découvrir les langues en fonction des fichiers présents

## 
----------------------------------------------------------------------------
# Développement du modèle d'application

- Comment angular fait-il pour gérer des url open data

## Suppression de Jquery
TODO : remplacement document.ready 


## Bug 
- TODO Gestion du cache des modules javascripts
- TODo : Le seul cas d'appel entre customcomponets est le menu gauche : il doit faire appel à la fonction de création de person
- BUG : quand on appelle directement une page, les données d'initailisation ne sont pas chargées.

## update et création d'un enregistrement
- TODO Réinitailiser les objets à l'initailisation de l'appliication
- TODO ajouter le nom du user de modif et la date à finaliseer


## Permaliens et back/forward
- NEW : Fait : Ajouté appel de pages html pour gestion des url et navigation browser 
- TODO : Autre solution à explorer: ajouter un router de facon à pouvoir gérer les permaliens.

## Call fetch
- DONE : Gérer les erreurs dans les fetch,
- TODO : tester tous les types d'erreur.

## Conservation des données avec localstorage (state)
- NEW : Save person et disctionnaires: ok
- TODO : Voir la conservation des données entre les pages de navigation, par exemple person
- TODO : Faut-il vider le localstorage
- TODO : mofication personcontroller pour prise en compte du state

- App.js
    - initalise les données communes
    - lance la première page 
## Structure de l'application
- TODO : gestion des erreurs
- TODO : structure d'un controller, appel de page par URL

# Structure d'une application Javascript frameword DB
- views
    Chaque page de données possède : 
    xxx.html : permet l'appel de l'entité depuis une url unique
    xxx.viewController.js : Controller principal : Gère l'affichage et les interactions principales
    xxx Modale.js : un fichier par modale utilisée par le controller principal

- Services 
    - YYYYYService : un service par objet géré 
        - un service peut ou non posséder un state
        - les states sont sauvés dans le localstorage
        - Le service gère les méthodes de l'objet  

    - commonFunctions : fonctions javascript communes.  

- Locales : fichiers de sauvegarde des traductions

- assets : constantes utilisées par le programme

# Notes
- Améliorer l'API en retrournant coorectement des éléments créés lors d'un POST

## Principes
###
- un customcomponent  peut être appelé :
    - seul, par un appel à une URL
    - dans le cadre d'une application (mais toujours par une Url)
- un component a une version
- un component affiche clairement ses dépendances

### un "customcomponent" par entité
- entité = noticce, person, keyword, publisher etc
- rendre chaque écran le plus autonome possible afin de ne pas avoir à re-tester l'ensemble de l'application à chaque modification.
- un écran d'entité peut être appelé par url domainname/screenxxx/id de manière autonome
- un customcomponent gère son affichage, ses évenements
- pas de partage de variables communes
- Une customcomponent peut utiliser des services externes (liste pour liste de choix)
- Dans un customcomponent, l'utillisation de ressources communes est clairement identifié dans le controller principal du customcomponent  

### Parties communes sont composées de : 
- les variables communes sont dans un fichier clairement identifié.
- - Nom de la div dans laquelle le customcomponent doit s'installer
- Les services communs : translation, 
- Les fonctions communes

### Enveloppe
- Les parties communes sont : navbar et menu canvas, le mainpage component
### partie commune

### Cas des écrans multi customcomponent
- Exemple Zopa : écran commande affiche une partie facture. 

### pu logiciel
- utilisation maximale du jsx like 

### Date picker
<label for="startDate">Start</label>
<input id="startDate" class="form-control" type="date" />

    