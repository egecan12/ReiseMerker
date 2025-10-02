# 📍 Location Notebook - Frontend

This is the frontend application for Location Notebook, built with Angular 18+.

## 🚀 Features

- **📍 Location Tracking**: Automatic location detection using browser's Geolocation API
- **📸 Photo Upload**: Upload and manage photos for each location
- **📋 Location Management**: View, edit, and delete saved locations
- **🗺️ Maps Integration**: Open locations in Google Maps
- **📱 Responsive Design**: Modern UI compatible with mobile and desktop
- **🔐 Authentication**: Google OAuth integration for secure access

## 🛠️ Technologies

- **Angular 18+**: Modern component-based framework
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming
- **CSS3**: Modern styling and animations

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build
```bash
ng build
```
The build artifacts will be stored in the `dist/` directory.

### Production Build
```bash
ng build --configuration production
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth-success/     # OAuth success page
│   │   ├── demo/             # Demo component
│   │   ├── location-list/    # Location list display
│   │   ├── location-tracker/ # Main location tracking
│   │   ├── login/            # Login component
│   │   └── photo-upload/     # Photo upload component
│   ├── guards/
│   │   └── auth.guard.ts     # Authentication guard
│   ├── services/
│   │   ├── auth.service.ts   # Authentication service
│   │   └── location.ts       # Location API service
│   └── ...
├── environments/
│   ├── environment.ts        # Development environment
│   └── environment.prod.ts  # Production environment
└── ...
```

## 🔧 Configuration

### Environment Variables
Update `src/environments/environment.ts` for development:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Update `src/environments/environment.prod.ts` for production:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## 📦 Docker

The frontend is containerized using Nginx. See the main `DEPLOYMENT.md` for Docker setup instructions.

## 🔗 API Integration

The frontend communicates with the backend API for:
- Authentication (Google OAuth)
- Location CRUD operations
- Photo upload and management
- User session management

## 🎨 Styling

- Modern CSS3 with custom properties
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Clean, minimalist UI design

## 🚀 Deployment

For production deployment, see the main `DEPLOYMENT.md` file for Docker-based deployment instructions.