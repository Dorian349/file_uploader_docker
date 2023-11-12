# Projet Docker - Application Front/Back/Mongo/Nginx

L'application est un système de gestion de fichiers. Avec la possibilité d'uploader, de télécharger, de supprimer et de mettre à jour le nom des fichiers.

L'application est faite en AngularJS pour le Front-end, NodeJS Express pour le Back-end, MongoDB pour la base de donnée. Un serveur Nginx est utiliser pour gérer les connexions et aussi permettre un système de load balancing.


## Utiliser le project 
```bash
# Pour lancer le projet en mode détaché
sudo docker-compose up -d
```
```bash
# Pour arrêter le projet
sudo docker-compose down
```

Une fois le projet lancée, le site est accessible via l'addresse http://localhost:3000/.

## Commandes annexes.
```bash
# Pour supprimer les images en plus des containeurs.
sudo docker-compose down --rmi all
```
```bash
# Pour supprimer les volumes en plus des containeurs.
sudo docker-compose down -v
```

## Structure du projet

La stack est composée de 4 services :

### frontend :

- **Build:** Dossier project-front, containeur project-front1 et project-front2 (load balancing)
- **Port:** 4200

### backend :

- **Build:** Dossier project-back, containeur project-back
- **Port:** 6000 (accessible via /api/)
- **Volume:** Un volume est créé pour garder en mémoire les fichiers ajoutées par les utilisateurs.

### database :

- **Build:** Le service utilise l'image MongoDB.
- **Port:** 27018 (utilisé uniquement par les utilisateurs, les containeurs communiquent à la base de données via le port local 27017 ouvert uniquement via le réseau privé).
- **Volume:** Un volume nommé `mongodb_data` est utilisé pour stocker les données persistantes de la base de données.

### nginx :

- **Build:** Dossier nginx, containeur nginx
- **Port:** 3000

### Networks :

- Un réseau local est crée pour permettre des communications sécurisées entre les containeurs.

### Volumes :

- Deux volumes sont créés, un pour la base de données pour le containeur project-mongo et un autre pour la sauvegarde des fichiers sur notre Back-end dans le containeur project-back.

## Screenshots

* Page d'accueil<br /><br />
![Page d'accueil](https://i.imgur.com/KJKagy7.png)
