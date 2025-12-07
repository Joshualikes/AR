# AR Camera Integration Guide for GreenGrow AR

## Overview
GreenGrow AR now includes full AR camera integration with plane detection and 3D plant placement capabilities using Capacitor with ARCore (Android) and ARKit (iOS).

## Current Implementation

### ✅ What's Already Built
- **Camera Access**: Using `@capacitor/camera` for device camera
- **AR Session Management**: Infrastructure for AR initialization
- **Plane Detection**: Framework for detecting flat surfaces
- **3D Placement**: Logic for placing plants in AR space
- **Touch Controls**: Tap-to-place interaction
- **Visual Feedback**: AR indicators and placement confirmation
- **3D Plant Models**: Realistic 3D plants using Three.js/React Three Fiber
- **Touch Gestures**: Rotate, scale, and reposition plants with gestures
- **Photo Capture**: Take and save AR photos with camera feed background

### 📱 Supported Platforms
- **iOS**: Requires iOS 11+ with ARKit support
- **Android**: Requires Android 7.0+ with ARCore support

## Setup Instructions

### 1. Build and Sync Native Projects

```bash
# Export project to GitHub
# Git pull to local machine
git pull

# Install dependencies
npm install

# Build the web app
npm run build

# Sync Capacitor platforms
npx cap sync
```

### 2. Android Setup (ARCore)

#### Add ARCore Dependency
Edit `android/app/build.gradle`:

```gradle
dependencies {
    // ... existing dependencies
    implementation 'com.google.ar:core:1.40.0'
    implementation 'com.google.ar.sceneform.ux:sceneform-ux:1.17.1'
}
```

#### Update AndroidManifest.xml
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- Camera Permission -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- Storage Permissions for Photo Capture -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    
    <!-- ARCore Features -->
    <uses-feature android:name="android.hardware.camera.ar" android:required="true" />
    
    <application>
        <!-- ARCore Metadata -->
        <meta-data
            android:name="com.google.ar.core"
            android:value="required" />
    </application>
</manifest>
```

#### Install ARCore on Test Device
Users need Google Play Services for AR:
```bash
# Check if ARCore is supported
adb shell pm list packages | grep arcore
```

### 3. iOS Setup (ARKit)

#### Update Info.plist
Add to `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to place plants in augmented reality</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need access to save AR plant photos to your photo library</string>

<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>arkit</string>
</array>
```

#### Enable ARKit in Xcode
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select your target
3. Go to "Signing & Capabilities"
4. Click "+" and add "ARKit"

#### Add ARKit Framework
The ARKit framework is already included in iOS 11+, but ensure your deployment target is set to iOS 11.0 or higher.

### 4. Camera Permissions

Permissions are automatically requested when AR camera opens. Users will see:
- **iOS**: "GreenGrow AR would like to access the camera"
- **Android**: "Allow GreenGrow AR to take pictures and record video?"

## Testing AR Features

### On Physical Devices

#### iOS (with Xcode):
```bash
# Connect iPhone
npx cap open ios
# Build and run in Xcode (⌘ + R)
```

#### Android (with Android Studio):
```bash
# Connect Android device
npx cap open android
# Run in Android Studio
```

### AR Testing Checklist
1. ✅ Camera permission granted
2. ✅ Camera stream appears
3. ✅ Tap on flat surface
4. ✅ 3D plant model appears at tap location
5. ✅ Gesture controls work (rotate, scale, move)
6. ✅ Can reposition plant
7. ✅ Photo capture button appears
8. ✅ Can capture AR photo
9. ✅ Can save photo to device
10. ✅ Can share photo
11. ✅ Confirm placement works
12. ✅ Plant appears in main view after confirmation

## Advanced AR Features (Future Enhancements)

### For Production ARCore/ARKit Integration

Consider adding native AR plugins:

#### Option 1: Custom Capacitor Plugin
Create a custom plugin that bridges native ARCore/ARKit:
```
npx @capacitor/cli plugin:generate
```

#### Option 2: Community Plugins
- **AR Foundation**: Unity-based AR (requires Unity integration)
- **8th Wall**: Web-based AR (subscription required)
- **Wikitude**: Commercial AR SDK

#### Native Features to Add:
- **Real Plane Detection**: Detect actual floors/tables
- **Light Estimation**: Match virtual plants to real lighting
- **Shadows**: Cast realistic shadows
- **Occlusion**: Hide plants behind real objects
- **Multiple Plants**: Place several plants in one scene
- **Persistent Anchors**: Save AR placements between sessions

## Troubleshooting

### Camera Not Working
1. Check permissions in device settings
2. Verify `capacitor.config.ts` has correct URL
3. Run `npx cap sync` after changes
4. Clear app cache and reinstall

### AR Not Initializing
1. Ensure device supports ARCore/ARKit
2. Check iOS version (iOS 11+) or Android version (7.0+)
3. Verify Google Play Services for AR installed (Android)
4. Check console logs for errors

### Plane Detection Issues
1. Ensure good lighting conditions
2. Point camera at textured flat surfaces
3. Move device slowly to help scanning
4. Avoid reflective or transparent surfaces

### Build Errors
```bash
# Clean and rebuild
npm run build
npx cap sync
npx cap copy
```

## Performance Tips

1. **Optimize 3D Models**: Use lightweight models for plants
2. **Limit Active Objects**: Cap simultaneous AR objects to 5-10
3. **Reduce Texture Size**: Compress plant textures
4. **Test on Target Devices**: Always test on actual hardware

## Next Steps

### Immediate (Working Now):
- ✅ Camera access via browser
- ✅ Tap-to-place interaction
- ✅ 3D plant models with realistic shapes
- ✅ Touch gestures (rotate, scale, reposition)
- ✅ Photo capture with AR plants
- ✅ Save and share AR photos
- ✅ Visual plant preview
- ✅ Placement confirmation

### Short Term (Requires Native Plugins):
- 🔄 Real plane detection
- 🔄 Accurate depth sensing
- 🔄 Improved 3D positioning
- 🔄 Light estimation

### Long Term (Production Features):
- 🎯 Persistent AR anchors
- 🎯 Multi-plant scenes
- 🎯 Plant growth animations in AR
- 🎯 Advanced photo editing
- 🎯 AR video recording

## Resources

- [ARCore Documentation](https://developers.google.com/ar)
- [ARKit Documentation](https://developer.apple.com/augmented-reality/)
- [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- [Capacitor Native Plugins](https://capacitorjs.com/docs/plugins)

## Support

For AR-specific issues, check:
1. Device AR capabilities
2. Camera permissions
3. Native AR framework logs
4. Capacitor bridge console output
