# SfaxStore.Api

REST API backend for the Angular SfaxStore exam project.

## Run

```bash
dotnet run --launch-profile http
```

API URL:

```txt
http://localhost:5170/api
```

## Demo accounts

```txt
ADMIN: admin@sfaxstore.tn / admin123
USER:  user@sfaxstore.tn / user123
```

## Endpoints

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
