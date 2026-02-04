# zopajs

## Release notes
### v3.0.4
- Unification des en-têtes de page
- Ajout du composant products
- Ajout du composant stages
### V 3.0.3 
- Développements de composants dropdown 
### V 3.0.3 
- Ajout d'un module restaurant généré par AI
- Menu gauche configurable
- Réorganisation de l'architecture : partiee view, partie shared/services

### V 3.0.2 
- NEW : Dark mode
- NEW : service login
- Utilisation de fontawesome,
- NEW : general : sauve les données dans session storage.

- NEW : customer search page
- NEW : customer page
    - Display customer orders
    - TODO : listes income level, publipostage, adhésion
    - TODO : Paginer les commandes
    - TODO : Lien vers invvoice
        - Display customer invoices

- NEW : order page
    - Display order identity
    - Display order lines
    - Display order invoice
    
- NEW : Booking page : 
    - Affichage Résumé de la commande avec lien vers commande
    - Copier planning dans clipboard
------------
## App structure
### customer search page
    - Add a new customer
    - Search by phone, email, town
### Customer page
    - [Done] Display customer identity
    - [Done] Display customer orders
    - [Done] Display Invoices list,
    - Edit customer identity (Save)
    - Add new order
    - Pay multiple invoices (Modal)
### Order page
    - [Done] Display order identity
    - Change status to Draft
    - Display badge
    - Display devis
    - Validatee order
### Order lines 
    - Display order lines
    - Tool session (modal)
    - Tool retreat (modal)
    - Add hosting (modal)
    - Add meal( modal)
    - Add subscription (modal)
    - Add a new order line (modal)
    - One line tools : 
        - Remove line
        - Edit line (modal)
        - Show product (modal)
        - Split line (modal)
        - Add hosting  (modal)
        - Delete meals (modal)
    - Display Order invoices
### Invoice page
    - Display invoice entity
        - print invoice pdf
    - Display payments
    - Display remises et acomptes
    - Display invoices lines 
### Product page
    -  Display product list (from criteria)
    - Product page : copy attendees list in clipboard
    - Display order summary (modal)
### Lists page
### Restaurant page
### Hosting page
    - Display hosting planning
    - Copy hosting planning in clipboard
    - Display order summary
    - Close order
### Session page
    - Display session planning
    - Display sessions configuration
### Accounting page
    - Display cash register