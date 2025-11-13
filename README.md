# 🚀 React + Tailwind CSS Boilerplate

A production-ready React boilerplate with Tailwind CSS for rapid development and hackathons.

## ✨ Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React with hooks
- 🎨 **Tailwind CSS v3** - Utility-first CSS framework
- 📡 **Axios** - HTTP client for API calls
- 🛣️ **React Router** - Client-side routing
- 🎯 **Pre-configured** - Ready for any backend (Django, Node.js, FastAPI)
- 📱 **Responsive** - Mobile-first design
- 🔧 **Organized** - Clean folder structure

---

## 🚀 Quick Start

### 1. Use This Template

Click the **"Use this template"** button above or clone directly:

```bash
git clone https://github.com/YOUR-USERNAME/frontend-boilerplate.git my-project
cd my-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your backend URL
VITE_API_URL=http://localhost:8000
```

### 4. Start Development

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── assets/              # Images, fonts, static files
├── components/
│   ├── common/          # Reusable UI components (Button, Input, Card)
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── features/        # Feature-specific components
├── pages/               # Page components
├── services/            # API service functions
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
├── config/              # Configuration (API, constants)
├── context/             # React Context for state
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles + Tailwind
```

---

## 🎨 Included Components

### Common Components

- `Button` - Multiple variants (primary, secondary, success, danger, outline, ghost)
- `Input` - Form input with label and error handling
- `Card` - Container with shadow and hover effects
- `Spinner` - Loading spinner with size options

### Layout Components

- `Navbar` - Responsive navigation with mobile menu
- `Footer` - Footer component

### Usage Example

```jsx
import Button from "./components/common/Button";
import Card from "./components/common/Card";

function MyPage() {
  return (
    <Card>
      <h1>Hello World</h1>
      <Button variant="primary" onClick={() => alert("Clicked!")}>
        Click Me
      </Button>
    </Card>
  );
}
```

---

## 🔌 Backend Integration

### Configure API Base URL

Edit `src/config/api.js` or set in `.env`:

```javascript
// .env
VITE_API_URL=http://localhost:8000
```

### Create Service Files

```javascript
// src/services/userService.js
import api from "../config/api";

export const userService = {
  getAll: async () => {
    const response = await api.get("/api/users/");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/users/", data);
    return response.data;
  },
};
```

### Use in Components

```jsx
import { useState, useEffect } from "react";
import { userService } from "../services/userService";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await userService.getAll();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return <div>{/* Render users */}</div>;
}
```

---

## 🎯 Customization Guide

### For a New Project:

1. **Analyze Backend APIs** - List all endpoints
2. **Create Services** - Add service files for each resource
3. **Build Features** - Create feature components in `components/features/`
4. **Create Pages** - Build pages in `pages/`
5. **Update Routes** - Add routes in `App.jsx`
6. **Update Branding** - Change logo, colors in `Navbar.jsx`

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📦 Included Packages

- `react` & `react-dom` - Core React
- `axios` - HTTP client
- `react-router-dom` - Routing
- `lucide-react` - Icon library
- `tailwindcss` - CSS framework

---

## 🌐 Backend CORS Setup

### Django

```python
# settings.py
INSTALLED_APPS = ['corsheaders', ...]
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

### Node.js/Express

```javascript
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));
```

### FastAPI

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])
```

---

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - Feel free to use for any project!

---

## 🎉 Happy Coding!
