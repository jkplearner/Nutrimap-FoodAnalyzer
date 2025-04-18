const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./concol');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/foodanalysis', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Store product analysis
app.post('/api/products', async (req, res) => {
  try {
    const { userId, userName, productName, category, analysisResult } = req.body;
    
    // Extract product name and category from analysis result
    let extractedProductName = productName;
    let extractedCategory = category;
    
    if (analysisResult.includes('Error:')) {
      // Don't save if there's an error in analysis
      return res.status(400).json({ message: 'Invalid analysis result' });
    }

    // Try to extract product name and category from analysis result if not provided
    if (!productName || !category) {
      const analysisObj = JSON.parse(analysisResult);
      extractedProductName = analysisObj.productName || 'Unknown Product';
      extractedCategory = analysisObj.category || 'Uncategorized';
    }

    const product = new Product({
      userId,
      userName,
      productName: extractedProductName,
      category: extractedCategory,
      analysisResult
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Error saving product analysis' });
  }
});

// Get user's product history
app.get('/api/products/:userId', async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching product history' });
  }
});

// Get specific product details
app.get('/api/products/:userId/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      userId: req.params.userId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});