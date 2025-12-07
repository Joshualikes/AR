# Plant Identifier AI Setup Guide

## Overview
The Plant Identifier feature uses AI to accurately identify plants from photos. The app now supports **multiple free APIs** with automatic fallback, so you can use it even without PlantNet account!

## Current Implementation

### ✅ What's Built
- **Camera Interface**: Live camera view with capture functionality
- **AI Scanning Screen**: Animated progress indicators during analysis
- **Result Page**: Detailed plant information with care guides
- **Multiple Modes**: Plant, Mushroom, Weed, and Disease identification modes
- **Multi-API Support**: Automatic fallback between different APIs

## 🆓 Free API Options (No PlantNet Account Needed!)

### Option 1: Plant.id API (RECOMMENDED - Easiest to Get)
**Best for: Quick setup, good accuracy**

- **Free Tier**: 100 requests/month
- **Sign up**: https://web.plant.id/plant-identification-api
- **No credit card required**
- **Easy registration process**

**Setup Steps:**
1. Go to https://web.plant.id/plant-identification-api
2. Click "Sign Up" or "Get Started"
3. Create a free account
4. Get your API key from the dashboard
5. Add to `.env` file:

```env
VITE_PLANTID_API_KEY=your_plantid_api_key_here
VITE_PLANT_API_PROVIDER=plantid
```

### Option 2: PlantNet API (If you can create account)
**Best for: Higher limits, good accuracy**

- **Free Tier**: 500 requests/day
- **Sign up**: https://my.plantnet.org/
- **Note**: Some users report signup issues

**Setup Steps:**
1. Go to https://my.plantnet.org/
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env` file:

```env
VITE_PLANTNET_API_KEY=your_plantnet_api_key_here
VITE_PLANT_API_PROVIDER=plantnet
```

### Option 3: iNaturalist API (No API Key Needed!)
**Best for: Completely free, no registration**

- **Free**: No API key required
- **Documentation**: https://api.inaturalist.org/v1/docs/
- **Note**: Currently uses Plant.id as fallback (needs implementation)

**Setup:**
No setup needed! The app will automatically use this if no other API keys are configured.

## Automatic API Selection

The app automatically selects the best available API in this order:
1. **PlantNet** (if `VITE_PLANTNET_API_KEY` is set)
2. **Plant.id** (if `VITE_PLANTID_API_KEY` is set)
3. **iNaturalist** (always available, no key needed)

You can also manually set the provider:
```env
VITE_PLANT_API_PROVIDER=plantid  # or 'plantnet', 'inaturalist', 'auto'
```

## Quick Start (Using Plant.id - Easiest!)

1. **Get Plant.id API Key:**
   - Visit: https://web.plant.id/plant-identification-api
   - Sign up (free, no credit card)
   - Copy your API key

2. **Create `.env` file** in project root:
```env
VITE_PLANTID_API_KEY=your_api_key_here
VITE_PLANT_API_PROVIDER=plantid
```

3. **Restart your dev server:**
```bash
npm run dev
```

4. **Test it!** Go to Plant Identifier and take a photo.

## Environment Variables

Create a `.env` file in the project root with your chosen API:

```env
# Plant.id API (Recommended - Easiest to get)
VITE_PLANTID_API_KEY=your_plantid_api_key_here

# OR PlantNet API (If you have account)
VITE_PLANTNET_API_KEY=your_plantnet_api_key_here

# Optional: Manually set API provider
# Options: 'plantid', 'plantnet', 'inaturalist', 'auto'
VITE_PLANT_API_PROVIDER=auto
```

## API Comparison

| API | Free Tier | Signup Difficulty | Accuracy | Best For |
|-----|-----------|-------------------|----------|----------|
| **Plant.id** | 100/month | ⭐ Easy | ⭐⭐⭐⭐ | Quick setup |
| **PlantNet** | 500/day | ⭐⭐⭐ Hard | ⭐⭐⭐⭐⭐ | Higher limits |
| **iNaturalist** | Unlimited* | ⭐ No signup | ⭐⭐⭐ | Completely free |

*Note: iNaturalist implementation needs completion

## Troubleshooting

### "Error while signing up" on PlantNet
- **Solution**: Use Plant.id instead (easier signup)
- Plant.id is recommended and works great!

### "API key not configured" error
- Make sure your `.env` file is in the project root
- Restart your dev server after adding API keys
- Check that the variable name matches exactly

### API rate limit exceeded
- Plant.id: 100 requests/month (free tier)
- PlantNet: 500 requests/day (free tier)
- Consider upgrading to paid tier if needed

## Alternative APIs (Paid/Advanced)

### Google Cloud Vision API
- More accurate for general plant identification
- Requires billing account
- API Key: `VITE_GOOGLE_VISION_API_KEY`

### Microsoft Azure Computer Vision
- Good accuracy
- Free tier available (limited)
- API Key: `VITE_AZURE_VISION_KEY`
- Endpoint: `VITE_AZURE_VISION_ENDPOINT`

### Custom ML Model
- Train your own model for specific plants
- Best accuracy for targeted use cases
- Deploy on TensorFlow.js or similar

## Testing

1. Run the app: `npm run dev`
2. Navigate to Home > Plant Identifier
3. Take a photo of a plant
4. Watch the AI scanning process
5. View identification results

## Production Checklist

- [ ] Get PlantNet API key
- [ ] Add API key to environment variables
- [ ] Enable real API calls in `plant-identifier.ts`
- [ ] Test with various plant photos
- [ ] Configure error handling for API failures
- [ ] Set up API rate limiting
- [ ] Add caching for repeated identifications
- [ ] Monitor API usage and costs

## Error Handling

The implementation includes:
- Camera permission errors
- Network errors
- API quota exceeded errors
- Invalid image errors

All errors are shown with user-friendly messages.

## Future Enhancements

- Offline plant identification using TensorFlow.js
- Batch identification (multiple plants)
- Plant health analysis
- Disease detection and recommendations
- Save identified plants to user's garden
- Community verification of identifications

