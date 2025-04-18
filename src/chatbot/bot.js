import React, { useState, useRef, useCallback, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import { maybeShowApiKeyBanner } from "./gemini-banner-api";
import Webcam from "react-webcam";
import "./FoodProductAnalysis.css";
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = "YOUR_API_KEY";

const FoodProductAnalysis = () => {
  const [imageSrcBrand, setImageSrcBrand] = useState(null);
  const [imageSrcNutritional, setImageSrcNutritional] = useState(null);
  const [output, setOutput] = useState("(Results will appear here)");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const webcamRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const handleCompareClick = () => {
    navigate('/compare', { state: { id, name } });
  };
  const location = useLocation();
  const { id, name } = location.state || {};

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      
      const uniqueProducts = data.reduce((acc, current) => {
        const existingProduct = acc.find(item => item.productName === current.productName);
        if (!existingProduct || new Date(current.createdAt) > new Date(existingProduct.createdAt)) {
          if (existingProduct) {
            acc = acc.filter(item => item.productName !== current.productName);
          }
          acc.push(current);
        }
        return acc;
      }, []);

      const sortedProducts = uniqueProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}/${productId}`);
      const data = await response.json();
      setSelectedProduct(data);
      setOutput(data.analysisResult);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  maybeShowApiKeyBanner(API_KEY);

  const videoConstraints = {
    facingMode: { ideal: "environment" },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  const captureBrand = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrcBrand(imageSrc);
  }, [webcamRef]);

  const captureNutritional = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrcNutritional(imageSrc);
  }, [webcamRef]);

  const handleFileUploadBrand = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrcBrand(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUploadNutritional = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrcNutritional(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const checkIfFoodProduct = async (genAI, imageSrc) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const contents = [
      {
        role: "user",
        parts: [
          { inline_data: { mime_type: "image/jpeg", data: imageSrc.split(",")[1] } },
          { text: "Is this image of a food product with nutritional information or packaging? Please respond with only 'yes' or 'no'." },
        ],
      },
    ];

    const result = await model.generateContent({ contents });
    const text = result.response.text().toLowerCase();
    return text.includes('yes');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOutput("Analyzing images...");
    setLoading(true);

    try {
      if (!imageSrcBrand || !imageSrcNutritional) {
        setOutput("Please capture or upload both the brand image and nutritional values image.");
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      
      const isBrandFoodProduct = await checkIfFoodProduct(genAI, imageSrcBrand);
      const isNutritionalFoodProduct = await checkIfFoodProduct(genAI, imageSrcNutritional);

      if (!isBrandFoodProduct || !isNutritionalFoodProduct) {
        setOutput("Error: One or both images do not appear to be of food products. Please provide valid images of food product packaging and nutritional information.");
        setLoading(false);
        return;
      }

      const prompt = `
      Extract and systematically organize the following key data from the two provided images. The first image contains brand and product information, while the second image contains the nutritional details.

### 1. Product Information  
- **Product Name**: Extract from the first image.  
- **Brand Name**: Extract from the first image.  
- **Quantity**: Extract if available from the first image.  
- **Total Weight**: Extract if available from the first image.  
- **Product Category**: Classify the product into a relevant category (e.g., Snack, Beverage, Dairy, Processed Food).  

### 2. Nutritional Details  
- **Serving Size**: Extract from the second image.  
- **Recommended Intake Limits**: Provide intake recommendations based on the **product category** and standard dietary guidelines.

#### Nutritional Breakdown:  

| Nutrient          | Per 100g | **Recommended Limit (India - Based on Category)** | **Recommended Limit (US - Based on Category)** |  
|-------------------|----------|--------------------------------------------------|------------------------------------------------|  
| Energy (kcal)     |          | Provide category-based limit                     | Provide category-based limit                   |  
| Protein (g)       |          | Provide category-based limit                     | Provide category-based limit                   |  
| Carbohydrate (g)  |          | Provide category-based limit                     | Provide category-based limit                   |  
| Total Sugars (g)  |          | Provide category-based limit                     | Provide category-based limit                   |  
| Added Sugars (g)  |          | Provide category-based limit                     | Provide category-based limit                   |  
| Total Fat (g)     |          | Provide category-based limit                     | Provide category-based limit                   |  
| Trans Fat (g)     |          | Provide category-based limit                     | Provide category-based limit                   |  
| Saturated Fat (g) |          | Provide category-based limit                     | Provide category-based limit                   |  
| Cholesterol (mg)  |          | Provide category-based limit                     | Provide category-based limit                   |  
| Sodium (mg)       |          | Provide category-based limit                     | Provide category-based limit                   |  

### 3. Proprietary Claims & Label Accuracy  
- **Notable Claims**: Identify claims such as "low-fat," "sugar-free," "high protein," etc.  
- **Misleading Claims**: Verify if any claims on the label are **inconsistent** with the actual nutritional data.  

### 4. Additional Insights  
- **Purpose**: Determine whether the product is primarily for **nutrition, recreation, or regular consumption**.  
- **Usage Frequency**: Suggest whether the product should be consumed **daily, weekly, or occasionally** based on the **product category and nutritional profile**.  
- **Eco-Friendliness**: Assess whether the packaging is **eco-friendly, recyclable, or missing such information**.  
- **Health & Environmental Impact**:  
  - Identify any **potentially harmful ingredients**.  
  - Assess the **overall health benefits or risks** based on the product’s composition.  
  - If applicable, highlight **environmental concerns** related to ingredients or packaging.  
- **Dietary Compliance**: Specify whether the product aligns with dietary needs, such as **diabetes-friendly, allergen-free, keto-friendly, or vegetarian**.  

### 5. Demographic Considerations  
- **Age Suitability**: Determine whether the product is suitable or unsuitable for certain age groups (**children, adults, seniors**).  
- **Gender-Specific Benefits**: Analyze if the product is tailored for specific **gender-related nutritional needs** (e.g., **iron-rich for women, high-protein for men**).  


      `;

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const contents = [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: imageSrcBrand.split(",")[1] } },
            { text: "This image contains the brand and product information." },
            { inline_data: { mime_type: "image/jpeg", data: imageSrcNutritional.split(",")[1] } },
            { text: "This image contains the nutritional values." },
            { text: prompt },
          ],
        },
      ];

      const result = await model.generateContentStream({ contents });
      let buffer = [];
      let md = new MarkdownIt();
      let hasStoredResult = false;

      for await (let response of result.stream) {
        try {
          buffer.push(response.text());
          const textOutput = md.render(buffer.join(""));
          setOutput(textOutput);

          if (!hasStoredResult && response.candidates?.[0]?.finishReason === 'STOP') {
            hasStoredResult = true;
            const analysisText = buffer.join("");
            
            const productNameMatch = analysisText.match(/Product Name[^\n]*:\s*([^\n]+)/);
            const categoryMatch = analysisText.match(/Product Category[^•]*?•\s*([^\n•]+)/);
            
            const productName = productNameMatch ? productNameMatch[1].trim() : 'Unknown Product';
            let category = 'Uncategorized';
            
            if (categoryMatch && categoryMatch[1]) {
              category = categoryMatch[1].trim();
            } else {
              const fallbackCategoryMatch = analysisText.match(/category[^:]*:\s*([^\n]+)/i);
              if (fallbackCategoryMatch) {
                category = fallbackCategoryMatch[1].trim();
              }
            }

            if (!analysisText.includes('Error:')) {
              const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: id,
                  userName: name,
                  productName,
                  category,
                  analysisResult: textOutput
                }),
              });

              if (response.ok) {
                await fetchProducts();
              }
            }
          }
        } catch (streamError) {
          setOutput(`An error occurred: ${streamError.message}`);
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={sidebarOpen ? "sidebar-open" : ""}>
      <h1>Food Product Analysis</h1>
      <h2>Welcome, {name}</h2>
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1001
      }}>
        <button
          onClick={handleCompareClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
          }}
        >
          Compare Products
        </button>
      </div>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Analysis History</h2>
        <div className="product-list">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-item"
              onClick={() => handleProductClick(product._id)}
            >
              <h3>{product.productName}</h3>
              <p>{product.category}</p>
              <p>{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? "Close History" : "Show History"}
      </button>

      <form onSubmit={handleSubmit}>
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </div>

        <div className="button-container">
          <button className="capture-button" type="button" onClick={captureBrand}>
            Capture Brand
          </button>
          <input
            type="file"
            id="file-brand"
            accept="image/*"
            onChange={handleFileUploadBrand}
            className="file-input"
          />
          <label htmlFor="file-brand" className="pin-button">
            Upload Brand
          </label>
        </div>

        <div className="button-container">
          <button className="capture-button" type="button" onClick={captureNutritional}>
            Capture Nutrition
          </button>
          <input
            type="file"
            id="file-nutritional"
            accept="image/*"
            onChange={handleFileUploadNutritional}
            className="file-input"
          />
          <label htmlFor="file-nutritional" className="pin-button">
            Upload Nutrition
          </label>
        </div>

        {imageSrcBrand && (
          <div className="image-preview">
            <h4>Brand Image</h4>
            <img src={imageSrcBrand} alt="Brand" className="captured-image" />
          </div>
        )}

        {imageSrcNutritional && (
          <div className="image-preview">
            <h4>Nutritional Values Image</h4>
            <img src={imageSrcNutritional} alt="Nutritional" className="captured-image" />
          </div>
        )}

        <div className="button-container">
          <button className="analyze-button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Product"}
          </button>
        </div>
      </form>

      <div className="output" dangerouslySetInnerHTML={{ __html: output }} />
    </main>
  );
};

export default FoodProductAnalysis;