# Overview

Econova is a comprehensive environmental waste management system designed to track, analyze, and optimize waste management practices for businesses. The application is specifically tailored for Club Campestre Ciudad de México (CCCM), tracking various types of waste including organic, inorganic, recyclable materials, and PODA (pruning) waste. The system supports sustainability certification processes like TRUE Zero Waste and provides detailed environmental impact analysis.

The application features a React-based frontend with TypeScript, an Express.js backend, and uses PostgreSQL for data persistence. It includes PDF document processing capabilities, report generation, and comprehensive dashboards for waste management analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Styling**: Tailwind CSS with custom design system using navy (#273949) and lime (#b5e951) brand colors
- **UI Components**: Radix UI headless components with shadcn/ui design system
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization and analytics dashboards

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with structured error handling
- **File Processing**: Multer for file uploads with PDF processing capabilities
- **External APIs**: OpenAI integration for document analysis and data extraction

## Data Storage Solutions
- **Database**: PostgreSQL with connection pooling via Neon Serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Structured schema with clients, documents, waste_data, and alerts tables
- **Migrations**: Drizzle Kit for database schema management and migrations

## Authentication and Authorization
- **Current State**: No authentication system implemented (internal application)
- **Session Management**: Basic session handling through Express middleware
- **Access Control**: Client-based data isolation through database queries

## Data Processing Pipeline
- **Document Upload**: Multi-part form uploads stored in local filesystem
- **PDF Analysis**: Combination of filename pattern matching and OpenAI-powered content extraction
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Automated Processing**: Background processing of uploaded documents with error handling

## Waste Management Features
- **Waste Categories**: Organic (including PODA), inorganic, and recyclable waste tracking
- **Environmental Impact**: Calculation of trees saved, water conserved, and energy saved
- **Deviation Tracking**: Sanitary landfill deviation percentage calculation
- **Sustainability Metrics**: Progress tracking toward TRUE Zero Waste certification

## Report Generation
- **PDF Reports**: jsPDF-based comprehensive sustainability reports
- **Data Export**: CSV export functionality for waste data
- **Period Selection**: Configurable reporting periods (monthly, quarterly, annual)
- **Brand Integration**: Custom branded reports with client logos and corporate identity

# External Dependencies

## Database and Infrastructure
- **Neon Serverless**: PostgreSQL database hosting with connection pooling
- **WebSocket Support**: Real-time capabilities through ws library for database connections

## PDF Processing and Generation
- **jsPDF**: Client-side PDF generation for reports and documentation
- **jsPDF AutoTable**: Table generation plugin for structured data presentation
- **OpenAI API**: GPT-4o model for intelligent document content extraction and analysis

## UI and Design
- **Radix UI**: Headless component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom brand configuration
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Anton and Ruda font families for brand typography

## Development Tools
- **Vite**: Build tool with HMR and development server
- **Replit Integration**: Development environment integration with cartographer and error modal plugins
- **TypeScript**: Type safety across the entire application stack
- **ESLint/Prettier**: Code quality and formatting tools

## File Processing
- **Multer**: Express middleware for handling multipart/form-data uploads
- **Canvas**: Node.js Canvas API for image processing and manipulation
- **PapaParse**: CSV parsing library for data import/export functionality

## Additional Libraries
- **Class Variance Authority**: Utility for creating type-safe component variants
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date utility library for temporal data manipulation
- **CMDK**: Command palette component for enhanced user interactions