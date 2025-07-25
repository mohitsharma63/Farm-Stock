# Overview

This is a comprehensive business management application built with a full-stack TypeScript architecture. The system serves as an Enterprise Resource Planning (ERP) solution for managing companies, accounting, inventory, customer relationships, and cold storage operations. It follows a modern web application architecture with a React frontend, Express.js backend, and PostgreSQL database using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API structure with CRUD operations
- **Validation**: Zod schemas for runtime type validation

## Database Design
The application uses a comprehensive database schema with the following main entities:
- Users (authentication)
- Companies (multi-tenant support)
- Account Master (chart of accounts)
- Inventory Master (product catalog)
- Customers and Suppliers (relationship management)
- Transactions (financial records)
- Stock Transactions (inventory movements)
- Cold Storage Units and Transactions (specialized storage management)

# Key Components

## Authentication & Authorization
- Basic user authentication system with session management
- User roles and permissions (implementation ready)

## Business Management Modules
1. **Company Management**: Multi-company support with company profiles
2. **Master Data**: Account charts, inventory catalogs, and descriptions
3. **Accounting**: Transaction management, financial reports, and system tools
4. **Inventory Management**: Stock tracking, carrot accounts, and inventory reports
5. **Customer/Supplier Management**: Relationship and contact management
6. **Cold Storage**: Specialized storage unit management with temperature monitoring

## UI Components
- Comprehensive component library based on shadcn/ui
- Responsive design with mobile-first approach
- Dark/light theme support built-in
- Consistent styling with CSS custom properties

# Data Flow

## Request Flow
1. Client makes HTTP requests through TanStack Query
2. Express server handles routing and validation
3. Drizzle ORM manages database operations
4. PostgreSQL stores and retrieves data
5. Response flows back through the same chain

## State Management
- Server state managed by TanStack Query with caching
- Client state handled by React hooks and local component state
- Form state managed by react-hook-form with Zod validation

## Database Operations
- Type-safe database queries using Drizzle ORM
- Automatic schema generation and migrations
- Connection pooling handled by Neon Database

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Form validation with Zod
- **wouter**: Lightweight React router

## UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration tool
- **eslint/prettier**: Code quality tools (configurable)

# Deployment Strategy

## Development Environment
- Vite dev server with HMR for frontend
- tsx for running TypeScript server directly
- Environment-based configuration
- Database migrations via drizzle-kit

## Production Build
- Vite builds optimized client bundle
- esbuild compiles server code to ESM
- Static assets served from Express
- Environment variables for database connection

## Database Management
- Schema definitions in shared/schema.ts
- Migrations generated and applied via drizzle-kit
- PostgreSQL connection via environment variable
- Type-safe database operations throughout

## Key Architectural Decisions

### Monorepo Structure
- **Problem**: Managing shared types between frontend and backend
- **Solution**: Shared schema definitions and TypeScript configuration
- **Rationale**: Ensures type safety across the full stack

### ORM Choice
- **Problem**: Type safety and developer experience with database operations
- **Solution**: Drizzle ORM with PostgreSQL
- **Rationale**: Better TypeScript integration than traditional ORMs

### State Management
- **Problem**: Complex server state synchronization
- **Solution**: TanStack Query for server state, React hooks for client state
- **Rationale**: Optimized caching and background updates

### UI Component Strategy
- **Problem**: Consistent, accessible UI components
- **Solution**: shadcn/ui built on Radix UI primitives
- **Rationale**: Maintains design system consistency while ensuring accessibility