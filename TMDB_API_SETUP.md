# 🎬 TMDB API Setup Guide

## Step 1: Get Your TMDB API Key

### Create a TMDB Account
1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Click **"Join TMDB"** in the top right corner
3. Fill out the registration form and verify your email

### Request an API Key
1. Once logged in, go to your [Account Settings](https://www.themoviedb.org/settings/account)
2. Click on **"API"** in the left sidebar
3. Click **"Request an API Key"**
4. Choose **"Developer"** (for non-commercial use)
5. Accept the terms of use
6. Fill out the application form:
   - **Application Name:** React Native Movie App
   - **Application URL:** http://localhost (or your project URL)
   - **Application Summary:** A React Native mobile app for browsing movies and TV shows
7. Submit the form
8. You'll receive your API Key immediately!

## Step 2: Configure Your Project

### Add API Key to Environment File
1. Open the `.env` file in the root of your project
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   EXPO_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   ```

### Example:
```env
# Before
EXPO_PUBLIC_TMDB_API_KEY=YOUR_API_KEY_HERE

# After (with your real API key)
EXPO_PUBLIC_TMDB_API_KEY=abc123def456ghi789
```

## Step 3: Restart Your Development Server

**IMPORTANT:** You must restart Expo after adding the API key!

1. Stop the current Expo server (Ctrl+C in terminal)
2. Clear the cache and restart:
   ```bash
   npx expo start --clear
   ```

## Step 4: Test the API

Once the server restarts:
1. Open the app in your emulator/simulator or Expo Go
2. Navigate to the **Movies** or **TV Series** tab
3. You should see real data loading from TMDB!

## Troubleshooting

### ❌ Still getting 401 errors?
- Make sure the `.env` file is in the root directory
- Verify your API key is correct (no extra spaces)
- Restart Expo with `npx expo start --clear`
- Check the Expo terminal for any warnings

### ❌ Can't find the .env file?
```bash
# Create it manually in the project root:
cp .env.example .env
# Then edit .env and add your API key
```

### ❌ API key not working?
- Verify the key at: https://www.themoviedb.org/settings/api
- Make sure you're using the **API Key (v3 auth)**, not the **Read Access Token**
- Try generating a new API key

### 🔍 Check if API key is loaded:
Add this temporary code to see if the key is loaded:
```typescript
console.log('API Key:', process.env.EXPO_PUBLIC_TMDB_API_KEY);
```

## Additional Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [TMDB API Support](https://www.themoviedb.org/talk/category/5047958519c29526b50017d6)

## Security Note

⚠️ **Never commit your `.env` file to version control!**

The `.env` file is already in `.gitignore`, but always verify before pushing code.
