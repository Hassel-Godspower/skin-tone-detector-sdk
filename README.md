# 🌈 Skin Tone Detector API

This project is an intelligent **Skin Tone Detection System** powered by AI and Color Science.  
It analyzes an uploaded image, detects the average skin tone, and classifies it under predefined tone categories.

---

## 🚀 Features

- Detects dominant skin color from an image (HEX + RGB).
- Classifies tone into 16 or 75 predefined categories.
- Returns matching WooCommerce or eCommerce products.
- Can be integrated into web apps, salons, and virtual try-on systems.
- API-first design — deployable on **Vercel**.

---

## 🧠 Tech Stack

- **Language:** Node.js (Express API)
- **Deployment:** Vercel
- **Version Control:** GitHub
- **File Upload:** Multer / FormData
- **Color Detection:** `get-image-colors` or `colorthief`

---

## 📁 Project Structure

```
skin-tone-detector/
├── api/
│   └── detect.js         # API endpoint
├── public/
│   └── sample.jpg        # Test image
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/skin-tone-detector.git
cd skin-tone-detector
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Deploy to Vercel
- Go to [Vercel](https://vercel.com)
- Import this GitHub repo
- Click **Deploy**

---

## 🧩 API Endpoint

**POST** `/api/detect`  
Uploads an image and returns detected color + tone.

### Example Request
```bash
curl -X POST -F "image=@face.jpg" https://yourapp.vercel.app/api/detect
```

### Example Response
```json
{
  "hex": "#CD966B",
  "rgb": [205, 150, 107],
  "tone": "Medium Light",
  "matched_product": "Golden Caramel Foundation"
}
```

---

## 🔑 Licensing

This project is owned by **HighValue Solutions**.  
For commercial use or integration, contact **support@highvaluesolutions.net**.

---

© 2025 HighValue Solutions. All rights reserved.
