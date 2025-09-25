# OMOP Cohort Analysis Application

A full-stack web application for building and analyzing disease cohorts using OMOP CDM (Observational Medical Outcomes Partnership Common Data Model) data. This application enables researchers to compare disease vs. non-disease groups across various clinical measurements with interactive visualizations.

## 🚀 Features

### Authentication System
- User registration and login
- JWT-based authentication
- Password reset functionality (mock implementation)

### Cohort Analysis
- **Disease Selection**: Choose from Cancer, Diabetes, Hypertension, or Chronic Kidney Disease
- **Cohort Construction**: Automatic creation of disease vs. non-disease groups
- **Measurement Comparison**: Analyze Hemoglobin, Glucose, or Blood Pressure measurements
- **Interactive Visualizations**:
  - Age group and sex distribution comparisons
  - Box plots with hover tooltips and zoom capabilities
  - Export charts as PNG and PDF
- **Statistical Analysis**: Summary statistics including median, quartiles, and effect sizes

### Data Management
- Built on OMOP CDM v5.4 schema
- Uses SQLite database with sample synthetic data
- Handles missing data gracefully with clear error messaging

## 🏗️ Architecture

### Backend (Node.js/Express/TypeScript)
- RESTful API with authentication middleware
- SQLite database with OMOP CDM schema
- Cohort construction using condition_occurrence and concept tables
- Measurement extraction from measurement table

### Frontend (React/TypeScript)
- Modern React with hooks and context API
- Recharts for data visualizations
- TailwindCSS for responsive design
- HTML2Canvas and jsPDF for chart exports

### OMOP Tables Used

The application uses the following OMOP CDM tables:

1. **person** - Demographics and patient information
2. **condition_occurrence** - Disease diagnoses and conditions
3. **concept** - Standardized medical concepts and terminologies
4. **measurement** - Laboratory values and clinical measurements

### Cohort Construction Logic

**Disease Cohort**: Patients with at least one condition occurrence record matching the selected disease concept ID in the condition_occurrence table.

**Non-Disease Cohort**: All patients in the person table who do not have any condition occurrence records matching the selected disease concept.

The concept mapping uses the following standard OMOP concept IDs:
- Cancer: 443392 (Malignant neoplastic disease)
- Diabetes: 201820 (Diabetes mellitus)
- Hypertension: 316866 (Hypertensive disorder)
- Chronic Kidney Disease: 46271022 (Chronic kidney disease)

## 🐋 Docker Deployment

### Quick Start

**Note**: Due to native module architecture compatibility issues in Docker with ARM64/Apple Silicon, the containerized version may encounter SQLite binding errors. The application works perfectly in development mode.

#### Development Mode (Recommended)

```bash
# Clone the repository
git clone test-claude-code
cd test-claude-code

# Install dependencies
npm run install:all

# Run in development mode
npm run dev
```

Access the application at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

#### Docker Deployment (x86_64 Linux)

```bash
# Build and run with Docker
docker build -t omop-cohort-app .
docker run -p 8000:80 -p 3000:3000 omop-cohort-app
```

Access the application at: http://localhost:8000

**Note**: Docker deployment works best on x86_64 Linux systems. For Apple Silicon/ARM64, use development mode.

### Development with Docker Compose

```bash
# Development mode with hot reload
docker-compose -f docker-compose.yml up dev
```

### Production Deployment

