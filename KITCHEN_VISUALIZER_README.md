# 4K Kitchen Visualizer - Complete Documentation

## Overview

This repository contains a complete Blender-based kitchen rendering system with an interactive 4K HTML viewer that works on all devices and browsers. The system generates ultra-realistic kitchen visualizations with panoramic viewing capabilities.

## Files Included

### Blender Generation System
- `blender_generate_kitchen.py` - Parametric Blender script for kitchen generation
- `render_config.json` - Configuration file for kitchen parameters and render settings
- `ai_prompt.txt` - AI prompts for alternative generation methods

### Interactive Viewer
- `static/kitchen-4k-viewer.html` - Standalone HTML viewer for 4K kitchen visualization
- `src/pages/kitchen-viewer.js` - Gatsby React component for integrated viewing

## Quick Start

### Method 1: Blender Rendering (Recommended)

1. **Install Blender 4.x**
   ```bash
   # Download from https://www.blender.org/
   # Or using package managers:
   
   # Windows (Chocolatey)
   choco install blender
   
   # macOS (Homebrew)
   brew install --cask blender
   
   # Ubuntu/Debian
   sudo apt install blender
   ```

2. **Generate Kitchen**
   ```bash
   # Place both files in the same folder
   # Open terminal in that folder and run:
   blender --background --python blender_generate_kitchen.py
   
   # Results:
   # - render_4k.jpg (3840x2160 pixels)
   # - scene.blend (Blender scene file)
   ```

3. **View Results**
   - Open `static/kitchen-4k-viewer.html` in any browser
   - Or visit the Gatsby page at `/kitchen-viewer`

### Method 2: AI Generation (Alternative)

If you don't have Blender, use the prompts in `ai_prompt.txt` with:
- **Midjourney**: Use provided prompt with `--ar 16:9 --q 2 --stylize 50 --v 6`
- **Stable Diffusion**: Use Automatic1111 with provided settings
- **DALL-E**: Use the ENG prompt directly

## Technical Specifications

### Render Quality
- **Resolution**: 3840 x 2160 (4K UHD)
- **Format**: JPEG, 95% quality
- **Engine**: Blender EEVEE/Cycles (configurable)
- **Samples**: 128-256 (configurable)
- **Features**: Ray tracing, photorealistic materials

### Kitchen Design Features
- Parametric design system
- Matte black handleless cabinets
- Warm oak countertops & backsplash
- Exposed concrete structural column
- LED strip lighting (2700-3000K)
- Sloped oak ceiling
- Minimalist Scandinavian-Japanese fusion style

### Viewer Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile & tablet responsive design
- Touch navigation support
- Fullscreen viewing
- Download functionality
- Share capabilities
- Keyboard shortcuts

## Configuration Options

### Kitchen Parameters (`render_config.json`)

```json
{
  "wall_length_mm": 4200,        // Kitchen wall length in mm
  "column_pos_mm": 3000,         // Structural column position
  "column_size_mm": 300,         // Column dimensions
  "room_depth_mm": 5000,         // Room depth
  "island_size_mm": [2400, 950, 910],  // Island L×W×H
  "cabinet_depth_mm": 600,       // Base cabinet depth
  "upper_cabinet_height_mm": 720, // Upper cabinet height
  "worktop_height_mm": 910,      // Countertop height
  "modules_sequence_mm": [800,600,600,900], // Cabinet widths
  "use_cycles": false,           // Use Cycles instead of EEVEE
  "samples_eevee": 128,          // EEVEE samples
  "samples_cycles": 256,         // Cycles samples
  "resolution_x": 3840,          // Render width
  "resolution_y": 2160           // Render height
}
```

### Render Settings
- **EEVEE**: Fast rendering, good for previews (default)
- **Cycles**: Slower but more realistic rendering
- **GPU Support**: Automatically enabled if available
- **Quality**: Adjustable samples for speed vs quality trade-off

## Interactive Viewer Features

### Navigation
- **Mouse**: Click thumbnails or control buttons
- **Keyboard**: 
  - `←/→` arrows: Previous/Next view
  - `F`: Toggle fullscreen
  - `D`: Download current view
- **Touch**: Swipe left/right on mobile devices

### Viewing Modes
1. **Main View**: Primary kitchen perspective
2. **Island Focus**: Close-up of oak island with column
3. **Cabinet Details**: Handleless cabinet design
4. **Ceiling View**: Sloped oak ceiling with LED lighting
5. **Panoramic**: 360° complete kitchen view

### Device Support
- **Desktop**: Full feature set, optimal experience
- **Tablet**: Touch navigation, responsive layout
- **Mobile**: Optimized interface, swipe gestures
- **All Browsers**: Cross-platform compatibility

## Advanced Usage

### Customizing the Kitchen

1. **Edit Parameters**: Modify `render_config.json`
2. **Re-render**: Run Blender script again
3. **Update Viewer**: Replace images in HTML viewer

### Adding Custom Views

1. Render additional camera angles in Blender
2. Update `kitchenViews` array in HTML viewer
3. Add corresponding thumbnail images

### Integration with Gatsby

The system is integrated into the existing Gatsby site:
- Visit `/kitchen-viewer` for the React component
- Standalone HTML works independently
- Both versions share the same design

## Troubleshooting

### Common Issues

**Blender not found**
```bash
# Make sure Blender is in your PATH
which blender  # Linux/macOS
where blender  # Windows
```

**Render fails**
- Check GPU memory availability
- Try EEVEE instead of Cycles
- Reduce sample count in config

**Viewer not loading**
- Ensure JavaScript is enabled
- Check browser console for errors
- Try different browser

### Performance Optimization

**For faster rendering:**
- Use EEVEE engine
- Reduce samples (64-128)
- Lower resolution for testing

**For better quality:**
- Use Cycles engine
- Increase samples (256-512)
- Enable GPU acceleration

## Development

### Building the Gatsby Site

```bash
npm install
npm run develop    # Development server
npm run build      # Production build
npm run serve      # Serve production build
```

### Modifying the Viewer

The viewer code is in:
- `src/pages/kitchen-viewer.js` (React component)
- `static/kitchen-4k-viewer.html` (Standalone HTML)

Both should be kept in sync for consistent experience.

## File Structure

```
/
├── blender_generate_kitchen.py    # Blender script
├── render_config.json            # Kitchen configuration
├── ai_prompt.txt                 # AI generation prompts
├── static/
│   └── kitchen-4k-viewer.html    # Standalone viewer
├── src/
│   └── pages/
│       └── kitchen-viewer.js     # Gatsby component
└── README.md                     # This documentation
```

## Support

For issues or questions:
1. Check this documentation
2. Review Blender console output
3. Test with different browsers
4. Verify file permissions

The system is designed to work out-of-the-box with minimal setup required.