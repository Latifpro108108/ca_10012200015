# 👨‍💼 GoMart Admin Guide

## Overview
This guide explains how to use the admin account to manage products and system settings in GoMart.

---

## 🔐 Admin Credentials

**Email:** `admin@gmail.com`  
**Password:** `12345`

⚠️ **IMPORTANT**: Change this password after first login in production!

---

## 🎯 Admin Features

### 1. **Full Product Management**
- ✅ Edit ANY product (all vendors' products)
- ✅ View all product details
- ✅ Update prices, stock, descriptions
- ✅ Change product images
- ✅ Activate/deactivate products

### 2. **System Overview**
- ✅ View all categories
- ✅ View all vendors
- ✅ View all customers
- ✅ View all reviews

---

## 📝 How to Login as Admin

1. **Go to Login Page**  
   Navigate to: `http://localhost:3000/ui/customers/login`

2. **Enter Admin Credentials**
   - Email: `admin@gmail.com`
   - Password: `12345`

3. **Click Sign In**  
   You will be logged in with admin privileges

4. **Verify Admin Access**  
   - Check that you can edit any product
   - Your account should show "Admin User" as the name

---

## 🛠️ How to Edit Products

### Method 1: Direct URL
1. Find a product ID from the product list
2. Navigate to: `http://localhost:3000/ui/products/edit/[productId]`
3. Make your changes
4. Click "Update Product"

### Method 2: From Product List
1. Go to: `http://localhost:3000/ui/products/list`
2. Click on a product to view details
3. Manually navigate to edit URL (edit button coming soon)
4. Make your changes
5. Click "Update Product"

---

## 📦 What You Can Edit

### Product Information:
- **Product Name** - Update the title
- **Description** - Full product description
- **Price** - In Ghana Cedis (GH₵)
- **Stock Quantity** - Available units
- **Weight** - In kilograms (for shipping)
- **SKU** - Stock Keeping Unit code
- **Brand** - Product brand name

### Product Media:
- **Main Image** - Primary product image (URL)
- **Gallery Images** - Multiple product images
- **Video URL** - Product demo video (optional)

### Product Details:
- **Category** - Product category
- **Vendor** - Which vendor owns the product
- **Highlights** - Key features (bullet points)
- **Specifications** - Technical details
- **Delivery Info** - Shipping information
- **Return Policy** - Return/refund policy
- **Active Status** - Show/hide product

---

## 🇬🇭 Pre-loaded Products

Your database now contains **15 authentic Ghanaian products**:

| Category | Products |
|----------|----------|
| **Fashion** | Kente Cloth, Ankara Fabric, Kaba and Slit |
| **Food** | Waakye Leaves, Ga Kenkey, Groundnut Paste, Palm Nut Soup, Dawadawa, Kokonte |
| **Beauty** | Shea Butter, African Black Soap |
| **Home** | Grass Sleeping Mat |
| **Arts & Crafts** | Adinkra Wall Art, Calabash Bowls, Talking Drum |

---

## 📸 Uploading Your Own Images

### Option 1: Using External Image Hosts (Recommended)

**ImgBB (Easiest)**
1. Go to https://imgbb.com
2. Upload your image
3. Copy the "Direct Link"
4. Paste into Product Image URL field

**Cloudinary**
1. Sign up at https://cloudinary.com (free tier)
2. Upload image
3. Copy image URL
4. Paste into product form

**Imgur**
1. Go to https://imgur.com
2. Upload image
3. Right-click → Copy image address
4. Paste into product form

### Option 2: Base64 Upload
1. Click "Choose file" button in product edit page
2. Select image from your computer
3. Image will be converted to Base64
4. Click "Update Product"

⚠️ **Note**: Base64 images make database larger. Use external URLs for production.

See `IMAGE_GUIDE.md` for detailed image upload instructions.

---

## 🚫 Permission System

### Admin Users (`isAdmin: true`)
- ✅ Can edit ANY product
- ✅ Can view all system data
- ✅ Full system access

### Regular Users (`isAdmin: false`)
- ❌ Cannot edit products
- ✅ Can view products
- ✅ Can add reviews
- ✅ Can add to cart
- ✅ Can message vendors

### Vendors
- Currently use same authentication as customers
- Future: Separate vendor authentication
- Can update their own vendor profile

---

## 🔧 Admin Tasks Checklist

### Initial Setup:
- [ ] Login with admin credentials
- [ ] Browse existing products
- [ ] Test editing a product
- [ ] Upload your own product images
- [ ] Update product descriptions

### Regular Maintenance:
- [ ] Update product prices
- [ ] Manage stock quantities
- [ ] Review customer feedback
- [ ] Activate/deactivate products
- [ ] Update product images

### Before Production:
- [ ] Change admin password
- [ ] Update all product images with real photos
- [ ] Verify all product information
- [ ] Test all product links
- [ ] Review product categories

---

## 📊 Database Access

### Prisma Studio (Database GUI)
```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all database tables
- Edit records directly
- Add new products manually
- Delete records
- View relationships

---

## 🐛 Troubleshooting

### "Only admin users can edit products"
**Solution**: Make sure you're logged in with `admin@gmail.com`

### "Please login to edit products"
**Solution**: You're not logged in. Go to login page first.

### Changes Not Saving
**Solution**: Check browser console for errors. Ensure all required fields are filled.

### Images Not Displaying
**Solution**: 
- Verify image URL is valid
- Test URL in browser directly
- Use https:// URLs
- Check image host allows hotlinking

### Product Not Showing on List
**Solution**:
- Check "isActive" is set to `true`
- Verify product was created successfully
- Check browser console for errors
- Refresh the products list page

---

## 💡 Tips for Managing Products

### Best Practices:
1. **Use descriptive product names**
   - Good: "Authentic Kente Cloth - Asante Pattern"
   - Bad: "Product 1"

2. **Add detailed descriptions**
   - Include materials, size, weight
   - Mention Ghanaian authenticity
   - Add care instructions

3. **Set realistic prices**
   - Research market prices
   - Consider shipping costs
   - Use Ghana Cedis (GH₵)

4. **Maintain accurate stock**
   - Update quantities regularly
   - Set to 0 when out of stock
   - Or set isActive to false

5. **Use high-quality images**
   - Minimum 800x800px
   - Clear, well-lit photos
   - Show product details
   - Use multiple angles

---

## 🚀 Next Steps

### Recommended Admin Actions:

1. **Update Product Images**
   - Replace placeholder images with real photos
   - Use your actual product images
   - Ensure consistent image quality

2. **Customize Product Descriptions**
   - Add your unique descriptions
   - Include Ghanaian cultural context
   - Highlight authentic features

3. **Set Real Prices**
   - Update with market-appropriate prices
   - Consider your target customers
   - Account for costs and margins

4. **Review Product Information**
   - Verify all details are correct
   - Update weights for shipping
   - Add specifications where needed

5. **Test Everything**
   - Edit a product
   - View product details
   - Check reviews display
   - Test cart functionality

---

## 📞 Common Admin Questions

**Q: Can I create new categories?**  
A: Yes! Navigate to `/ui/categories/new` or use Prisma Studio

**Q: Can I add new vendors?**  
A: Yes! Navigate to `/ui/vendors/new` or use Prisma Studio

**Q: How do I delete a product?**  
A: Set `isActive` to `false` (soft delete) or use Prisma Studio to hard delete

**Q: Can regular users become admins?**  
A: Yes, set `isAdmin: true` in the database using Prisma Studio

**Q: How do I change the admin password?**  
A: Use Prisma Studio to update the password (remember to hash it with bcrypt)

**Q: Can there be multiple admins?**  
A: Yes! Just set `isAdmin: true` for any customer account

---

## 🔒 Security Notes

### Production Deployment:
1. **Change Admin Password**
   - Use strong password (not "12345")
   - Store securely
   - Update in database with bcrypt hash

2. **Environment Variables**
   - Keep `.env` file secure
   - Never commit to Git
   - Use different passwords per environment

3. **Database Access**
   - Restrict MongoDB access
   - Use strong database passwords
   - Enable MongoDB authentication

4. **API Security**
   - Add rate limiting
   - Implement proper JWT authentication
   - Validate all inputs

---

## 📚 Related Documentation

- `LATEST_UPDATES.md` - Recent features and changes
- `IMAGE_GUIDE.md` - Detailed image upload guide
- `PROJECT_DOCUMENTATION.md` - Full project overview
- `DATABASE_SCHEMA.md` - Database structure

---

**Admin Account Created**: November 12, 2025  
**Last Updated**: November 12, 2025  
**Status**: ✅ Ready to Use  

🇬🇭 **Happy Managing!** 🇬🇭

