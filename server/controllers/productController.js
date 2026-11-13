const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const Category = require('../models/Category');
    await Category.deleteMany({});
    await Product.deleteMany({});

    const categories = await Category.insertMany([
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
      { name: 'Clothing', slug: 'clothing', description: 'Apparel and accessories' },
      { name: 'Books', slug: 'books', description: 'Physical and digital books' },
      { name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor' },
      { name: 'Sports', slug: 'sports', description: 'Sports and fitness gear' },
    ]);

    const [elec, cloth, books, home, sports] = categories;

    await Product.insertMany([
      // Electronics
      { name: 'Wireless Headphones', slug: 'wireless-headphones', price: 79.99, category: elec._id, stock: 50, featured: true, description: 'Premium sound, 30hr battery life with active noise cancellation.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', price: 129.99, category: elec._id, stock: 30, description: 'Tactile switches, RGB backlit, compact TKL layout.', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80' },
      { name: 'USB-C Hub', slug: 'usb-c-hub', price: 39.99, category: elec._id, stock: 100, description: '7-in-1 multiport adapter with 4K HDMI and 100W PD.', image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600&q=80' },
      { name: 'Smartwatch', slug: 'smartwatch', price: 199.99, category: elec._id, stock: 25, featured: true, description: 'Health tracking, GPS, 5-day battery, water resistant.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
      { name: 'Wireless Earbuds', slug: 'wireless-earbuds', price: 59.99, category: elec._id, stock: 80, description: 'True wireless, 24hr total playback, IPX5 rated.', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80' },
      { name: 'Portable SSD', slug: 'portable-ssd', price: 89.99, category: elec._id, stock: 60, description: '1TB, USB 3.2, up to 1050MB/s read speed.', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80' },
      { name: 'Webcam 4K', slug: 'webcam-4k', price: 109.99, category: elec._id, stock: 35, description: '4K 30fps, built-in mic, auto light correction.', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' },
      { name: 'Laptop Stand', slug: 'laptop-stand', price: 49.99, category: elec._id, stock: 90, description: 'Adjustable aluminum stand, fits 10-17 inch laptops.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80' },
      // Clothing
      { name: 'Running Jacket', slug: 'running-jacket', price: 59.99, category: cloth._id, stock: 40, featured: true, description: 'Lightweight, water-resistant, reflective details.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
      { name: 'Graphic Tee', slug: 'graphic-tee', price: 24.99, category: cloth._id, stock: 200, description: '100% soft cotton, pre-shrunk, various designs.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
      { name: 'Slim Chinos', slug: 'slim-chinos', price: 49.99, category: cloth._id, stock: 75, description: 'Stretch fabric, slim fit, available in 6 colors.', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80' },
      { name: 'Hoodie', slug: 'hoodie', price: 54.99, category: cloth._id, stock: 120, featured: true, description: 'Heavyweight fleece, kangaroo pocket, unisex fit.', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
      { name: 'Denim Jacket', slug: 'denim-jacket', price: 74.99, category: cloth._id, stock: 30, description: 'Classic washed denim, button front, chest pockets.', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80' },
      { name: 'Sneakers', slug: 'sneakers', price: 89.99, category: cloth._id, stock: 55, description: 'Cushioned sole, breathable mesh upper, everyday comfort.', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80' },
      // Books
      { name: 'Clean Code', slug: 'clean-code', price: 34.99, category: books._id, stock: 60, featured: true, description: 'A handbook of agile software craftsmanship by Robert C. Martin.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80' },
      { name: 'The Pragmatic Programmer', slug: 'pragmatic-programmer', price: 39.99, category: books._id, stock: 45, description: 'Your journey to mastery, 20th anniversary edition.', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' },
      { name: 'Designing Data-Intensive Apps', slug: 'designing-data-intensive-apps', price: 44.99, category: books._id, stock: 38, featured: true, description: 'The big ideas behind reliable, scalable systems by Martin Kleppmann.', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80' },
      { name: "You Don't Know JS", slug: 'you-dont-know-js', price: 29.99, category: books._id, stock: 70, description: 'Deep dive into JavaScript core mechanisms, 6-book series.', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80' },
      { name: 'Atomic Habits', slug: 'atomic-habits', price: 19.99, category: books._id, stock: 150, description: 'Tiny changes, remarkable results by James Clear.', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80' },
      // Home & Living
      { name: 'Desk Lamp', slug: 'desk-lamp', price: 44.99, category: home._id, stock: 65, featured: true, description: 'LED, adjustable color temp, USB charging port built-in.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80' },
      { name: 'Ceramic Mug Set', slug: 'ceramic-mug-set', price: 29.99, category: home._id, stock: 80, description: 'Set of 4 handcrafted mugs, dishwasher safe, 12oz.', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80' },
      { name: 'Throw Blanket', slug: 'throw-blanket', price: 34.99, category: home._id, stock: 90, description: 'Super soft sherpa fleece, 50x60 inches, multiple colors.', image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&q=80' },
      { name: 'Indoor Plant Pot', slug: 'indoor-plant-pot', price: 19.99, category: home._id, stock: 110, description: 'Minimalist ceramic pot with drainage hole, 6 inch.', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80' },
      { name: 'Scented Candle', slug: 'scented-candle', price: 22.99, category: home._id, stock: 200, description: 'Soy wax, 50hr burn time, lavender and vanilla scent.', image: 'https://images.unsplash.com/photo-1602607144535-11be3d5e5b3e?w=600&q=80' },
      // Sports
      { name: 'Yoga Mat', slug: 'yoga-mat', price: 35.99, category: sports._id, stock: 85, featured: true, description: 'Non-slip, 6mm thick, eco-friendly TPE material.', image: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5b5e5?w=600&q=80' },
      { name: 'Resistance Bands Set', slug: 'resistance-bands', price: 24.99, category: sports._id, stock: 130, description: 'Set of 5 bands, 10-50 lbs resistance, with carry bag.', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80' },
      { name: 'Water Bottle', slug: 'water-bottle', price: 27.99, category: sports._id, stock: 160, description: 'Insulated stainless steel, 32oz, keeps cold 24hr.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80' },
      { name: 'Running Shoes', slug: 'running-shoes', price: 119.99, category: sports._id, stock: 40, featured: true, description: 'Lightweight, responsive cushioning, breathable upper.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
      { name: 'Dumbbell Set', slug: 'dumbbell-set', price: 79.99, category: sports._id, stock: 25, description: 'Adjustable 5-25 lbs per dumbbell, rubber coated.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
    ]);

    res.json({ message: 'Seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
