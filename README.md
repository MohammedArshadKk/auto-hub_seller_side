# AutoHub Seller Portal

A modern, production-ready seller portal for AutoHub - an auto parts marketplace. Sellers can search for parts from an admin-managed catalog and create product listings with pricing and inventory.

## 🚀 Features

### ✅ Authentication
- Secure login with HTTP-only cookies
- Show/hide password toggle
- Auto-redirect for authenticated users
- Protected routes
- Auto token refresh on 401

### 🔍 Part Search (Step 1)
- Real-time autocomplete with 300ms debounce
- Advanced filters:
  - Category dropdown
  - Brand dropdown
  - Year input (1900 - current+2)
  - Make dropdown
  - Model dropdown (depends on Make)
- Paginated search results (20 items per page)
- Loading states and empty states
- Request cancellation on new search

### 📝 Product Creation (Step 2 & 3)
- Multi-step wizard with progress indicator
- Product details form:
  - Price validation
  - Stock management
  - Image upload (1-10 images)
  - Condition selection (NEW, USED, REFURBISHED)
  - Optional fields (original price, warranty, custom description)
- Review & submit step
- Success/error notifications

### 📦 Product Management
- List all products with pagination
- Filter by status (PENDING_APPROVAL, APPROVED, REJECTED)
- Search by product name
- Edit and delete actions
- Color-coded status badges

### 🎨 Modern UI/UX
- Clean, professional design (inspired by Shopify/Amazon Seller Central)
- Primary color: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)
- Full dark mode support with toggle
- Smooth animations and transitions (200-300ms)
- Responsive design (mobile-first)

## 🛠️ Tech Stack

- **React 18+** - UI framework
- **React Router v6**  - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   ├── layout/
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── products/
│   │   ├── PartSearchStep.jsx
│   │   ├── ProductDetailsStep.jsx
│   │   └── ProductReviewStep.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── EmptyState.jsx
│       ├── Input.jsx
│       ├── LoadingSkeleton.jsx
│       └── Modal.jsx
├── pages/
│   ├── CreateProduct.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Products.jsx
│   ├── Inventory.jsx
│   ├── Orders.jsx
│   ├── Earnings.jsx
│   └── Settings.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── partService.js
│   └── productService.js
├── hooks/
│   ├── useAuth.js
│   ├── useDebounce.js
│   └── useTheme.js
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── App.jsx
└── main.jsx
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
cd autohub-seller-portal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:5001/api/v1
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🔌 API Integration

The app connects to the backend at `http://localhost:5001/api/v1` by default.

### Authentication Endpoints
- `POST /seller/auth/login` - Login
- `GET /seller/auth/me` - Check auth status
- `POST /seller/auth/logout` - Logout
- `POST /seller/auth/refresh` - Refresh token

### Part Search Endpoints
- `GET /parts/search` - Search parts
- `GET /parts/suggestions` - Autocomplete
- `GET /parts/categories` - Get categories
- `GET /parts/brands` - Get brands
- `GET /parts/vehicles/makes` - Get makes
- `GET /parts/vehicles/models` - Get models
- `GET /parts/:id` - Get part details

### Product Endpoints
- `POST /products/seller` - Create product
- `GET /products/seller` - Get seller's products
- `PATCH /products/seller/:id` - Update product
- `DELETE /products/seller/:id` - Delete product

## 🎨 Design System

### Colors
- Primary: `#2563EB` (Blue)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Orange)
- Danger: `#EF4444` (Red)
- Dark BG: `#0B1120`
- Dark Card: `#1A2332`

### Typography
- Font: Inter (Google Fonts)
- Headings: 700-800 weight
- Body: 400-500 weight

### Spacing
- Cards: 24px padding
- Grid gaps: 24px
- Sections: 24px spacing

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials
   - [ ] Already logged in auto-redirect
   - [ ] Logout functionality

2. **Part Search**
   - [ ] Autocomplete after 2 characters
   - [ ] Filter by category
   - [ ] Filter by make/model
   - [ ] Pagination works
   - [ ] Empty state displays

3. **Product Creation**
   - [ ] Select part
   - [ ] Fill product details
   - [ ] Upload images
   - [ ] Form validation
   - [ ] Submit product
   - [ ] Success notification

4. **Dark Mode**
   - [ ] Toggle works
   - [ ] Preference persists

5. **Responsive Design**
   - [ ] Mobile view (375px)
   - [ ] Tablet view (768px)
   - [ ] Desktop view (1024px+)

## 📊 Performance

- Bundle size: < 500KB (gzipped)
- Search response: < 500ms
- Debounce delay: 300ms
- Images: WebP format, lazy loading
- Code splitting: Route-based

## 🔒 Security

- HTTP-only cookies for authentication
- CSRF protection
- Input validation
- XSS protection (React)

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For support, contact the development team or email support@autohub.com.

---

Built with ❤️ by the AutoHub team
