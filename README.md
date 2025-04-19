# G_Client Learning Management System (LMS)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![LMS Architecture Diagram](./lms.png)

A full-stack learning management system with robust admin controls, user management, and comprehensive course administration capabilities.

## 📌 Features

### Core Functionality

- **Multi-role Authentication System**
  - JWT-based authentication for users and admins
  - OTP verification flow
  - Password reset and recovery
- **Course Management**
  - Course creation and categorization
  - Enrollment tracking
  - Progress monitoring
- **Financial Modules**
  - Invoice generation
  - Revenue tracking
  - Discount management
- **Administration**
  - User/Admin account lifecycle management
  - Role-based access control (RBAC)
  - Audit logging

### Technical Highlights

- RESTful API architecture
- Swagger/OpenAPI 3.0 documentation
- Rate limiting and request validation
- Error handling middleware stack
- MongoDB data modeling
- Secure session management
- Automated email services

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Redis (for session caching)
- SMTP email service credentials

### Installation

# Clone repository

git clone https://github.com/ressuman/Learning-Application-Management-System-Backend-Project.git

# Install dependencies

npm install

# Create environment file

cp .env.example .env

# Start development server

npm run dev

## ⚙️ Configuration

Update `.env` file with your credentials:

```env
PORT=4200
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=30d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=email_password
SESSION_SECRET=session_secret_key
```

## 📚 API Documentation

Interactive API documentation available at `/api-docs` endpoint after starting the server:

![Swagger UI Preview](https://via.placeholder.com/800x400.png?text=Swagger+API+Documentation)

**Key Endpoint Groups:**

- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/profile/*` - User profile management
- `/api/v1/courses/*` - Course administration
- `/api/v1/invoices/*` - Financial operations
- `/api/v1/accounts/admin/*` - Admin-specific controls

## 🗂 Project Structure

```plaintext
├── config/              # Configuration files
│   ├── db.js           # Database connection
│   └── passport/       # Authentication strategies
│
├── controllers/        # Business logic
│   ├── admins/         # Admin controllers
│   ├── users/          # User controllers
│   └── others/         # Course/Financial controllers
│
├── models/             # MongoDB schemas
│   ├── users/          # User models
│   └── others/         # Course/Financial models
│
├── routes/             # API endpoints
│   ├── admins/         # Admin routes
│   ├── users/          # User routes
│   └── others/         # Course/Financial routes
│
├── middlewares/        # Custom middleware
│   ├── errorHandler.js # Error processing
│   └── authorizeRole.js # RBAC implementation
│
├── utils/              # Helper functions
│   ├── createToken.js  # JWT generation
│   └── generateOTP.js  # OTP management
│
└── docs/               # API documentation
    └── api.js          # Swagger configuration
```

## 🔒 Security Practices

1. **Input Validation**
   - XSS protection middleware
   - HPP parameter pollution protection
2. **Access Control**
   - Role-based endpoint authorization
   - Rate limiting (100 requests/15min)
3. **Data Protection**
   - Password hashing with bcrypt
   - JWT encryption
   - Secure cookies
4. **Operational Security**
   - Helmet security headers
   - CORS origin restriction
   - Session encryption

## 🛠 Development

```bash
# Run in development mode
npm run dev

# Run tests (add your test scripts)
npm test

# Production build
npm run build

# Start in production
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the GNU GPLv3 License. See `LICENSE` for more information.

## 📧 Contact

**Richard Essuman** - [ressuman001@gmail.com](mailto:ressuman001@gmail.com)
**Project Repository**: [GitHub Link](https://github.com/ressuman/Learning-Application-Management-System-Backend-Project.git)

---

> **Note**: This documentation is automatically generated from the OpenAPI specification. For detailed endpoint documentation, explore the interactive Swagger UI at `/api-docs`.

```

This README includes:
1. Comprehensive feature overview
2. Detailed installation instructions
3. API documentation integration
4. Complete project structure breakdown
5. Security implementation details
6. Development workflow guidance
7. License and contact information


```

## Image

Here is an expected gif/photos of the preview of the App(LMS App)

## ![LMS image](./lms.png)
