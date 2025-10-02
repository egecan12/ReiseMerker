# 📸 Cloudinary Photo Upload Setup

This guide explains the steps required to enable photo upload functionality in the Location Notebook application.

## 🔧 Creating a Cloudinary Account

### 1. Sign Up for Cloudinary
1. Go to https://cloudinary.com
2. Click **Sign Up** button
3. Enter your information and create account
4. Verify your email

### 2. Get Dashboard Information
1. Log in to Cloudinary Dashboard
2. On the **Dashboard** page, find the following information:
   - **Cloud Name** (e.g., `dxmhc7vhk`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (hidden, can be shown with Show/Hide)

## ⚙️ Backend Configuration

### 1. Create .env File
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# CORS Configuration
FRONTEND_URL=http://localhost
```

### 2. Add Cloudinary Information
In the above file, replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your own information.

**Example:**
```env
CLOUDINARY_CLOUD_NAME=myapp-photos
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef1234567890abcdef1234567890
```

## 🚀 Features

### Photo Upload
- **Drag & Drop**: Upload photos by dragging and dropping
- **Click to Select**: Select photos using file picker
- **Multiple Upload**: Upload up to 5 photos at once
- **Auto Resize**: Photos are automatically resized to max 800x600
- **Format Support**: JPEG, PNG, GIF, WebP formats supported
- **Size Limit**: Each photo can be max 5MB

### Photo Management
- **Photo Gallery**: Photo gallery for each location
- **Full Size View**: View photos in full size
- **Delete Photos**: Delete unwanted photos
- **Auto Organization**: Photos are organized in `location-tracker` folder

## 📁 Folder Structure

Your photos in Cloudinary are organized as follows:
```
location-tracker/
├── photo1_randomid.jpg
├── photo2_randomid.png
└── photo3_randomid.webp
```

## 🔒 Security

- **API Key**: Kept secret in frontend, only used in backend
- **File Validation**: Only image files are accepted
- **Size Limits**: Large file uploads are prevented
- **Auto Cleanup**: Photos are deleted from Cloudinary when location is deleted

## 🆓 Free Usage

Cloudinary free plan:
- **25,000** transformations/month (resize, format change, etc.)
- **25 GB** storage
- **25 GB** bandwidth

More than enough for normal usage!

## ❗ Important Notes

1. **Never** commit `.env` file to Git
2. **Never** share your API Secret
3. Use different Cloudinary account for production
4. Keep backups of important photos elsewhere

## 🔧 Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && ng serve`
3. Create new location
4. Test from photo upload section

## 📞 Troubleshooting

### Photos Not Uploading
- Check Cloudinary information
- Make sure `.env` file is in backend directory
- Check error messages in console

### "Upload Failed" Error
- Check file size (max 5MB)
- Check file format (only image files)
- Check your internet connection

### API Key Error
- Double-check information from dashboard
- Make sure API Secret is correct
- Restart server

---

✅ **Once setup is complete, your users will be able to add photos to their locations!**