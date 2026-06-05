# SfaxStore 🛒

> **Application e-commerce moderne développée avec Angular 19** — Une boutique en ligne complète avec gestion du panier, cartes cadeaux, favoris et processus de paiement.

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat&logo=angular)](https://angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 📸 Captures d'écran

### Page d'accueil
<img width="1845" height="873" alt="home1" src="https://github.com/user-attachments/assets/ca0f919e-5d9c-47c8-84a3-9827587d7cbd" /> 
<img width="1842" height="875" alt="home2" src="https://github.com/user-attachments/assets/c8241ec6-b465-476c-9c37-897a67126815" /> 
<img width="1841" height="712" alt="home3" src="https://github.com/user-attachments/assets/8b564739-7c6f-4980-88c8-96b4ad653c3f" />

### Page Produit
<img width="1472" height="631" alt="product" src="https://github.com/user-attachments/assets/bd3593c9-d5f0-4f76-b7df-fbe01a403422" />

### Panier
<img width="1697" height="698" alt="cart" src="https://github.com/user-attachments/assets/d25296cd-bbff-4bc3-951e-3f26eab79868" />

### Checkout
<img width="1663" height="877" alt="checkout" src="https://github.com/user-attachments/assets/1ca6876b-1214-49f9-82f9-84a1075b6b33" />

### Favoris
<img width="1836" height="662" alt="favorites" src="https://github.com/user-attachments/assets/0c9d8c38-49b8-4575-8618-4667dee3a64c" />

### Cartes Cadeaux
<img width="1836" height="870" alt="gift-cards" src="https://github.com/user-attachments/assets/9fe1a731-a68e-4703-83bc-2cf68184d1f2" />

---

## 🚀 Fonctionnalités

### Catalogue et Produits
- **Catalogue de produits** : Navigation dans une variété de produits avec informations détaillées
- **Page d'accueil** : Grille de produits avec offres spéciales et barre de recherche
- **Page produit** : Détails complets avec possibilité d'ajouter au panier ou aux favoris
- **Recherche** : Filtrage des produits par nom ou description

### Panier et Paiement
- **Panier d'achat** : Ajout de produits, gestion des quantités, calcul automatique des totaux
- **Cartes cadeaux** : Achat de cartes cadeaux et application sur les commandes
- **Processus de paiement** : Formulaire d'adresse de livraison avec validation (Reactive Forms)
- **Page de confirmation** : Écran de succès après paiement

### Fonctionnalités Utilisateur
- **Favoris (Wishlist)** : Liste de souhaits persistante avec compteur dans la navbar
- **Authentification** : Pages de connexion et d'inscription (simulées)
- **Nous Trouver** : Carte interactive (Leaflet) avec localisation du magasin

### Design
- **Design responsive** : Optimisé pour desktop et mobile avec Tailwind CSS
- **Composants Flowbite** : Interface utilisateur moderne et cohérente

## 🛠️ Stack Technique

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Angular** | 19.x | Framework principal (standalone components) |
| **TypeScript** | 5.7.x | Langage de programmation |
| **Tailwind CSS** | 4.x | Framework CSS utilitaire |
| **Flowbite** | 3.x | Composants UI basés sur Tailwind |
| **Leaflet** | 1.9.x | Cartes interactives |
| **RxJS** | 7.8.x | Programmation réactive |

## 📋 Prérequis

- **Node.js** v18.x ou supérieur
- **npm** v9.x ou supérieur
- **Angular CLI** v19.x

## 🔧 Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/MahdiBoughariou/Angular-SfaxStore.git
   cd Angular-Project
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement :**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur :**
   ```
   http://localhost:4200
   ```

## 📁 Structure du Projet

```
src/app/
├── app.component.*        # Composant racine (navbar + router + footer)
├── app.config.ts          # Configuration Angular
├── app.routes.ts          # Définitions des routes
├── auth/                  # Authentification (sign-in, sign-up)
├── cart/                  # Page panier
├── checkout/              # Processus de paiement (Reactive Forms)
├── contact/               # Page contact
├── core/services/         # Services métier (produits, panier, favoris, etc.)
├── favorites/             # Page des favoris (wishlist)
├── find-us/               # Page "Nous Trouver" avec carte Leaflet
├── gift-cards/            # Achat de cartes cadeaux
├── home/                  # Page d'accueil avec grille de produits
├── mock/                  # Données simulées
├── payment/               # Écran de confirmation de paiement
├── product/               # Page détail produit
└── shared/                # Composants partagés (navbar, footer, pipes, modèles)
```

## 🗺️ Routes de l'Application

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomeComponent | Page d'accueil avec produits |
| `/products/:id` | ProductComponent | Détail d'un produit |
| `/cart` | CartComponent | Panier d'achat |
| `/checkout` | CheckoutComponent | Formulaire de paiement |
| `/gift-cards` | GiftCardsComponent | Achat de cartes cadeaux |
| `/favorites` | FavoritesComponent | Liste des favoris |
| `/find-us` | FindUsComponent | Localisation du magasin |
| `/sign-in` | SignInComponent | Connexion |
| `/sign-up` | SignUpComponent | Inscription |
| `/PaymentSuccess` | PaymentSuccessComponent | Confirmation de paiement |

## 🏗️ Architecture Technique

### Services Principaux

- **ProductService** : Gestion des produits avec cache et recherche
- **CheckoutService** : État du checkout, calcul des totaux, application des cartes cadeaux
- **FavoritesService** : Gestion de la wishlist avec persistance localStorage
- **GiftCardService** : Création, validation et utilisation des cartes cadeaux

### Persistance des Données

Les données sont stockées dans le `localStorage` du navigateur :
- `cart-products` : Produits du panier
- `favorite-products` : IDs des produits favoris
- `purchased-gift-cards` : Cartes cadeaux achetées
- `applied-gift-card` : Carte cadeau appliquée à la commande

### Composants Standalone

Le projet utilise l'architecture **standalone components** d'Angular 14+ (sans NgModules), simplifiant l'import des dépendances directement dans chaque composant.

## 🧪 Scripts Disponibles

```bash
npm start      # Démarrer le serveur de développement
npm run build  # Compiler pour la production
npm run watch  # Compiler en mode watch
npm test       # Lancer les tests unitaires
```

## Back Office Administrateur

Le projet contient maintenant un espace administrateur complet pour répondre aux exigences du projet Angular :

- `/admin/dashboard` : statistiques, graphiques Chart.js, chiffre d'affaires, commandes récentes
- `/admin/products` : CRUD complet des produits avec Reactive Forms, recherche, filtre et relation Product / Category
- `/admin/categories` : CRUD catégories avec compteur de produits
- `/admin/orders` : consultation des commandes et changement de statut
- `/admin/users` : gestion des rôles `ADMIN` / `USER` et activation des comptes
- `/unauthorized` : page de refus d'accès

Comptes de démonstration :

```txt
ADMIN
email: admin@sfaxstore.tn
password: admin123

USER
email: user@sfaxstore.tn
password: user123
```

La sécurité front-end est représentée par :

- `auth.guard.ts` pour vérifier la connexion
- `role.guard.ts` pour limiter `/admin` au rôle `ADMIN`
- `auth.interceptor.ts` pour ajouter un token Bearer simulé aux requêtes HTTP
- `PERMISSIONS` pour documenter les permissions par rôle

Les services administrateur simulent une API REST avec persistance `localStorage` :

- `AdminProductService`
- `CategoryService`
- `OrderService`
- `UserService`
- `DashboardService`

Ces services consomment aussi la vraie API REST .NET disponible dans `SfaxStore.Api` quand elle est lancée sur :

```txt
http://localhost:5170/api
```

## Back-End REST .NET

Le dossier `SfaxStore.Api/` contient un back-end ASP.NET Core Web API avec EF Core InMemory.

Commandes :

```bash
cd SfaxStore.Api
dotnet restore
dotnet run --launch-profile http
```

Endpoints principaux :

```txt
POST   /api/auth/login
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
GET    /api/orders
PUT    /api/orders/{id}/status
GET    /api/users
PUT    /api/users/{id}/role
PUT    /api/users/{id}/active
DELETE /api/users/{id}
GET    /api/dashboard/stats
GET    /api/dashboard/orders-by-month
GET    /api/dashboard/products-by-category
GET    /api/dashboard/revenue
GET    /api/dashboard/orders-by-status
```

## Déploiement Firebase Hosting

Firebase Hosting est configuré avec :

```txt
firebase.json
.firebaserc
public: dist/sfaxstore/browser
baseHref: /
```

Avant le premier déploiement, remplace `YOUR_FIREBASE_PROJECT_ID` dans `.firebaserc` ou lance :

```bash
firebase login
firebase use --add
```

Puis :

```bash
ng build --configuration production
firebase deploy
```

Remarque : Firebase Hosting déploie le front-end Angular. Le back-end .NET doit être lancé localement pendant la démonstration ou hébergé séparément pour une version production complète.

## 👥 Auteur

**Yessine Choura**

---

*Projet réalisé dans le cadre d'un cours Angular - Sfax, Tunisie* 🇹🇳
