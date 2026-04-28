# Valuecrop Deployment Guide - Render

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at https://render.com
3. **MySQL Database** - Render-hosted or external

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Initialize Git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/valuecrop.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Services on Render

#### Option A: Using Render Blueprint (Recommended)
1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will read `render.yaml` and create all services
5. Configure environment variables (see Step 3)
6. Deploy!

#### Option B: Manual Service Creation

**Service 1: Database (PostgreSQL or MySQL)**
- Type: Private Service
- Runtime: Docker
- Image: `mysql:8.0`
- Exposed port: 3306
- Environment Variables:
  - `MYSQL_DATABASE`: `valuecrop`
  - `MYSQL_ROOT_PASSWORD`: [Generate strong password]

**Service 2: Backend**
- Type: Web Service
- Runtime: Docker
- GitHub Repo: Your repository
- Dockerfile Path: `./Backend/valuecrop/Dockerfile`
- Port: 1234
- Build Command: `cd Backend/valuecrop && ./mvnw clean package -DskipTests`
- Start Command: `java -jar target/*.war`
- Environment Variables: (See Step 3)
- Connect to Database service

**Service 3: Frontend**
- Type: Web Service  
- Runtime: Docker
- GitHub Repo: Your repository
- Dockerfile Path: `./Frontend/Fsad/Folder1/Dockerfile`
- Port: 80
- Build Command: `cd Frontend/Fsad/Folder1 && npm install && npm run build`
- Environment Variables: (See Step 3)

### Step 3: Configure Environment Variables

Set these in Render dashboard for each service:

**Backend Service:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://valuecrop-db:3306/valuecrop
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=[your_password]
```

**Frontend Service:**
```
VITE_API_BASE_URL=https://valuecrop-backend.onrender.com
```

**Database Service:**
```
MYSQL_DATABASE=valuecrop
MYSQL_ROOT_PASSWORD=[your_password]
```

### Step 4: Deploy

1. Click **Deploy** on Render dashboard
2. Monitor build progress in Logs
3. Wait for all services to become "Live" (green status)

## Service URLs

- **Frontend**: https://valuecrop-frontend.onrender.com
- **Backend API**: https://valuecrop-backend.onrender.com
- **Database**: valuecrop-db:3306 (internal only)

## Important Notes

⚠️ **Security:**
- Never commit `.env` files with real passwords
- Use Render's environment variable management
- Generate strong passwords for database
- Keep MySQL password in sync across services

🔗 **Connectivity:**
- Services communicate via private network on Render
- Frontend and backend connect over HTTPS
- Database is internal-only (no external access)

📊 **Monitoring:**
- Check Render dashboard for service status
- Review logs if deployment fails
- Render provides 750 free hours/month for web services

## Troubleshooting

**Build Fails:**
- Check build logs in Render dashboard
- Verify Java/Node versions in Dockerfiles
- Ensure pom.xml and package.json are correct

**Services Can't Connect:**
- Verify environment variables match
- Check database connection string
- Ensure services are in same region

**Frontend Shows Blank Page:**
- Check VITE_API_BASE_URL variable
- Verify backend service is running
- Check browser console for errors

## Next Steps

1. Push code to GitHub
2. Sign up on Render.com
3. Create Blueprint from render.yaml OR manually create services
4. Set environment variables
5. Deploy and monitor

For more help: https://render.com/docs
