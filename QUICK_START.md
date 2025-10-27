# 🚀 Quick Start Guide

## Current Status

✅ The app is now configured to work **without** a TMDB API key!
✅ Mock data will be used automatically for development
✅ You can add a real API key later for production data

## Start the App Right Now

### Step 1: Clear Cache and Restart

```bash
npx expo start --clear
```

### Step 2: Open the App

- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Scan QR code with Expo Go app

### Step 3: Test the App

1. Navigate to the **Movies** tab
2. Navigate to the **TV Series** tab
3. You should see mock data displaying!

## What You'll See

### Movies Tab
- 6 sample movies with posters
- HD badges on highly-rated movies
- Three tabs: Latest, Trending, Popular
- Pull to refresh functionality

### TV Series Tab  
- 6 sample TV shows with posters
- Three tabs: Latest, Trending, Popular
- Pull to refresh functionality

## Using Real TMDB Data (Optional)

### When you're ready for real data:

1. **Get API Key**
   - Visit: https://www.themoviedb.org/settings/api
   - Sign up and request an API key (it's free!)

2. **Add to .env file**
   ```env
   EXPO_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   ```

3. **Restart with cache clear**
   ```bash
   npx expo start --clear
   ```

4. **You'll see this in the console:**
   ```
   🌐 Fetching from TMDB: /movie/popular
   ```
   Instead of:
   ```
   🎭 Using mock data for: /movie/popular
   ```

## Troubleshooting

### TypeScript Errors in IDE?
This is a language server cache issue. The code will run fine!

**To fix:**
1. Close and reopen your IDE
2. Or run: `npx expo start --clear`
3. The error will disappear after the first run

### Still not seeing data?
1. Check the Expo terminal for error messages
2. Make sure you cleared the cache
3. Try pressing `r` in the terminal to reload

### Want to verify which mode you're in?
Check the console output when the app loads:
- **Mock mode:** `📝 Using MOCK DATA for development`
- **Real API mode:** `🌐 Fetching from TMDB`

## Next Steps

- ✅ App is working with mock data
- ⏳ Get TMDB API key when ready
- 🎨 Customize the design
- 📱 Test on real devices

Enjoy building your movie app! 🎬
