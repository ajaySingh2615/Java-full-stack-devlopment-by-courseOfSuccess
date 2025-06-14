# 🌱 GreenMagic Frontend

A modern, responsive React.js e-commerce frontend for organic and eco-friendly products, built with Vite and Tailwind CSS.

## ✨ Features

### 🏗️ **Modern Tech Stack**
- **React 18** - Latest React features and hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, customizable icons

### 🎨 **Professional Design System**
- **Custom Color Palette** - Green-focused brand colors
- **Typography** - Inter & Poppins font combinations
- **Responsive Design** - Mobile-first approach
- **Component Library** - Reusable UI components
- **CSS Architecture** - Component-specific CSS files

### 📱 **Pages Implemented**
- **Home** - Hero section, features, categories, products
- **Shop** - Product listing with filters and search
- **About** - Company story, team, and values
- **Contact** - Contact form and information
- **Blog** - Blog listing (coming soon placeholder)

### 🧩 **Key Components**
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Comprehensive footer with links and newsletter
- **Product Cards** - Interactive product displays
- **Hero Sections** - Engaging landing sections
- **Form Components** - Contact and newsletter forms

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
frontend/
├── public/                 # Public assets
├── src/
│   ├── components/         # Reusable components
│   │   └── layout/         # Layout components
│   │       ├── Navbar.jsx  # Navigation component
│   │       ├── Navbar.css  # Navbar styles
│   │       ├── Footer.jsx  # Footer component
│   │       └── Footer.css  # Footer styles
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Home page
│   │   ├── Home.css        # Home page styles
│   │   ├── About.jsx       # About page
│   │   ├── About.css       # About page styles
│   │   ├── Shop.jsx        # Shop page
│   │   ├── Shop.css        # Shop page styles
│   │   ├── Contact.jsx     # Contact page
│   │   ├── Contact.css     # Contact page styles
│   │   ├── Blog.jsx        # Blog page
│   │   └── Blog.css        # Blog page styles
│   ├── App.jsx             # Main App component
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles & Tailwind
│   └── main.jsx            # App entry point
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## 🎨 Design System

### Color Palette
```css
/* Primary (Green) */
primary-50:  #f0fdf4
primary-500: #22c55e
primary-600: #16a34a
primary-900: #14532d

/* Secondary (Yellow) */
secondary-500: #eab308
secondary-600: #ca8a04

/* Accent (Lime) */
accent-500: #84cc16
accent-600: #65a30d
```

### Typography
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (body text)
- **Font Weights**: 100-900 range

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Hover effects and shadows
- **Forms**: Consistent input styling
- **Navigation**: Active states and animations

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Maintenance
npm run lint         # Run ESLint
npm install          # Install dependencies
```

## 📦 Dependencies

### Core Dependencies
- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `lucide-react` - Icon library

### Development Dependencies
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - CSS framework
- `postcss` - CSS processor
- `autoprefixer` - CSS vendor prefixing
- `@tailwindcss/forms` - Form styling plugin
- `@tailwindcss/aspect-ratio` - Aspect ratio utilities

## 🌟 Key Features Implemented

### 🏠 **Home Page**
- Hero section with gradient backgrounds
- Feature highlights with icons
- Product categories grid
- Featured products showcase
- Call-to-action sections
- Statistics counter
- Responsive design

### 🛍️ **Shop Page**
- Product grid/list view toggle
- Category filtering
- Price range filters
- Search functionality
- Product sorting options
- Pagination
- Product cards with ratings

### ℹ️ **About Page**
- Company story section
- Mission & vision cards
- Core values showcase
- Team member profiles
- Statistics display
- Professional layout

### 📞 **Contact Page**
- Contact information display
- Contact form with validation
- Map placeholder
- FAQ section
- Multiple contact methods
- Form state management

### 📝 **Blog Page**
- Coming soon placeholder
- Category filtering structure
- Blog post cards layout
- Author and date display
- Read time indicators

## 🎯 Backend Integration Ready

The frontend is designed to easily integrate with the Spring Boot backend:

### API Integration Points
- Product fetching and display
- User authentication flows
- Shopping cart functionality
- Order management
- Contact form submission
- Newsletter subscription

### State Management
- Ready for Redux/Context integration
- Component state management
- Form state handling
- User session management

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Environment Variables
Create `.env` file for environment-specific configs:
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=GreenMagic
```

## 🔄 Next Steps

### Immediate Enhancements
1. **State Management** - Add Redux/Zustand
2. **API Integration** - Connect to Spring Boot backend
3. **Authentication** - User login/register flows
4. **Cart Functionality** - Shopping cart state management
5. **Payment Integration** - Razorpay/Stripe integration

### Future Features
1. **Product Search** - Advanced search with filters
2. **User Dashboard** - Order history, wishlist
3. **PWA Features** - Offline support, push notifications
4. **Performance** - Code splitting, lazy loading
5. **Testing** - Unit and integration tests

## 📧 Contact

For questions about the frontend implementation:
- **Project**: GreenMagic E-commerce Platform
- **Tech Stack**: React + Vite + Tailwind CSS
- **Backend**: Spring Boot (separate repository)

---

**Built with 💚 for a sustainable future**
