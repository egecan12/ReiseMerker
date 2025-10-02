# 📍 Location Notebook

A modern web application for tracking and saving your visited locations with photos. Built with Angular frontend and Node.js backend.

## 🚀 Features

- **📍 Automatic Location Detection**: Uses browser's Geolocation API to get your current position
- **💾 Location Saving**: Save coordinates with custom names and descriptions
- **📸 Photo Upload**: Upload photos to your locations using Cloudinary
- **📋 Location List**: View all saved locations with details
- **🗺️ Maps Integration**: Open locations in Google Maps
- **🗑️ Location & Photo Management**: Delete unwanted locations and photos
- **📱 Responsive Design**: Modern UI compatible with mobile and desktop
- **☁️ Cloud Storage**: Photos stored securely on Cloudinary CDN
- **🔄 Real-time Updates**: Automatic location list refresh

## 🛠️ Technologies

### Frontend
- **Angular 18+**: Modern component-based framework
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming
- **CSS3**: Modern styling and animations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **Cloudinary**: Cloud-based image storage and management
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing

### Cloud Services
- **Cloudinary**: Photo storage, optimization, and CDN
- **MongoDB Atlas**: Cloud database (optional)

## 📦 Installation

### Requirements
- Node.js 18+ 
- npm 9+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- MongoDB connection string (optional, falls back to in-memory storage)
- Cloudinary account for photo uploads

### 1. Clone Project
```bash
git clone <repo-url>
cd location-notebook
```

### 2. Environment Setup
Create `.env` file in the root directory:
```bash
cp env.example .env
# Edit .env file with your MongoDB URI, Cloudinary credentials, and Google OAuth settings
```

### 3. Docker Setup (Recommended)
```bash
# Start all services with Docker
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 4. Manual Setup (Alternative)
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
ng serve
```

## 🔧 API Endpoints

### Authentication
- **GET** `/api/auth/google` - Google OAuth login
- **GET** `/api/auth/google/callback` - OAuth callback
- **GET** `/api/auth/me` - Get current user info
- **POST** `/api/auth/logout` - Logout user

### Locations
- **GET** `/api/locations` - Get all locations (authenticated)
- **POST** `/api/locations` - Save new location (authenticated)
- **DELETE** `/api/locations/:id` - Delete location (authenticated)

### Photos
- **POST** `/api/locations/:id/photos` - Upload photos to location (authenticated)
- **DELETE** `/api/locations/:locationId/photos/:photoId` - Delete specific photo (authenticated)

### System
- **GET** `/api/health` - Server health check
- **GET** `/api/cloudinary-test` - Cloudinary configuration test

## 📱 Usage

1. **Login**: Click "Login with Google" to authenticate
2. **Enter Location Name**: Type a meaningful name for your location
3. **Add Description**: Optional description for context
4. **Select Photos**: Choose up to 5 photos to upload (optional)
5. **Save**: Click "💾 Save Location" - location will be detected automatically
6. **View**: Saved locations appear in the list with photos
7. **Manage**: Click map icon to view on Google Maps, trash icon to delete

## 🔒 Security

- **Google OAuth**: Secure authentication with Google accounts
- **JWT Tokens**: Secure session management
- **CORS Policy**: Cross-origin resource sharing protection
- **Input Validation**: Server-side validation and sanitization
- **Environment Variables**: Sensitive data stored securely
- **Photo Upload Restrictions**: Size, type, and count limits
- **Geolocation API**: Requires user permission

## 🚀 Development

### Backend Development
\`\`\`bash
cd backend
npm run dev  # Nodemon with auto-restart
\`\`\`

### Frontend Development
\`\`\`bash
cd frontend
ng serve --open  # Auto-open browser
\`\`\`

### Production Build
\`\`\`bash
# Frontend
cd frontend
ng build --configuration production

# Backend
cd backend
npm start
\`\`\`

## 📊 Database

The app uses MongoDB with automatic fallback to in-memory storage. For MongoDB setup:

1. Create MongoDB Atlas account or install MongoDB locally
2. Add your MongoDB URI to \`.env\` file
3. The app will automatically use MongoDB when available

### Environment Variables (.env)
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/location-notebook

# Cloudinary Configuration (Required for photo uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Google OAuth Configuration (Required for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# JWT Secret (Required for authentication)
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret (Required for authentication)
SESSION_SECRET=your_super_secret_session_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost
BACKEND_URL=http://localhost:3000
```

## 🎨 Customization

### Themes
- Modify CSS variables in \`frontend/src/styles.css\` for color themes
- Responsive design adapts to different screen sizes

### API Configuration
- Change API URL in \`frontend/src/app/services/location.ts\`
- Modify upload limits in \`backend/config/cloudinary.js\`

## 🐛 Known Issues

- **HTTPS Requirements**: Geolocation API requires HTTPS in most browsers (works on localhost)
- **Location Accuracy**: GPS accuracy varies by device and environment
- **Photo Upload Limits**: 5MB per photo, 5 photos per location maximum

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 🔮 Future Features

- [ ] Location categories and tags
- [ ] Photo galleries and slideshow
- [ ] Export locations to KML/GPX
- [ ] Offline support with PWA
- [ ] Location sharing via URL
- [ ] Advanced search and filtering

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open a GitHub issue.

---

⭐ If you like this project, don't forget to give it a star!
