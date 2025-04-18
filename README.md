# 🥗 Nutrimap-FoodAnalyzer

**Nutrimap-FoodAnalyzer** is a full-stack web application that analyzes and compares the nutritional profiles of food products. It features user authentication, custom food entry, detailed comparison charts (bar and spider), and a machine learning-powered data analysis module with high model performance.

---

## 🚀 Features

- 🌐 **Frontend Interface** – Interactive UI built with HTML, CSS, and JavaScript.
- 🔐 **User Authentication** – Login and signup functionality (`app.js`).
- 📦 **Food Product Management** – Save and manage food items (`app2.js`).
- ⚖️ **Product Comparison** – Visually compare two food items:
  - 📊 Bar Graphs for macronutrient comparisons
  - 🔸 Spider Charts for detailed nutritional differences
- 📈 **Data Analysis (DA)** – Classifies food items using a machine learning model.
- 🧠 **Model Performance**:
  - ✅ Accuracy: **85%**
  - ✅ Precision: **83%**
  - ✅ Recall: **84%**
  - ✅ F1 Score: **83%**

---

## 🛠️ Installation

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/jkplearner/Nutrimap-FoodAnalyzer.git
cd Nutrimap-FoodAnalyzer
npm install
```

---

## ⚙️ Run the Application

Open **three terminal windows** and run the following commands in each:

### 1️⃣ Frontend Interface

```bash
npm start
```

### 2️⃣ User Login/Signup Backend

```bash
node app.js
```

### 3️⃣ Food Product & Data Analysis Backend

```bash
node app2.js
```

> ⚠️ Ensure **MongoDB** is running locally and accessible via `mongo.js`.

---

## 📁 Project Structure

```
├── app.js         # User authentication backend
├── app2.js        # Food saving & data analysis backend
├── mongo.js       # MongoDB connection
├── concol.js      # Utility functions
├── src/           # Frontend (HTML/CSS/JS)
├── public/        # Graph rendering scripts and static assets
├── models/        # MongoDB models
├── utils/         # Data analysis logic
└── package.json   # Project dependencies
```

---

## 📊 Data Analysis & Visualization

The application includes a data analysis module to assess and classify food products based on their nutritional content.

- Nutritional classification based on macro & micronutrients
- Real-time graph generation using JavaScript charting libraries
- Spider and bar graphs to visualize nutrient differentials
- Model trained and validated with classification metrics >80%

---

## 📬 Contact

For any queries or contributions, feel free to reach out:

**GitHub**: [@jkplearner](https://github.com/jkplearner)  
**LinkedIn**: [Jaya Krishna Pavan Mummaneni](https://www.linkedin.com/in/jaya-krishna-pavan-mummaneni-b3a611293/)  
**Email**: jkpm4321@gmail.com

---
