# Déploiement Vercel

L'interface Angular appelle `/api`. Le dossier `api` contient l'API Node adaptée à Vercel ; le serveur .NET reste disponible pour le développement local historique.

Configurer la variable secrète `DATABASE_URL` avec une connexion PostgreSQL TLS (`sslmode=verify-full`). La base utilise exclusivement le schéma `sfaxstore`, séparé des autres applications. Initialiser une fois avec `DATABASE_URL`, `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans l'environnement : `node scripts/init-db.js`. Le mot de passe administrateur n'est pas intégré au dépôt. Les mots de passe sont hachés avec scrypt, les sessions expirent après sept jours, et l'administration est contrôlée par le serveur.

Les commandes sont enregistrées au compte connecté, avec adresse de livraison, prix calculés côté serveur, stock réservé dans une transaction et paiement à la livraison. Une annulation restaure le stock une seule fois. Le total applique les frais et taxes déjà utilisés par l'interface (8 %, livraison 9,99 TND sous 100 TND).

Les paiements bancaires et cartes cadeaux ne sont pas connectés. Aucun débit bancaire ni envoi d'e-mail n'est effectué. Les favoris et le panier restent propres au navigateur. Les images administrateur PNG/JPEG/WebP (2 Mo maximum) sont conservées dans PostgreSQL et servies par `/api/images/:id`.

Validation : `npm run build`. Le projet conserve Angular 16 ; sa mise à niveau et la configuration des paiements sont des travaux distincts à prévoir avant une exploitation commerciale.
