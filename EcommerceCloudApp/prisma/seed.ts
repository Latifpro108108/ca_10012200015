import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();

  // Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        categoryName: 'Food & Beverages',
        description: 'Local Ghanaian food items, snacks, and beverages',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Fashion & Clothing',
        description: 'Traditional and modern Ghanaian fashion',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Home & Kitchen',
        description: 'Household items and kitchen essentials',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Beauty & Personal Care',
        description: 'Beauty products and personal care items',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Electronics',
        description: 'Electronic devices and accessories',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Arts & Crafts',
        description: 'Handmade Ghanaian crafts and artwork',
      },
    }),
  ]);

  // Create Customers
  console.log('👥 Creating customers...');
  
  // Hash passwords
  const defaultPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('12345', 10);
  
  const customers = await Promise.all([
    // Admin User
    prisma.customer.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gmail.com',
        phoneNumber: '+233200000000',
        password: adminPassword,
        region: 'Greater Accra',
        city: 'Accra',
        address: 'Admin Office',
        isAdmin: true,
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Kwame',
        lastName: 'Mensah',
        email: 'kwame.mensah@email.com',
        phoneNumber: '+233201234567',
        password: defaultPassword,
        region: 'Greater Accra',
        city: 'Accra',
        address: 'East Legon',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Akua',
        lastName: 'Boateng',
        email: 'akua.boateng@email.com',
        phoneNumber: '+233202345678',
        password: defaultPassword,
        region: 'Ashanti',
        city: 'Kumasi',
        address: 'Ahodwo Roundabout',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Kofi',
        lastName: 'Asante',
        email: 'kofi.asante@email.com',
        phoneNumber: '+233203456789',
        password: defaultPassword,
        region: 'Greater Accra',
        city: 'Tema',
        address: 'Community 25',
      },
    }),
  ]);

  // Create Vendors (linked to customers)
  console.log('🏪 Creating vendors...');
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        vendorName: 'Accra Market Hub',
        email: 'info@accramarkethub.com',
        phoneNumber: '+233244567890',
        businessAddress: '15 Osu Oxford Street',
        region: 'Greater Accra',
        city: 'Accra',
        storeDescription: 'Your one-stop shop for authentic Ghanaian products',
        whatsappNumber: '233244567890',
        isVerified: true,
        isActive: true,
        rating: 4.8,
        ownerId: customers[1].id,
      },
    }),
    prisma.vendor.create({
      data: {
        vendorName: 'Kumasi Crafts',
        email: 'sales@kumasicrafts.com',
        phoneNumber: '+233245678901',
        businessAddress: 'Kejetia Market, Kumasi',
        region: 'Ashanti',
        city: 'Kumasi',
        storeDescription: 'Traditional Ghanaian crafts and textiles',
        whatsappNumber: '233245678901',
        isVerified: true,
        isActive: true,
        rating: 4.9,
        ownerId: customers[2].id,
      },
    }),
    prisma.vendor.create({
      data: {
        vendorName: 'Cape Coast Delights',
        email: 'hello@capecoastdelights.com',
        phoneNumber: '+233246789012',
        businessAddress: 'Castle Road, Cape Coast',
        region: 'Central',
        city: 'Cape Coast',
        storeDescription: 'Fresh local produce and food items',
        whatsappNumber: '233246789012',
        isVerified: true,
        isActive: true,
        rating: 4.7,
        ownerId: customers[3].id,
      },
    }),
    prisma.vendor.create({
      data: {
        vendorName: 'Tamale Fashion House',
        email: 'contact@tamalefashion.com',
        phoneNumber: '+233247890123',
        businessAddress: 'Central Market, Tamale',
        region: 'Northern',
        city: 'Tamale',
        storeDescription: 'Modern and traditional Northern fashion',
        whatsappNumber: '233247890123',
        isVerified: true,
        isActive: true,
        rating: 4.6,
        ownerId: customers[0].id, // Admin owns this vendor for demo purposes
      },
    }),
  ]);

  // Create 15 Ghanaian Products
  console.log('🛍️ Creating 15 authentic Ghanaian products...');
  
  const products = await Promise.all([
    // Product 1: Kente Cloth
    prisma.product.create({
      data: {
        productName: 'Authentic Kente Cloth - Asante Pattern',
        description: 'Handwoven traditional Kente cloth from the Ashanti region. Perfect for special occasions, weddings, and cultural events. This authentic piece features the classic Asante pattern with vibrant colors.',
        price: 450.00,
        stockQuantity: 15,
        categoryId: categories[1].id, // Fashion
        vendorId: vendors[1].id, // Kumasi Crafts
        brand: 'Kumasi Weavers',
        weight: 0.8,
        imageURL: 'https://images.unsplash.com/photo-1610652492500-5b4a7e18c60e?w=800',
        highlights: [
          'Handwoven by master craftsmen',
          '100% authentic Ashanti Kente',
          'Vibrant, long-lasting colors',
          'Perfect for ceremonies',
        ],
        deliveryInfo: 'Delivered within 3-5 days across Ghana',
        returnPolicy: '7-day return policy for unused items',
      },
    }),

    // Product 2: Shea Butter
    prisma.product.create({
      data: {
        productName: 'Pure Organic Shea Butter - 500g',
        description: 'Premium quality organic shea butter from Northern Ghana. Unrefined and chemical-free, perfect for skin and hair care. Known for its moisturizing and healing properties.',
        price: 45.00,
        stockQuantity: 50,
        categoryId: categories[3].id, // Beauty
        vendorId: vendors[3].id, // Tamale Fashion House
        brand: 'Northern Gold',
        weight: 0.5,
        imageURL: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
        highlights: [
          '100% pure and organic',
          'No chemicals or additives',
          'Rich in vitamins A & E',
          'Multi-purpose use',
        ],
        deliveryInfo: 'Ships within 2-4 days',
        returnPolicy: 'No returns on opened products',
      },
    }),

    // Product 3: Waakye Leaves
    prisma.product.create({
      data: {
        productName: 'Dried Waakye Leaves - 100g Pack',
        description: 'Premium dried waakye leaves (sorghum leaves) for preparing authentic Ghanaian waakye. Gives the traditional red color and unique flavor to your rice and beans dish.',
        price: 8.50,
        stockQuantity: 100,
        categoryId: categories[0].id, // Food
        vendorId: vendors[2].id, // Cape Coast Delights
        weight: 0.1,
        imageURL: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
        highlights: [
          'Authentic traditional leaves',
          'Natural food coloring',
          'Perfect for waakye preparation',
          'Long shelf life',
        ],
        deliveryInfo: 'Same day delivery in Cape Coast',
        returnPolicy: 'No returns on food items',
      },
    }),

    // Product 4: Ankara Fabric
    prisma.product.create({
      data: {
        productName: 'African Print Ankara Fabric - 6 Yards',
        description: 'Beautiful African print Ankara fabric, 100% cotton. Perfect for making dresses, shirts, skirts, and traditional outfits. Vibrant colors that don\'t fade.',
        price: 85.00,
        stockQuantity: 30,
        categoryId: categories[1].id, // Fashion
        vendorId: vendors[0].id, // Accra Market Hub
        brand: 'Vlisco',
        weight: 1.2,
        imageURL: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
        highlights: [
          '100% pure cotton',
          'Vibrant, fade-resistant colors',
          '6 yards per piece',
          'Multiple patterns available',
        ],
        deliveryInfo: 'Free delivery in Greater Accra',
        returnPolicy: '3-day return for unused fabric',
      },
    }),

    // Product 5: Kenkey (Corn Dough)
    prisma.product.create({
      data: {
        productName: 'Ga Kenkey - 5 Balls Pack',
        description: 'Freshly prepared Ga kenkey (corn dough) wrapped in plantain leaves. Perfect with fried fish, pepper sauce, and shito. Authentic Ghanaian street food favorite.',
        price: 15.00,
        stockQuantity: 60,
        categoryId: categories[0].id, // Food
        vendorId: vendors[0].id, // Accra Market Hub
        weight: 1.5,
        imageURL: 'https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?w=800',
        highlights: [
          'Freshly prepared daily',
          'Traditional Ga recipe',
          'Wrapped in plantain leaves',
          'Ready to eat',
        ],
        deliveryInfo: 'Same day delivery for fresh orders',
        returnPolicy: 'No returns on perishable items',
      },
    }),

    // Product 6: Black Soap (Alata Samina)
    prisma.product.create({
      data: {
        productName: 'African Black Soap (Alata Samina) - 250g',
        description: 'Traditional Ghanaian black soap made from plantain skins, cocoa pods, and palm oil. Natural skin cleanser with antibacterial properties. Ideal for all skin types.',
        price: 20.00,
        stockQuantity: 80,
        categoryId: categories[3].id, // Beauty
        vendorId: vendors[2].id, // Cape Coast Delights
        brand: 'Tropical Naturals',
        weight: 0.25,
        imageURL: 'https://images.unsplash.com/photo-1615397349754-0e0e47f2ecfd?w=800',
        highlights: [
          'All-natural ingredients',
          'Antibacterial properties',
          'Suitable for sensitive skin',
          'Traditional recipe',
        ],
        deliveryInfo: 'Ships nationwide',
        returnPolicy: '14-day return for sealed products',
      },
    }),

    // Product 7: Fante Fante (Traditional Mat)
    prisma.product.create({
      data: {
        productName: 'Hand-woven Grass Sleeping Mat - Large',
        description: 'Traditional Ghanaian sleeping mat handwoven from natural grass. Cool, comfortable, and perfect for the tropical climate. Durable and long-lasting.',
        price: 65.00,
        stockQuantity: 25,
        categoryId: categories[2].id, // Home & Kitchen
        vendorId: vendors[2].id, // Cape Coast Delights
        weight: 2.5,
        imageURL: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
        highlights: [
          'Handwoven natural grass',
          'Cool and breathable',
          'Extra large size',
          'Traditional craftsmanship',
        ],
        deliveryInfo: 'Delivery within 5-7 days',
        returnPolicy: '7-day return policy',
      },
    }),

    // Product 8: Groundnut Paste
    prisma.product.create({
      data: {
        productName: 'Fresh Groundnut Paste (Peanut Butter) - 500g',
        description: 'Locally made groundnut paste from roasted peanuts. No additives, no preservatives. Perfect for groundnut soup, spreads, or cooking. Rich, natural flavor.',
        price: 25.00,
        stockQuantity: 40,
        categoryId: categories[0].id, // Food
        vendorId: vendors[1].id, // Kumasi Crafts
        weight: 0.5,
        imageURL: 'https://images.unsplash.com/photo-1506710832100-3a722a0f36c8?w=800',
        highlights: [
          '100% natural peanuts',
          'No preservatives',
          'Rich in protein',
          'Freshly ground',
        ],
        deliveryInfo: 'Ships within 2 days',
        returnPolicy: 'No returns on opened products',
      },
    }),

    // Product 9: Adinkra Symbol Wall Art
    prisma.product.create({
      data: {
        productName: 'Gye Nyame Adinkra Wall Art - Wooden',
        description: 'Beautiful hand-carved Gye Nyame Adinkra symbol wall decoration. Made from quality wood, perfect for home or office. Represents God\'s supremacy and omnipotence.',
        price: 120.00,
        stockQuantity: 20,
        categoryId: categories[5].id, // Arts & Crafts
        vendorId: vendors[1].id, // Kumasi Crafts
        brand: 'Ashanti Artisans',
        weight: 1.8,
        imageURL: 'https://images.unsplash.com/photo-1582582494215-0e46fe7e5141?w=800',
        highlights: [
          'Hand-carved by artisans',
          'Quality mahogany wood',
          'Cultural significance',
          'Ready to hang',
        ],
        deliveryInfo: 'Careful packaging, 5-7 days delivery',
        returnPolicy: '14-day return if damaged',
      },
    }),

    // Product 10: Palm Nut Soup Base
    prisma.product.create({
      data: {
        productName: 'Palm Nut Soup Concentrate - 1kg',
        description: 'Rich palm nut soup concentrate ready for cooking. Just add meat, fish, and spices. Authentic Ghanaian taste, saves preparation time.',
        price: 35.00,
        stockQuantity: 45,
        categoryId: categories[0].id, // Food
        vendorId: vendors[0].id, // Accra Market Hub
        weight: 1.0,
        imageURL: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        highlights: [
          'Ready-to-cook concentrate',
          'Authentic palm nut flavor',
          'Time-saving preparation',
          'No artificial additives',
        ],
        deliveryInfo: 'Refrigerated delivery available',
        returnPolicy: 'No returns on opened products',
      },
    }),

    // Product 11: Kaba and Slit Outfit
    prisma.product.create({
      data: {
        productName: 'Ready-Made Kaba and Slit - Size 14',
        description: 'Beautiful ready-to-wear Kaba and Slit outfit in authentic African print. Perfect for weddings, church, and special occasions. Professionally tailored.',
        price: 280.00,
        stockQuantity: 12,
        categoryId: categories[1].id, // Fashion
        vendorId: vendors[3].id, // Tamale Fashion House
        weight: 0.9,
        imageURL: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800',
        highlights: [
          'Professional tailoring',
          'Quality African print',
          'Size 14 (adjustable)',
          'Complete outfit set',
        ],
        deliveryInfo: 'Free delivery in Northern Region',
        returnPolicy: 'Exchange only within 7 days',
      },
    }),

    // Product 12: Dawadawa (Locust Bean Seasoning)
    prisma.product.create({
      data: {
        productName: 'Dawadawa Powder - 200g Pack',
        description: 'Traditional Ghanaian seasoning made from fermented locust beans. Adds unique umami flavor to soups and stews. Essential for authentic Northern Ghanaian dishes.',
        price: 18.00,
        stockQuantity: 70,
        categoryId: categories[0].id, // Food
        vendorId: vendors[3].id, // Tamale Fashion House
        weight: 0.2,
        imageURL: 'https://images.unsplash.com/photo-1596040033229-a0b0b3a55c37?w=800',
        highlights: [
          'Traditional fermentation',
          'Rich umami flavor',
          'Natural seasoning',
          'No MSG or additives',
        ],
        deliveryInfo: 'Standard delivery 3-5 days',
        returnPolicy: 'No returns on spices',
      },
    }),

    // Product 13: Calabash Bowls Set
    prisma.product.create({
      data: {
        productName: 'Handcrafted Calabash Bowl Set - 3 Pieces',
        description: 'Set of three beautifully decorated calabash bowls. Hand-carved and painted with traditional patterns. Perfect for serving, decoration, or storage.',
        price: 95.00,
        stockQuantity: 18,
        categoryId: categories[5].id, // Arts & Crafts
        vendorId: vendors[1].id, // Kumasi Crafts
        weight: 1.5,
        imageURL: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
        highlights: [
          'Set of 3 different sizes',
          'Hand-painted designs',
          'Natural calabash',
          'Multipurpose use',
        ],
        deliveryInfo: 'Wrapped carefully, 5-7 days',
        returnPolicy: '7-day return if not satisfied',
      },
    }),

    // Product 14: Kokonte (Cassava Powder)
    prisma.product.create({
      data: {
        productName: 'Kokonte Powder - 1kg Pack',
        description: 'Dried cassava powder for making traditional Kokonte (brown fufu). Easy to prepare, just add hot water and stir. Rich in carbohydrates and gluten-free.',
        price: 22.00,
        stockQuantity: 55,
        categoryId: categories[0].id, // Food
        vendorId: vendors[2].id, // Cape Coast Delights
        weight: 1.0,
        imageURL: 'https://images.unsplash.com/photo-1560865728-07332c09f141?w=800',
        highlights: [
          'Easy preparation',
          'Gluten-free',
          'Long shelf life',
          'Traditional staple food',
        ],
        deliveryInfo: 'Ships nationwide',
        returnPolicy: 'No returns on food items',
      },
    }),

    // Product 15: Talking Drum
    prisma.product.create({
      data: {
        productName: 'Traditional Talking Drum - Medium Size',
        description: 'Authentic Ghanaian talking drum (Dondo) carved from quality wood with goat skin. Produces traditional tones when played. Perfect for cultural events and music.',
        price: 180.00,
        stockQuantity: 10,
        categoryId: categories[5].id, // Arts & Crafts
        vendorId: vendors[1].id, // Kumasi Crafts
        brand: 'Ashanti Drums',
        weight: 2.2,
        imageURL: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
        highlights: [
          'Handcrafted by master drummers',
          'Quality wood and goat skin',
          'Traditional tuning',
          'Includes carrying strap',
        ],
        deliveryInfo: 'Special packaging, 7-10 days',
        returnPolicy: '14-day return for defects',
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create some sample reviews
  console.log('⭐ Creating sample reviews...');
  await Promise.all([
    prisma.review.create({
      data: {
        productId: products[0].id,
        customerId: customers[0].id,
        rating: 5,
        comment: 'Beautiful Kente cloth! The quality is excellent and the colors are vibrant. Worth every pesewa!',
      },
    }),
    prisma.review.create({
      data: {
        productId: products[1].id,
        customerId: customers[1].id,
        rating: 5,
        comment: 'Best shea butter I\'ve used. My skin has never been softer. Highly recommend!',
      },
    }),
    prisma.review.create({
      data: {
        productId: products[3].id,
        customerId: customers[2].id,
        rating: 4,
        comment: 'Great ankara fabric. Made a beautiful dress from it. Fast delivery too!',
      },
    }),
  ]);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`
📊 Summary:
   - ${categories.length} Categories
   - ${vendors.length} Vendors
   - ${customers.length} Customers (including 1 Admin)
   - ${products.length} Products
   - 3 Reviews
   
🔐 Admin Credentials:
   Email: admin@gmail.com
   Password: 12345
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

