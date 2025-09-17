const sharp = require('sharp');
const fs = require('fs');

// Create a professional PupPulse app icon
async function createAppIcon() {
  const width = 1024;
  const height = 1024;
  
  // Create the base icon with gradient background
  const icon = await sharp({
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
          <rect width="${width}" height="${height}" rx="220" fill="url(#bg)"/>
        </svg>
      `),
      top: 0,
      left: 0
    },
    // Main dog paw icon
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g transform="translate(${width/2}, ${height/2})">
            <!-- Paw pad -->
            <ellipse cx="0" cy="20" rx="120" ry="80" fill="#FFFFFF" opacity="0.9"/>
            <!-- Toe pads -->
            <ellipse cx="-80" cy="-40" rx="35" ry="25" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="-20" cy="-50" rx="35" ry="25" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="40" cy="-50" rx="35" ry="25" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="100" cy="-40" rx="35" ry="25" fill="#FFFFFF" opacity="0.9"/>
            <!-- Heart symbol for health -->
            <path d="M-60,-20 C-60,-30 -50,-40 -40,-40 C-30,-40 -20,-30 -20,-20 C-20,-30 -10,-40 0,-40 C10,-40 20,-30 20,-20 C20,-10 0,10 0,20 C0,10 -20,-10 -20,-20 Z" fill="#FF6B6B" opacity="0.8"/>
            <!-- AI sparkle -->
            <g transform="translate(60, -60)">
              <path d="M0,-15 L4,-4 L15,0 L4,4 L0,15 L-4,4 L-15,0 L-4,-4 Z" fill="#FFD700" opacity="0.9"/>
              <circle cx="0" cy="0" r="3" fill="#FFFFFF"/>
            </g>
            <!-- Pulse lines -->
            <g transform="translate(-100, 60)">
              <path d="M0,0 Q20,-10 40,0 Q60,10 80,0" stroke="#FFFFFF" stroke-width="8" fill="none" opacity="0.7"/>
              <path d="M10,5 Q30,-5 50,5 Q70,15 90,5" stroke="#FFFFFF" stroke-width="6" fill="none" opacity="0.5"/>
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
  
  console.log('✅ App icon created successfully!');
  return icon;
}

// Create adaptive icon for Android
async function createAdaptiveIcon() {
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
    // Foreground icon (smaller for adaptive)
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g transform="translate(${width/2}, ${height/2})">
            <!-- Paw pad -->
            <ellipse cx="0" cy="15" rx="100" ry="70" fill="#FFFFFF"/>
            <!-- Toe pads -->
            <ellipse cx="-70" cy="-35" rx="30" ry="20" fill="#FFFFFF"/>
            <ellipse cx="-15" cy="-45" rx="30" ry="20" fill="#FFFFFF"/>
            <ellipse cx="35" cy="-45" rx="30" ry="20" fill="#FFFFFF"/>
            <ellipse cx="85" cy="-35" rx="30" ry="20" fill="#FFFFFF"/>
            <!-- Heart -->
            <path d="M-50,-15 C-50,-25 -40,-35 -30,-35 C-20,-35 -10,-25 -10,-15 C-10,-25 0,-35 10,-35 C20,-35 30,-25 30,-15 C30,-5 10,15 10,25 C10,15 -10,-5 -10,-15 Z" fill="#FF6B6B"/>
            <!-- AI sparkle -->
            <g transform="translate(50, -50)">
              <path d="M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3 Z" fill="#FFD700"/>
              <circle cx="0" cy="0" r="2" fill="#FFFFFF"/>
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
  
  console.log('✅ Adaptive icon created successfully!');
  return adaptiveIcon;
}

// Create splash screen
async function createSplashScreen() {
  const width = 1242;
  const height = 2688; // iPhone 12 Pro Max dimensions
  
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
    // Large app icon in center
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <g transform="translate(${width/2}, ${height/2 - 100})">
            <!-- Large paw icon -->
            <ellipse cx="0" cy="30" rx="200" ry="140" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="-140" cy="-70" rx="60" ry="40" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="-30" cy="-85" rx="60" ry="40" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="80" cy="-85" rx="60" ry="40" fill="#FFFFFF" opacity="0.9"/>
            <ellipse cx="170" cy="-70" rx="60" ry="40" fill="#FFFFFF" opacity="0.9"/>
            <!-- Heart -->
            <path d="M-100,-30 C-100,-50 -80,-70 -60,-70 C-40,-70 -20,-50 -20,-30 C-20,-50 0,-70 20,-70 C40,-70 60,-50 60,-30 C60,-10 20,30 20,50 C20,30 -20,-10 -20,-30 Z" fill="#FF6B6B" opacity="0.8"/>
            <!-- AI sparkle -->
            <g transform="translate(100, -100)">
              <path d="M0,-25 L8,-8 L25,0 L8,8 L0,25 L-8,8 L-25,0 L-8,-8 Z" fill="#FFD700" opacity="0.9"/>
              <circle cx="0" cy="0" r="6" fill="#FFFFFF"/>
            </g>
          </g>
        </svg>
      `),
      top: 0,
      left: 0
    },
    // App name
    {
      input: Buffer.from(`
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <text x="${width/2}" y="${height/2 + 200}" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#FFFFFF">PupPulse</text>
          <text x="${width/2}" y="${height/2 + 260}" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#E8F5E8">AI Dog Health Companion</text>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile('./assets/splash.png');
  
  console.log('✅ Splash screen created successfully!');
  return splash;
}

// Create favicon
async function createFavicon() {
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
            <ellipse cx="0" cy="2" rx="4" ry="2.5" fill="#FFFFFF"/>
            <ellipse cx="-2" cy="-1" rx="1" ry="0.8" fill="#FFFFFF"/>
            <ellipse cx="0" cy="-1.5" rx="1" ry="0.8" fill="#FFFFFF"/>
            <ellipse cx="2" cy="-1.5" rx="1" ry="0.8" fill="#FFFFFF"/>
            <ellipse cx="4" cy="-1" rx="1" ry="0.8" fill="#FFFFFF"/>
            <path d="M-1.5,-0.5 C-1.5,-1 -1,-1.5 -0.5,-1.5 C0,-1.5 0.5,-1 0.5,-0.5 C0.5,-1 1,-1.5 1.5,-1.5 C2,-1.5 2.5,-1 2.5,-0.5 C2.5,0 1.5,1 1.5,2 C1.5,1 -1.5,-1 -1.5,-0.5 Z" fill="#FF6B6B"/>
          </g>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile('./assets/favicon.png');
  
  console.log('✅ Favicon created successfully!');
  return favicon;
}

// Run all icon creation functions
async function createAllIcons() {
  try {
    console.log('🎨 Creating PupPulse app icons...');
    
    // Ensure assets directory exists
    if (!fs.existsSync('./assets')) {
      fs.mkdirSync('./assets');
    }
    
    await createAppIcon();
    await createAdaptiveIcon();
    await createSplashScreen();
    await createFavicon();
    
    console.log('🎉 All icons created successfully!');
    console.log('📱 Ready for Apple Store Connect submission!');
  } catch (error) {
    console.error('❌ Error creating icons:', error);
  }
}

createAllIcons();