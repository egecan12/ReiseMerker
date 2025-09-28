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

### 1. Git Repository Setup
\`\`\`bash
# Initialize new git repository
git init
git add .
git commit -m "Initial commit: Location Notebook app with photo upload feature"

# Push to GitHub (optional)
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
\`\`\`

### 2. Clone Project (if downloading from GitHub)
\`\`\`bash
git clone <repo-url>
cd location-notebook
\`\`\`

### 3. Environment Setup
Create \`.env\` file in the backend directory:
\`\`\`bash
cd backend
cp .env.example .env
# Edit .env file with your MongoDB URI and Cloudinary credentials
\`\`\`

### 4. Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
Backend will run on http://localhost:3000

### 5. Frontend Setup
\`\`\`bash
cd frontend
npm install
ng serve
\`\`\`
Frontend will run on http://localhost:4200

## 🔧 API Endpoints

### Locations
- **GET** \`/api/locations\` - Get all locations
- **POST** \`/api/locations\` - Save new location
- **DELETE** \`/api/locations/:id\` - Delete location

### Photos
- **POST** \`/api/locations/:id/photos\` - Upload photos to location
- **DELETE** \`/api/locations/:locationId/photos/:photoId\` - Delete specific photo

### System
- **GET** \`/api/health\` - Server health check
- **GET** \`/api/cloudinary-test\` - Cloudinary configuration test

## 📱 Usage

1. **Enter Location Name**: Type a meaningful name for your location
2. **Add Description**: Optional description for context
3. **Select Photos**: Choose up to 5 photos to upload (optional)
4. **Save**: Click "💾 Save Location" - location will be detected automatically
5. **View**: Saved locations appear in the list with photos
6. **Manage**: Click map icon to view on Google Maps, trash icon to delete

## 🔒 Security

- Geolocation API requires user permission
- CORS policy for secure API access
- Input validation and sanitization
- Environment variables for sensitive data
- Photo upload restrictions (size, type, count)

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
\`\`\`env
# MongoDB (optional - fallback to in-memory if not provided)
MONGODB_URI=mongodb://localhost:27017/location-tracker

# Cloudinary (required for photo uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Server
PORT=3000
\`\`\`

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
