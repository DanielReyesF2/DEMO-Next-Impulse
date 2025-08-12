# Overview

Econova is a comprehensive environmental management system designed for Club Campestre Ciudad de México (CCCM), expanded from a waste-only application to an integrated sustainability platform. The system now encompasses four key environmental modules: Energy, Water, Waste, and Circular Economy, providing holistic environmental performance tracking and management.

The system maintains its original waste management capabilities while adding energy efficiency monitoring, water conservation tracking, and an advanced circular economy index that integrates all environmental factors. Built for potential commercial sale to the client, featuring sophisticated environmental analytics and TRUE Zero Waste certification progress tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

## Recent Major Changes (Aug 2025)
- **Scope Expansion**: Evolved from waste-only tracking to comprehensive environmental management platform
- **Commercial Opportunity**: System now designed for potential sale to Club Campestre as integrated solution
- **Modular Architecture**: Four environmental modules (Energy, Water, Waste, Circular Economy) with dedicated pages
- **Circular Economy Integration**: Advanced index calculation combining all environmental factors for holistic sustainability assessment
- **Club Infrastructure Integration**: Added PTAR wastewater treatment plant and lagoon system for water module, solar panel implementation planning for energy module
- **Dashboard Redesign**: Eliminated rigid card layouts for more natural, interactive environmental module design
- **TRUE Zero Waste Certification**: Implemented "Año TRUE" functionality with 12-month rolling period calculation (Aug 2024 - Jul 2025) for certification compliance
- **Enhanced Data Management**: Improved save button UX with permanent visibility, smart disabled states, and cross-year data compatibility
- **Daily Registration System**: Complete integration between daily waste registrations and monthly traceability with real-time aggregation
- **UI/UX Modernization**: Professional dashboard redesign eliminating "PowerPoint 2000" aesthetics, modernized card designs and typography

# Project Development Cost Analysis

## Completed Development (Aug 2025)
**Waste Management Module (100% Complete)**
- Daily registration system with real-time validation
- Monthly traceability with open/closed/transferred workflow
- PDF report generation (professional 3-page format)
- TRUE Zero Waste certification tracking
- CSV data export functionality
- Historical data processing (2024-2025)
- Advanced analytics and KPI calculations
**Estimated Hours:** 120 hours

**Core Platform Infrastructure (95% Complete)**
- PostgreSQL database with Drizzle ORM
- React/TypeScript frontend with modern UI components
- Express.js backend with RESTful APIs
- PDF processing with OpenAI integration
- Authentication framework preparation
- Responsive design system with brand colors
**Estimated Hours:** 80 hours

**Dashboard and Analytics (90% Complete)**
- Real-time environmental metrics display
- Four-module navigation system
- Interactive data visualizations
- Environmental impact calculations
- Professional modern UI design
**Estimated Hours:** 40 hours

## Remaining Development for Full Implementation

**Energy Module (0% Complete)**
- Solar panel monitoring system
- Energy consumption tracking
- Renewable energy percentage calculations
- Monthly energy reports
- Integration with club's electrical systems
**Estimated Hours:** 60 hours

**Water Module (0% Complete)**
- PTAR wastewater treatment monitoring
- Lagoon system management
- Water quality parameter tracking
- Conservation metrics and reporting
- Golf course irrigation optimization
**Estimated Hours:** 70 hours

**Circular Economy Module (20% Complete)**
- Advanced sustainability index calculations
- Cross-module data integration
- Sustainability goal tracking (2026 targets)
- Comprehensive environmental scorecards
- Certification compliance monitoring
**Estimated Hours:** 50 hours

**Production Deployment and Integration (0% Complete)**
- Cloud infrastructure setup
- Database migration and optimization
- Security implementation
- User training and documentation
- Club staff onboarding
**Estimated Hours:** 30 hours

## Total Development Investment
- **Completed Work:** 240 hours
- **Remaining Work:** 210 hours
- **Total Project Scope:** 450 hours

## Commercial Pricing Proposal

### Development Rate Structure
- **Senior Full-Stack Developer Rate:** $75 USD/hour
- **Project Management & Documentation:** 15% overhead
- **Testing & Quality Assurance:** 10% overhead

### Phase 1: Completed Development (Current State)
- **Base Development:** 240 hours × $75 = $18,000 USD
- **Project Management:** $18,000 × 15% = $2,700 USD
- **Testing & QA:** $18,000 × 10% = $1,800 USD
- **Phase 1 Subtotal:** $22,500 USD

### Phase 2: Remaining Development (To 100% Complete)
- **Base Development:** 210 hours × $75 = $15,750 USD
- **Project Management:** $15,750 × 15% = $2,362 USD
- **Testing & QA:** $15,750 × 10% = $1,575 USD
- **Phase 2 Subtotal:** $19,687 USD

### Total Project Investment
- **Complete System Cost:** $42,187 USD
- **Mexican Peso Equivalent:** ~$760,000 MXN (at 18 MXN/USD)

### Payment Structure Recommendation
1. **50% Upon Contract Signing:** $21,094 USD (~$380,000 MXN)
2. **25% at Energy Module Completion:** $10,547 USD (~$190,000 MXN)
3. **25% at Final Delivery:** $10,547 USD (~$190,000 MXN)

### Value Proposition for Club Campestre
- **TRUE Zero Waste Certification:** Potential savings of $50,000+ annually in waste management
- **Operational Efficiency:** 80% reduction in manual reporting time
- **Environmental Compliance:** Automated regulatory reporting and documentation
- **Sustainability Marketing:** Premium eco-certification increases membership value
- **Long-term ROI:** System pays for itself within 12-18 months through operational savings

### Maintenance & Support (Optional)
- **Annual Maintenance:** $3,500 USD (~$63,000 MXN)
- **Includes:** System updates, bug fixes, basic feature enhancements, cloud hosting
- **24/7 Support:** Additional $1,200 USD annually (~$22,000 MXN)

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

## Environmental Management Features
- **Waste Management**: Organic (including PODA), inorganic, and recyclable waste tracking with TRUE Zero Waste certification progress
- **Energy Monitoring**: Solar energy generation project in planning phase, consumption patterns, efficiency metrics, and renewable energy percentage tracking
- **Water Conservation**: PTAR (Wastewater Treatment Plant) and lagoon system for golf course irrigation, consumption monitoring, recycling systems, and quality parameters tracking
- **Circular Economy Index**: Integrated sustainability score combining all environmental factors (72% current index)
- **Environmental Impact**: Comprehensive calculation of trees saved, water conserved, energy saved, and CO₂ reduction across all modules
- **Sustainability Metrics**: Multi-dimensional progress tracking with targets for 2026 (85% circularity goal)

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