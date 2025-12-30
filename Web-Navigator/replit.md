# TrafficAI Analytics Platform

## Overview

TrafficAI is a full-stack traffic analytics platform that enables users to upload traffic videos, process them for vehicle detection, and visualize vehicle tracking data on interactive maps. The system uses a React frontend with a Node.js/Express backend, PostgreSQL for data persistence, and includes a Python-based video analysis component for vehicle detection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Maps**: Leaflet with react-leaflet for GPS track visualization
- **Charts**: Recharts for traffic statistics visualization
- **Build Tool**: Vite with HMR support

The frontend follows a page-based architecture with shared components:
- `client/src/pages/` - Route components (Dashboard, Analysis, VideoDetails, MapPage)
- `client/src/components/` - Reusable UI components
- `client/src/components/ui/` - shadcn/ui primitives
- `client/src/hooks/` - Custom React hooks for data fetching

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Design**: RESTful endpoints defined in `shared/routes.ts`
- **File Uploads**: Multer for multipart/form-data handling
- **Video Processing**: Python script spawned via child_process for vehicle detection

The server structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database access layer (repository pattern)
- `server/db.ts` - Drizzle ORM database connection
- `server/analysis.py` - Python script for video analysis (mock implementation)

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts`

Database tables:
- `videos` - Stores uploaded video metadata and processing results
- `gps_points` - Stores GPS coordinates extracted from videos

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Database schema definitions and TypeScript types
- `routes.ts` - API route definitions with Zod validation schemas

### Build System
- **Development**: Vite dev server with Express backend proxy
- **Production**: 
  - Frontend built with Vite to `dist/public`
  - Backend bundled with esbuild to `dist/index.cjs`
  - Selective dependency bundling for faster cold starts

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Frontend Libraries
- **Leaflet**: Interactive maps with dark theme tiles from CARTO
- **Recharts**: Bar charts for vehicle statistics
- **Radix UI**: Accessible UI primitives (via shadcn/ui)
- **embla-carousel-react**: Carousel functionality

### Backend Libraries
- **Multer**: Video file upload handling (stored in `client/public/uploads`)
- **Drizzle ORM**: Type-safe database queries
- **Zod**: Runtime validation for API requests/responses

### Development Tools
- **Replit Plugins**: 
  - `@replit/vite-plugin-runtime-error-modal` - Error overlay
  - `@replit/vite-plugin-cartographer` - Code mapping (dev only)
  - `@replit/vite-plugin-dev-banner` - Development banner (dev only)

### Video Analysis (Optional)
- Python with OpenCV/NumPy (currently mocked in `server/analysis.py`)
- YOLO model integration prepared but not active

## Getting Started

### Prerequisites
- Node.js 20+ (included in Replit)
- PostgreSQL database (provisioned via Replit)
- Python 3.11+ (for video analysis)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - `DATABASE_URL` - PostgreSQL connection string (automatically set in Replit)
   - `PORT` - Server port (defaults to 5000)

3. **Initialize database:**
   ```bash
   npm run db:push
   ```
   This creates the necessary tables using Drizzle ORM.

4. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (creates `dist/` folder)
- `npm start` - Start production server (requires build first)
- `npm run check` - Type-check TypeScript code
- `npm run db:push` - Push database schema changes to PostgreSQL

## API Endpoints

### Video Management

- `GET /api/videos` - List all videos
  - Returns: Array of video objects with metadata

- `GET /api/videos/:id` - Get video details
  - Returns: Single video object
  - Errors: 404 if video not found

- `POST /api/videos/upload` - Upload a video file
  - Content-Type: `multipart/form-data`
  - Body: `video` (file field)
  - Supported formats: `.mp4`, `.avi`, `.mov`, `.mkv`
  - Returns: Created video object (status: 201)
  - Automatically triggers video processing

- `POST /api/videos/:id/process` - Manually trigger video processing
  - Returns: Processing status (status: 202)
  - Errors: 404 if video not found

- `DELETE /api/videos/:id` - Delete a video
  - Returns: No content (status: 204)
  - Errors: 404 if video not found

### GPS Data

- `GET /api/videos/:id/gps` - Get GPS points for a video
  - Returns: Array of GPS coordinate objects
  - Includes: latitude, longitude, timestamp, speed, traffic density

## Features

### Dashboard
- Real-time statistics overview
- Total videos, processed count, vehicle counts
- Interactive charts showing vehicle type distribution
- Quick video upload interface

### Video Analysis
- Upload traffic videos for processing
- Automatic vehicle detection (cars, trucks, buses, motorcycles)
- Processing status tracking (pending → processing → completed/failed)
- Video metadata and statistics display

### Map Visualization
- Interactive Leaflet maps with GPS tracking
- Visualize vehicle movement paths
- Traffic density visualization
- Alternative route suggestions
- Dark theme map tiles

### Settings
- Application configuration
- User preferences

## Development Workflow

1. **Making Changes:**
   - Frontend changes in `client/src/` are hot-reloaded automatically
   - Backend changes in `server/` require server restart
   - Shared code in `shared/` affects both frontend and backend

2. **Database Changes:**
   - Update schema in `shared/schema.ts`
   - Run `npm run db:push` to apply changes
   - Types are automatically generated from schema

3. **Adding New Routes:**
   - Define route in `shared/routes.ts` with Zod validation
   - Implement handler in `server/routes.ts`
   - Use `buildUrl()` helper for type-safe URL construction

4. **Adding UI Components:**
   - Use shadcn/ui components from `client/src/components/ui/`
   - Create custom components in `client/src/components/`
   - Follow Tailwind CSS styling patterns

## Deployment

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates:
   - `dist/public/` - Frontend static files
   - `dist/index.cjs` - Bundled backend server

2. **Start production server:**
   ```bash
   npm start
   ```

### Environment Setup

Ensure these environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to `production` for production builds

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL is running and accessible
- Run `npm run db:push` to ensure tables exist

### Video Upload Fails
- Check file format is supported (mp4, avi, mov, mkv)
- Verify upload directory exists: `client/public/uploads/`
- Check file size limits (configured in multer)

### Build Errors
- Run `npm run check` to see TypeScript errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version matches requirements

### Video Processing Not Working
- Verify Python is installed and accessible
- Check `server/analysis.py` is executable
- Review server logs for Python script errors

## Configuration Files

- `vite.config.ts` - Vite build configuration (frontend)
- `drizzle.config.ts` - Database migration configuration
- `postcss.config.js` - PostCSS/Tailwind CSS processing
- `tailwind.config.ts` - Tailwind CSS theme and utilities
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Dependencies and scripts

## Project Structure

```
├── client/              # React frontend application
│   ├── src/
│   │   ├── pages/      # Route components
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utilities and configs
│   └── public/         # Static assets and uploads
├── server/             # Express backend API
│   ├── index.ts       # Server entry point
│   ├── routes.ts      # API route handlers
│   ├── storage.ts     # Database access layer
│   └── analysis.py    # Python video processing
├── shared/             # Shared TypeScript code
│   ├── schema.ts      # Database schema
│   └── routes.ts      # API route definitions
├── script/             # Build scripts
└── dist/              # Production build output
```