# 🖼️ GoMart - Image Optimization Guide

## Overview
This document explains how images are optimized in GoMart to ensure high quality display across all device sizes.

---

## ✅ What's Been Configured

### 1. **Next.js Image Configuration**

#### Allowed Image Hosts:
- ✅ `images.unsplash.com` - For demo/seed data
- ✅ `i.ibb.co` - ImgBB image hosting
- ✅ `res.cloudinary.com` - Cloudinary CDN
- ✅ `i.imgur.com` - Imgur hosting
- ✅ `**.imgur.com` - All Imgur subdomains

#### Advanced Settings:
```javascript
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
formats: ['image/webp']  // Modern, efficient format
minimumCacheTTL: 60      // Cache for 60 seconds
```

---

## 🎨 Image Quality Settings by Component

### Product Detail Page (Main Image)
- **Quality:** 95% (Highest quality for hero image)
- **Priority:** Yes (Loads immediately)
- **Sizes:** Responsive
  - Mobile: 100vw
  - Tablet: 50vw
  - Desktop: 600px

```tsx
<Image 
  src={imageURL}
  alt={productName}
  fill
  quality={95}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
/>
```

### Product Thumbnails
- **Quality:** 90%
- **Sizes:** Fixed 80px
- **Purpose:** Gallery navigation

### Product Cards (List/Grid)
- **Quality:** 90%
- **Sizes:** Responsive
  - Mobile: 100vw
  - Tablet: 50vw
  - Desktop: 33vw (grid of 3)

### Small Icons/Avatars
- **Quality:** 90%
- **Sizes:** Fixed (e.g., 48px, 64px)
- **Purpose:** Vendor logos, small previews

---

## 📐 How Responsive Images Work

### What is `sizes` attribute?

The `sizes` attribute tells the browser what size the image will be at different screen widths. This allows Next.js to serve the perfectly-sized image.

**Example:**
```tsx
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

**Translation:**
- On phones (<640px): Image takes full width (100vw)
- On tablets (<1024px): Image takes half width (50vw)
- On desktop: Image takes one-third width (33vw)

### Why This Matters

✅ **Sharp Images**: Browser gets the right size, no blurry scaling  
✅ **Fast Loading**: Smaller devices get smaller files  
✅ **Bandwidth Savings**: Users don't download huge images on mobile  
✅ **Better Performance**: Optimized for each screen  

---

## 🚀 Image Optimization Benefits

### Automatic Next.js Optimizations:

1. **Format Conversion**
   - Automatically serves WebP format
   - Falls back to original if WebP unsupported
   - WebP is ~30% smaller than JPEG

2. **Lazy Loading**
   - Images load as user scrolls
   - Except `priority` images (above fold)
   - Saves bandwidth and speeds up page

3. **Responsive Sizing**
   - Serves appropriate size for device
   - No oversized images on mobile
   - Retina display support

4. **Caching**
   - Images cached for fast repeat visits
   - CDN-friendly headers
   - Reduced server load

5. **Quality vs Size Balance**
   - Quality 90-95% for sharp images
   - Compressed efficiently
   - Usually 50-70% smaller files

---

## 📊 Quality Settings Explained

### Quality Levels:

| Quality | Use Case | File Size | Visual Quality |
|---------|----------|-----------|----------------|
| **95%** | Hero images, main product photos | Largest | Excellent |
| **90%** | Product cards, thumbnails | Medium | Very Good |
| **85%** | Small icons, backgrounds | Small | Good |
| **75%** | Decorative images | Smallest | Acceptable |

**Our Choices:**
- 95% for main product image (most important)
- 90% for all other product images (great balance)

---

## 🎯 Image Display at Different Sizes

### Product Detail Page:

**Mobile (< 768px):**
- Main image: 340px height, full width
- Thumbnails: 80px × 80px
- Loads ~400KB optimized image

**Tablet (768px - 1200px):**
- Main image: 420px height, 50% width
- Thumbnails: 80px × 80px
- Loads ~600KB optimized image

**Desktop (> 1200px):**
- Main image: 420px height, fixed 600px width
- Thumbnails: 80px × 80px
- Loads ~800KB optimized image

### Product Grid:

**Mobile:** 1 column - full width images  
**Tablet:** 2 columns - half width images  
**Desktop:** 3 columns - third width images  

---

## 💡 Best Practices for Adding Images

### 1. **Use High-Resolution Sources**
- Upload at least 1200px width
- Next.js will optimize down
- Better to start large

### 2. **Supported Formats**
- JPG/JPEG ✅ (photos)
- PNG ✅ (transparency)
- WebP ✅ (modern, efficient)
- GIF ✅ (animations)
- AVIF ✅ (next-gen format)

### 3. **Recommended Dimensions**

**Product Photos:**
- **Ideal:** 1200 × 1200px (square)
- **Minimum:** 800 × 800px
- **Aspect Ratio:** 1:1 preferred

**Product Banners:**
- **Ideal:** 1920 × 600px
- **Aspect Ratio:** 16:5

**Thumbnails:**
- Automatically generated
- No need to prepare

### 4. **File Size Recommendations**

**Before Upload:**
- Product photos: Under 2MB
- Banners: Under 1MB
- Icons: Under 100KB

**After Next.js Optimization:**
- Typically 50-70% smaller
- WebP format applied
- Multiple sizes generated

---

## 🔧 How to Upload High-Quality Images

### Method 1: ImgBB (Free, Easy)

1. Go to https://imgbb.com
2. Upload your **high-resolution** image (1200px+)
3. ImgBB will host original quality
4. Copy "Direct Link"
5. Next.js handles all optimization

### Method 2: Cloudinary (Professional)

1. Create free account at https://cloudinary.com
2. Upload images in highest quality
3. Get direct image URL
4. Next.js optimizes automatically

**Cloudinary Bonus:**
- Built-in transformations
- Automatic format selection
- CDN included
- 25GB free storage

### Method 3: Base64 (Not Recommended for Large Images)

- Stored directly in database
- No optimization possible
- Good for: Small icons (<50KB)
- Bad for: Product photos

---

## 📱 Testing Image Quality

### How to Check:

1. **Open DevTools** (F12)
2. **Network Tab** → Filter by "Img"
3. **Reload page**
4. **Check:**
   - File format (should be WebP)
   - File size (should be optimized)
   - Different sizes for different devices

### Expected Results:

**Mobile Device:**
```
product-image.webp?w=640&q=90
Size: ~150KB
```

**Desktop:**
```
product-image.webp?w=1200&q=90
Size: ~400KB
```

---

## 🐛 Troubleshooting

### Image Looks Blurry

**Causes:**
1. Source image too small (<800px)
2. Quality setting too low
3. Browser scaling artifact

**Solutions:**
- Use larger source images (1200px+)
- Quality set to 90-95%
- Check original image quality

### Image Won't Load

**Causes:**
1. Hostname not in `next.config.js`
2. Invalid image URL
3. CORS issues

**Solutions:**
- Add hostname to `remotePatterns`
- Test URL in browser directly
- Use HTTPS URLs

### Image Loads Slowly

**Causes:**
1. Very large original image (>5MB)
2. Slow image host
3. No caching

**Solutions:**
- Compress before upload
- Use proper image host (Cloudinary, ImgBB)
- Images cached after first load

### "Hostname not configured" Error

**Solution:**
```javascript
// Add to next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-image-host.com',
    },
  ],
}
```

---

## 🚨 Important Notes

### 1. **Restart Required**
After changing `next.config.js`, you **MUST** restart your dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. **Image URLs Must Be Absolute**
```javascript
// ✅ Good
imageURL: "https://i.ibb.co/abc123/image.jpg"

