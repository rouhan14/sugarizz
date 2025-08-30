# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sugarizz is a Next.js-based e-commerce application for ordering cookies online. It features a modern, responsive design with real-time cart management, location-based delivery, and order processing with email notifications.

## Development Commands

### Development Server
```bash
# Start development server with Turbopack (recommended)
npm run dev

# Alternative development commands
yarn dev
pnpm dev
bun dev
```

### Production Build and Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Full production workflow
npm run build && npm start
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Lint with auto-fix
npx eslint . --fix
```

### Package Management
```bash
# Install dependencies
npm install

# Add new dependency
npm install [package-name]

# Add dev dependency
npm install -D [package-name]
```

## Architecture Overview

### Application Structure
- **Next.js 15** with App Router architecture
- **React 19** with client/server components
- **Route Groups**: `(home)` for main pages
- **API Routes**: RESTful endpoints for orders, contact, geocoding

### State Management
- **Zustand**: Primary state management for cart functionality
- **Persistent Storage**: Cart state persists across sessions using localStorage
- **Real-time Updates**: Cart quantities sync across all components

### Database Layer
- **MongoDB**: Primary database with Mongoose ODM
- **Connection Pooling**: Cached database connections for performance
- **Models**: Order, Cookie, Settings schemas with validation

### Key Technical Decisions
1. **Zustand over Redux**: Simpler state management for cart operations
2. **App Router**: Modern Next.js routing with server components
3. **Tailwind CSS**: Utility-first styling with custom color scheme
4. **ShadCN/UI**: Reusable component system for consistent design

### Component Architecture

#### Core Components
- `components/cookie.jsx`: Main product display with interactive cart controls
- `components/navbar.jsx`: Navigation with persistent cart counter
- `components/cartItem.jsx`: Individual cart item management
- `components/moveToCartPopUp.jsx`: Cart notification system

#### Layout Components
- `app/layout.jsx`: Root layout with Meta Pixel tracking and global styles
- `components/footer.jsx`: Site footer with links
- Global CSS with custom gradient backgrounds

### Data Flow
1. **Product Display**: Static data from `data.js` renders cookie cards
2. **Cart Operations**: Zustand store manages quantities with persistence
3. **Checkout Flow**: Cart → Checkout form → Order API → Email notification
4. **Order Processing**: Coordinates calculation, delivery zones, cost analysis

### API Endpoints

#### POST /api/orders
- Processes new orders with validation
- Generates unique numeric order IDs
- Calculates material costs and delivery charges
- Sends confirmation emails via Nodemailer
- Stores comprehensive order data in MongoDB

#### POST /api/contact
- Handles contact form submissions
- Email notifications for customer inquiries

#### POST /api/geocode (Distance Matrix API)
- **Road distance calculation** using Google Distance Matrix API
- Replaces geocoding with actual driving routes and times
- Calculates delivery zones based on real road distance, not straight-line
- Supports both address input and GPS coordinates
- Returns distance, duration, coordinates, and formatted address

### Environment Variables Required
```bash
MONGODB_URI=mongodb://...
GOOGLE_API_KEY=your_google_api_key_here  # Required for Distance Matrix API
# Email service configuration (Nodemailer)
# Meta Pixel tracking ID (already configured: 738614225291126)
```

## Development Guidelines

### Working with State
- Use Zustand store for cart operations: `increase()`, `decrease()`, `resetQuantities()`
- Cart state automatically persists to localStorage
- Always check for hydration before accessing cart state in components

### Adding New Cookie Products
1. Update `data.js` with new cookie object (title, description, price, image, bgColor)
2. Add corresponding image to `public/` directory
3. No code changes required - product automatically appears

### Styling Conventions
- Use Tailwind classes with custom color `custom-blue: #242833`
- Gradient backgrounds: `from-[#242833] via-[#2d3142] to-[#1a1d29]`
- Glass morphism effects: `bg-white/10 backdrop-blur-md border border-white/20`
- Consistent button styling with shadow effects and hover states

### API Development
- All API routes use modern Response.json() syntax
- Comprehensive error handling with structured responses
- Database operations use cached connections via `lib/mongoose.js`
- Email functionality centralized in `lib/sendOrderEmail.js`

### Order Management
- Orders use sequential numeric IDs (1001, 1002, etc.) via `getNextOrderId()`
- Comprehensive order schema includes customer data, pricing, and admin fields
- Automatic calculation of material costs and profit margins

## File Organization

### Key Directories
- `app/`: Next.js app directory with pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions (database, email, order processing)
- `models/`: Mongoose schemas for data validation
- `store/`: Zustand store for state management
- `data/`: Static product data and configuration
- `public/`: Static assets (images, logos)

### Important Files
- `data.js`: Product catalog with all cookie information
- `store/cookieStore.js`: Cart state management with persistence
- `lib/mongoose.js`: Database connection with caching
- `models/Order.js`: Comprehensive order schema with business logic
- `app/api/orders/route.js`: Core order processing endpoint

## Browser Testing Notes
- Application works across all modern browsers
- Mobile-responsive design with touch-friendly interactions
- Cart persistence works across browser sessions
- Meta Pixel tracking integrated for analytics

## Local Development Setup
1. Clone repository and run `npm install`
2. Set up MongoDB database and configure MONGODB_URI
3. Configure email service for order notifications
4. Run `npm run dev` to start development server
5. Access application at http://localhost:3000
