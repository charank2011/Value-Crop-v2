# Separate Database Setup Guide

## Overview
This guide explains how to run MySQL database separately and connect it to your Render-deployed backend.

## Option 1: Run Database Locally (Development)

### Prerequisites
- Docker installed on your machine
- Docker Compose

### Steps

1. **Build and start the MySQL container:**
   ```bash
   docker-compose -f docker-compose.db.yml up -d
   ```

2. **Verify it's running:**
   ```bash
   docker-compose -f docker-compose.db.yml ps
   ```

3. **Check connection:**
   ```bash
   docker-compose -f docker-compose.db.yml logs db
   ```

### Database Details
- **Host:** localhost
- **Port:** 3306
- **Database:** valuecrop
- **Root User:** root
- **Root Password:** root
- **App User:** valuecrop_user
- **App Password:** valuecrop_pass

### Stop the database:
```bash
docker-compose -f docker-compose.db.yml down
```

---

## Option 2: Use Render Managed Database (Production)

### Steps

1. **Create a MySQL database on Render:**
   - Go to https://dashboard.render.com
   - Click "New" → "PostgreSQL" (or MySQL if available)
   - Configure credentials
   - Get the connection string

2. **Update Render Backend Environment Variables:**
   - Go to your backend service settings
   - Update `SPRING_DATASOURCE_URL` with your database URL
   - Update `SPRING_DATASOURCE_USERNAME` 
   - Update `SPRING_DATASOURCE_PASSWORD`
   - Redeploy

Example connection string:
```
jdbc:mysql://user:password@host:3306/dbname
```

---

## Option 3: Use External Database (AWS RDS, Cloud SQL, etc.)

1. **Set up database on your cloud provider**
2. **Get connection string**
3. **Update Render backend environment variables:**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-host:3306/valuecrop
   SPRING_DATASOURCE_USERNAME=your_user
   SPRING_DATASOURCE_PASSWORD=your_password
   ```
4. **Deploy**

---

## Database Files Location

- **Dockerfile:** `./Database/Dockerfile`
- **Docker Compose (DB only):** `./docker-compose.db.yml`
- **Local compose (all services):** `./docker-compose.yml`

---

## Running All Services Locally

To run frontend, backend, AND database locally:

```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost
- Backend: http://localhost:1234
- Database: localhost:3306

---

## Updating render.yaml for Your Database

Edit `render.yaml` and change the database connection:

```yaml
envVars:
  - key: SPRING_DATASOURCE_URL
    value: jdbc:mysql://YOUR_HOST:3306/valuecrop
  - key: SPRING_DATASOURCE_USERNAME
    value: YOUR_USERNAME
  - key: SPRING_DATASOURCE_PASSWORD
    sync: false  # Set this in Render dashboard
```

Then push to GitHub:
```bash
git add render.yaml
git commit -m "Update database connection"
git push
```

---

## Troubleshooting

**Can't connect to database:**
- Check firewall/security groups allow port 3306
- Verify username/password are correct
- Ensure database is running: `docker ps`

**Backend deployment fails:**
- Check Render logs for connection errors
- Verify environment variables are set correctly
- Ensure database host is reachable from Render (add IP to whitelist if on AWS/GCP)

**Database container exits:**
- Check logs: `docker-compose -f docker-compose.db.yml logs db`
- Ensure `/var/lib/mysql` volume has write permissions

---

## Database Persistence

Data is stored in Docker volume `db_data` and persists even if container is stopped.

To reset database:
```bash
docker-compose -f docker-compose.db.yml down -v
docker-compose -f docker-compose.db.yml up -d
```

This removes the volume and creates a fresh database.
