const sharp = require('sharp');
const fs = require('fs');

// Create a professional PupPulse dog health app icon
async function createDogAppIcon() {
  const width = 1024;
  const height = 1024;
  
  const icon = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    // Background gradient - medical green
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" rx="220" fill="url(#bg)"/>
        </svg>
      `),
      top: 0,
      left: 0
    },
    // Main dog paw icon with health elements
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g transform="translate(${width/2}, ${height/2})">
            <!-- Main paw pad -->
            <ellipse cx="0" cy="30" rx="140" ry="100" fill="#FFFFFF" opacity="0.95"/>
            <!-- Toe pads -->
            <ellipse cx="-90" cy="-50" rx="40" ry="30" fill="#FFFFFF" opacity="0.95"/>
            <ellipse cx="-30" cy="-65" rx="40" ry="30" fill="#FFFFFF" opacity="0.95"/>
            <ellipse cx="30" cy="-65" rx="40" ry="30" fill="#FFFFFF" opacity="0.95"/>
            <ellipse cx="90" cy="-50" rx="40" ry="30" fill="#FFFFFF" opacity="0.95"/>
            
            <!-- Heart symbol for health -->
            <path d="M-70,-20 C-70,-35 -55,-50 -40,-50 C-25,-50 -10,-35 -10,-20 C-10,-35 5,-50 20,-50 C35,-50 50,-35 50,-20 C50,-5 20,25 20,45 C20,25 -10,-5 -10,-20 Z" fill="#FF6B6B" opacity="0.9"/>
            
            <!-- Medical cross in heart -->
            <g transform="translate(0, -20)">
              <rect x="-8" y="-20" width="16" height="40" fill="#FFFFFF" opacity="0.9"/>
              <rect x="-20" y="-8" width="40" height="16" fill="#FFFFFF" opacity="0.9"/>
            </g>
            
            <!-- AI sparkle for technology -->
            <g transform="translate(80, -80)">
              <path d="M0,-20 L6,-6 L20,0 L6,6 L0,20 L-6,6 L-20,0 L-6,-6 Z" fill="#FFD700" opacity="0.9"/>
              <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
            </g>
            
            <!-- Pulse lines for health monitoring -->
            <g transform="translate(-120, 80)">
              <path d="M0,0 Q25,-15 50,0 Q75,15 100,0 Q125,-15 150,0" stroke="#FFFFFF" stroke-width="10" fill="none" opacity="0.8"/>
              <path d="M15,8 Q40,-7 65,8 Q90,23 115,8 Q140,-7 165,8" stroke="#FFFFFF" stroke-width="6" fill="none" opacity="0.6"/>
            </g>
            
            <!-- Small dog silhouette in corner -->
            <g transform="translate(-150, 120)">
              <ellipse cx="0" cy="0" rx="25" ry="15" fill="#FFFFFF" opacity="0.7"/>
              <ellipse cx="-15" cy="-10" rx="8" ry="6" fill="#FFFFFF" opacity="0.7"/>
              <ellipse cx="15" cy="-10" rx="8" ry="6" fill="#FFFFFF" opacity="0.7"/>
              <ellipse cx="0" cy="-20" rx="12" ry="8" fill="#FFFFFF" opacity="0.7"/>
            </g>
          </g>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile('./assets/icon.png');
  
  console.log('✅ Dog health app icon created successfully!');
  return icon;
}

// Create adaptive icon for Android
async function createDogAdaptiveIcon() {
  const width = 1024;
  const height = 1024;
  
  const adaptiveIcon = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    // Background
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <rect width="${width}" height="${height}" rx="200" fill="#4CAF50"/>
        </svg>
      `),
      top: 0,
      left: 0
    },
    // Foreground dog paw with health elements
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g transform="translate(${width/2}, ${height/2})">
            <!-- Paw pad -->
            <ellipse cx="0" cy="20" rx="120" ry="85" fill="#FFFFFF"/>
            <!-- Toe pads -->
            <ellipse cx="-80" cy="-40" rx="35" ry="25" fill="#FFFFFF"/>
            <ellipse cx="-20" cy="-55" rx="35" ry="25" fill="#FFFFFF"/>
            <ellipse cx="40" cy="-55" rx="35" ry="25" fill="#FFFFFF"/>
            <ellipse cx="100" cy="-40" rx="35" ry="25" fill="#FFFFFF"/>
            <!-- Heart with medical cross -->
            <path d="M-60,-15 C-60,-30 -45,-45 -30,-45 C-15,-45 0,-30 0,-15 C0,-30 15,-45 30,-45 C45,-45 60,-30 60,-15 C60,0 30,30 30,50 C30,30 0,0 0,-15 Z" fill="#FF6B6B"/>
            <g transform="translate(0, -15)">
              <rect x="-6" y="-15" width="12" height="30" fill="#FFFFFF"/>
              <rect x="-15" y="-6" width="30" height="12" fill="#FFFFFF"/>
            </g>
            <!-- AI sparkle -->
            <g transform="translate(70, -70)">
              <path d="M0,-15 L4,-4 L15,0 L4,4 L0,15 L-4,4 L-15,0 L-4,-4 Z" fill="#FFD700"/>
              <circle cx="0" cy="0" r="3" fill="#FFFFFF"/>
            </g>
          </g>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile('./assets/adaptive-icon.png');
  
  console.log('✅ Dog adaptive icon created successfully!');
  return adaptiveIcon;
}