```bash
# Production build
docker-compose up app
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies for all packages
npm run install:all

# Start development servers
npm run dev
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:3001

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

**backend/.env**:
```
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
DATABASE_PATH=./database/omop.db
```

**frontend/.env**:
```
REACT_APP_API_URL=http://localhost:3000/api
```

## 📖 Usage Guide

### 1. User Authentication

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Password Reset**: Use the "Forgot Password" option (mock implementation)

### 2. Disease Selection

1. Navigate to the dashboard after login
2. Select a disease from the dropdown (Cancer, Diabetes, Hypertension, or Chronic Kidney Disease)
3. The system will automatically build disease vs. non-disease cohorts

### 3. Cohort Analysis

After selecting a disease, you'll see:
- **Cohort Statistics**: Patient counts and demographic breakdowns
- **Age/Sex Distributions**: Comparative bar charts showing demographic differences

### 4. Measurement Comparison

1. Choose a measurement outcome (Hemoglobin, Glucose, Systolic BP, or Diastolic BP)
2. View the interactive box plot comparing disease vs. non-disease groups
3. Examine detailed summary statistics including:
   - Sample sizes (n)
   - Median, P25, P75 values
   - Effect size (Cohen's d)
   - Clinical interpretation

### 5. Data Export

- **PNG Export**: Click "Export PNG" to download charts as images
- **PDF Export**: Click "Export PDF" to generate publication-ready charts

## 🧪 Sample Data

The application includes synthetic OMOP data with:
- 10 sample patients with mixed demographics
- Various disease conditions (diabetes, cancer, hypertension, CKD)
- Laboratory measurements (glucose, hemoglobin, blood pressure)
- Realistic value ranges for different conditions

## 🔧 Technical Details

### Database Schema

The application implements core OMOP CDM v5.4 tables:

```sql
-- Core tables
person (demographics)
concept (medical terminologies)
condition_occurrence (diagnoses)
measurement (lab values)

-- Key indexes for performance
idx_condition_person, idx_condition_concept
idx_measurement_person, idx_measurement_concept
```

### API Endpoints

```
POST /api/auth/register     - User registration
POST /api/auth/login        - User authentication
POST /api/auth/reset-password - Password reset
GET  /api/cohort/diseases   - Available diseases
POST /api/cohort/build      - Build cohorts
POST /api/cohort/compare    - Compare measurements
GET  /api/measurement/list  - Available measurements
```

### Error Handling

- Comprehensive error handling for missing data
- Clear user-facing error messages
- Graceful degradation when data is unavailable
- Loading states for all async operations

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Integration testing with Docker
docker-compose up app
# Navigate to http://localhost:8000 and test manually
```

## 📊 Data Sources

This application is designed to work with OMOP CDM data. For real-world deployment:

1. **Public OMOP SynPUF Data**:
   - AWS Open Data registry: https://registry.opendata.aws/cmsdesynpuf-omop/
   - Access via: `aws s3 ls --no-sign-request s3://synpuf-omop/`

2. **OMOP CDM Documentation**:
   - Schema: https://ohdsi.github.io/CommonDataModel/cdm54.html
   - OHDSI Community: https://ohdsi.org/

## 🤝 Development Notes

### AI Usage Declaration

This coding assessment was developed with assistance from Claude (Anthropic). The AI was used for:

- **Code Generation**: Writing TypeScript/React components, backend API routes, and SQL schema
- **Architecture Planning**: Designing the overall application structure and data flow
- **Documentation**: Creating comprehensive README and code comments
- **Problem Solving**: Debugging integration issues and optimization suggestions

Prompts used included:
- "Create a full-stack OMOP cohort analysis application with React frontend and Node.js backend"
- "Implement interactive box plots with export functionality using Recharts"
- "Design OMOP CDM database schema for cohort analysis with proper indexing"
- "Create comprehensive documentation and Docker deployment configuration"

All generated code was reviewed and customized for the specific requirements.

### Performance Considerations

- Database indexes on frequently queried columns
- Responsive design for mobile devices
- Lazy loading of large datasets
- Efficient state management with React Context
- Optimized chart rendering with Recharts

### Security Features

- JWT authentication with secure token storage
- Password hashing with bcrypt
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Environment-based configuration

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Check the application logs for detailed error messages
- Ensure all environment variables are properly configured
- Verify Docker containers are running correctly
- Review the sample data structure for debugging

## 🚀 Future Enhancements

Potential improvements for production use:
- Integration with real OMOP CDM databases (PostgreSQL, SQL Server)
- Advanced statistical tests (t-tests, Mann-Whitney U)
- Survival analysis and time-to-event modeling
- Multi-site federated analysis capabilities
- Role-based access control (RBAC)
- Audit logging and data governance features