// ❌ Bad
imageURL: "/images/image.jpg"  // Won't be optimized
imageURL: "www.example.com/image.jpg"  // Missing protocol
```

### 3. **Base64 Images**
- Work but bypass optimization
- Stored as data URIs
- No responsive sizing
- Use sparingly

### 4. **Priority Loading**
- Only use on above-the-fold images
- Main product image: Yes
- Gallery thumbnails: No
- Product cards: No

---

## 📈 Performance Metrics

### Expected Loading Times:

**3G Connection:**
- Main product image: <3 seconds
- Product card: <2 seconds
- Thumbnail: <1 second

**4G Connection:**
- Main product image: <1 second
- Product card: <500ms
- Thumbnail: <300ms

**WiFi:**
- Main product image: <500ms
- Product card: <200ms
- Thumbnail: <100ms

### Image Size Comparison:

| Original | Optimized | Savings |
|----------|-----------|---------|
| 2MB JPEG | 400KB WebP | 80% |
| 1MB PNG | 200KB WebP | 80% |
| 500KB JPEG | 150KB WebP | 70% |

---

## 🎓 Technical Details

### How Next.js Image Optimization Works:

1. **Request:** Browser requests image
2. **Analysis:** Next.js checks device/screen size
3. **Optimization:** Generates optimized version
4. **Caching:** Stores for future requests
5. **Serving:** Delivers perfect size

### What Happens Behind the Scenes:

```
Original Image (2MB JPEG 2000×2000)
        ↓
Next.js Optimizer
        ↓
Generated Sizes:
- 640×640 @ 90% = 150KB WebP (Mobile)
- 828×828 @ 90% = 200KB WebP (Tablet)
- 1200×1200 @ 90% = 400KB WebP (Desktop)
- 2048×2048 @ 90% = 800KB WebP (4K Display)
        ↓
Cached & Served to Users
```

---

## 📚 Related Documentation

- **IMAGE_GUIDE.md** - How to upload images
- **ADMIN_GUIDE.md** - Managing product images as admin
- **next.config.js** - Image configuration file

---

## ✅ Summary Checklist

Your images will be sharp and high-quality if:

- [ ] Source images are 1200px+ width
- [ ] Using quality 90-95%
- [ ] `sizes` attribute configured
- [ ] Image hosts in `next.config.js`
- [ ] Dev server restarted after config changes
- [ ] Using HTTPS image URLs
- [ ] Images from reliable hosts (Cloudinary, ImgBB)

---

**Configured**: November 12, 2025  
**Last Updated**: November 12, 2025  
**Status**: ✅ Optimized & Production Ready  

🇬🇭 **Crystal Clear Images for Ghana!** 🇬🇭