// Create splash screen
async function createDogSplashScreen() {
  const width = 1242;
  const height = 2688;
  
  const splash = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    // Background gradient
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#bg)"/>
        </svg>
      `),
      top: 0,
      left: 0
    },
    // Large dog paw icon in center
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g transform="translate(${width/2}, ${height/2 - 100})">
            <!-- Large paw icon -->
            <ellipse cx="0" cy="40" rx="250" ry="180" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="-180" cy="-100" rx="70" ry="50" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="-60" cy="-120" rx="70" ry="50" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="80" cy="-120" rx="70" ry="50" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="200" cy="-100" rx="70" ry="50" fill="#FFFFFF" opacity="0.9"/>
            <!-- Heart with medical cross -->
            <path d="M-120,-40 C-120,-70 -90,-100 -60,-100 C-30,-100 0,-70 0,-40 C0,-70 30,-100 60,-100 C90,-100 120,-70 120,-40 C120,-10 60,50 60,90 C60,50 0,-10 0,-40 Z" fill="#FF6B6B" opacity="0.8"/>
            <g transform="translate(0, -40)">
              <rect x="-15" y="-40" width="30" height="80" fill="#FFFFFF" opacity="0.9"/>
              <rect x="-40" y="-15" width="80" height="30" fill="#FFFFFF" opacity="0.9"/>
            </g>
            <!-- AI sparkle -->
            <g transform="translate(150, -150)">
              <path d="M0,-35 L10,-10 L35,0 L10,10 L0,35 L-10,10 L-35,0 L-10,-10 Z" fill="#FFD700" opacity="0.9"/>
              <circle cx="0" cy="0" r="8" fill="#FFFFFF"/>
            </g>
          </g>
        </svg>
      `),
      top: 0,
      left: 0
    },
    // App name and tagline
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <text x="${width/2}" y="${height/2 + 250}" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="#FFFFFF">PupPulse</text>
          <text x="${width/2}" y="${height/2 + 320}" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="#E8F5E8">AI Dog Health Companion</text>
          <text x="${width/2}" y="${height/2 + 380}" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="rgba(255, 255, 255, 0.8)">Monitor • Track • Care</text>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile('./assets/splash.png');
  
  console.log('✅ Dog health splash screen created successfully!');
  return splash;
}

// Create favicon
async function createDogFavicon() {
  const favicon = await sharp({
    create: {
      width: 32,
      height: 32,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    {
      input: Buffer.from(`
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="6" fill="#4CAF50"/>
          <g transform="translate(16, 16)">
            <ellipse cx="0" cy="3" rx="5" ry="3" fill="#FFFFFF"/>
            <ellipse cx="-3" cy="-1" rx="1.5" ry="1" fill="#FFFFFF"/>
            <ellipse cx="0" cy="-2" rx="1.5" ry="1" fill="#FFFFFF"/>
            <ellipse cx="3" cy="-2" rx="1.5" ry="1" fill="#FFFFFF"/>
            <ellipse cx="6" cy="-1" rx="1.5" ry="1" fill="#FFFFFF"/>
            <path d="M-2,-1 C-2,-2 -1,-3 0,-3 C1,-3 2,-2 2,-1 C2,0 0,2 0,3 C0,2 -2,0 -2,-1 Z" fill="#FF6B6B"/>
            <rect x="-0.5" y="-2" width="1" height="4" fill="#FFFFFF"/>
            <rect x="-2" y="-0.5" width="4" height="1" fill="#FFFFFF"/>
          </g>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile('./assets/favicon.png');
  
  console.log('✅ Dog health favicon created successfully!');
  return favicon;
}

// Run all icon creation functions
async function createAllDogIcons() {
  try {
    console.log('🐕 Creating PupPulse dog health app icons...');
    
    // Ensure assets directory exists
    if (!fs.existsSync('./assets')) {
      fs.mkdirSync('./assets');
    }
    
    await createDogAppIcon();
    await createDogAdaptiveIcon();
    await createDogSplashScreen();
    await createDogFavicon();
    
    console.log('🎉 All dog health icons created successfully!');
    console.log('📱 Ready for Apple Store Connect submission!');
    console.log('🐕 Perfect for a dog health app - no confusion with other apps!');
  } catch (error) {
    console.error('❌ Error creating dog icons:', error);
  }
}

createAllDogIcons();

