# rest-express Enterprise Management System

## Overview

This is a full-stack enterprise management system built with Express.js backend and React frontend. The application provides comprehensive business management capabilities including company management, accounting, inventory control, customer/supplier management, and cold storage operations. The system uses a PostgreSQL database with Drizzle ORM for data persistence and features a modern UI built with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing  
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for logging and error handling
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Validation**: Zod schemas for runtime type checking
- **Session Management**: Built-in session handling with PostgreSQL storage

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Database Schema (shared/schema.ts)
The system manages several core entities:
- **Users**: Authentication and role-based access
- **Companies**: Multi-tenant company management
- **Account Master**: Chart of accounts for financial tracking
- **Inventory Master**: Product catalog and stock management
- **Customers & Suppliers**: Business relationship management
- **Accounting Transactions**: Financial transaction recording
- **Inventory Transactions**: Stock movement tracking
- **Cold Storage**: Temperature-controlled inventory management
- **Crates**: Container management for storage

### API Layer (server/routes.ts)
RESTful API endpoints following standard HTTP conventions:
- Full CRUD operations for all entities
- Dashboard metrics aggregation
- Low stock alerts and inventory reporting
- Validation using shared Zod schemas
- Consistent error handling and logging

### Frontend Pages
- **Dashboard**: Key metrics and system overview
- **Company Management**: Multi-tenant company administration
- **Master Data**: Account and inventory catalog management
- **Transactions**: Financial and inventory transaction recording
- **Relationships**: Customer and supplier management
- **Cold Storage**: Specialized inventory with temperature monitoring
- **User Management**: Role-based user administration
- **Settings**: System configuration

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Processing**: Express routes validate requests with Zod schemas
3. **Database Operations**: Drizzle ORM handles PostgreSQL interactions
4. **Response Handling**: Consistent JSON responses with error handling
5. **UI Updates**: React Query automatically updates UI state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe SQL query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and development server
- **drizzle-kit**: Database migration management

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR and error overlay
- Backend: tsx with automatic restart on file changes
- Database: Drizzle push for schema synchronization

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Database: Managed PostgreSQL via environment variable

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- Automatic Replit integration for development environment

The system is designed for easy deployment on platforms like Replit, with automatic detection of the environment and appropriate tooling integration.