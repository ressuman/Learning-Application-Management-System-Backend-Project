export const apiDocumentation = {
  openapi: "3.0.0",
  info: {
    title:
      "G_Client Learning Application Management System (LMS) Admin Backend API",
    version: "1.0.0",
    description:
      "## Overview\n" +
      "A enterprise-grade Learning Management System backend solution providing complete administrative control " +
      "and management capabilities for educational institutions and corporate training programs.\n\n" +
      "## Key Features\n" +
      "- **Role-Based Access Control (RBAC)** with hierarchical admin privileges\n" +
      "- **JWT Authentication** with refresh token rotation security\n" +
      "- **Audit Logging** for all administrative actions\n" +
      "- **Multi-Tenancy Support** for institutional deployments\n" +
      "- **Data Encryption** both at rest and in transit\n" +
      "- **Rate Limiting** and API request quotas\n\n" +
      "## Core Capabilities\n" +
      "- Complete user lifecycle management (CRUD operations)\n" +
      "- Course catalog administration and content scheduling\n" +
      "- Real-time analytics and reporting dashboard integration\n" +
      "- Batch operations for bulk user/course management\n" +
      "- Webhook integrations for third-party services\n" +
      "- Comprehensive API documentation with interactive examples\n\n" +
      "## Security Standards\n" +
      "- OAuth 2.0 compliant authorization flows\n" +
      "- Regular security audits and penetration testing\n" +
      "- PCI DSS compliant payment integrations (when applicable)\n" +
      "- GDPR-ready data protection controls\n\n" +
      "## Technical Specifications\n" +
      "- **RESTful** architecture with JSON payloads\n" +
      "- **OpenAPI 3.0** specification compliance\n" +
      "- **PostgreSQL** database with Redis caching\n" +
      "- **Node.js** runtime environment\n" +
      "- **Horizontal scaling** capabilities\n\n" +
      "## Modules\n" +
      "1. **Authentication Module** - Secure admin onboarding and session management\n" +
      "2. **Authorization Module** - Fine-grained permissions system\n" +
      "3. **User Management** - Complete learner/instructor profiles\n" +
      "4. **Content Management** - Course materials and curriculum builder\n" +
      "5. **Analytics Engine** - Real-time reporting and data exports",
    contact: {
      name: "Richard Essuman | Lead Developer & Architect",
      email: "ressuman001@gmail.com",
      url: "https://github.com/ressuman/Learning-Application-Management-System-Backend-Project.git",
    },
  },
  termsOfService: "http://swagger.io/terms/",
  license: {
    name: "Apache 2.0",
    url: "http://www.apache.org/licenses/LICENSE-2.0.html",
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
  },
  servers: [
    {
      url: "http://localhost:4200",
      description: "Local development server  (HTTP)",
    },
    {
      url: "https://ressuman-learning-management-system-backend-directory-api.vercel.app",
      description: "Production server  (HTTPS)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Admin: {
        type: "object",
        properties: {
          first_name: { type: "string", example: "John" },
          last_name: { type: "string", example: "Doe" },
          email: { type: "string", example: "admin@example.com" },
          contact: { type: "string", example: "+233123456789" },
          isVerified: { type: "boolean", example: true },
          isDeleted: { type: "boolean", example: false },
        },
      },
      User: {
        type: "object",
        properties: {
          username: { type: "string", example: "johndoe" },
          email: { type: "string", example: "user@example.com" },
          isVerified: { type: "boolean", example: true },
          isDeleted: { type: "boolean", example: false },
        },
      },
      Learner: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64b7c2e9c8b6c" },
          firstname: { type: "string", example: "John" },
          lastname: { type: "string", example: "Doe" },
          email: { type: "string", example: "learner@example.com" },
          gender: { type: "string", enum: ["Male", "Female", "Other"] },
          location: { type: "string", example: "Accra, Ghana" },
          phone: { type: "string", example: "+233123456789" },
          disability: { type: "string", example: "None" },
          image: { type: "string", example: "profile.jpg" },
          description: {
            type: "string",
            example: "Software engineering student",
          },
          registrationFee: { type: "number", example: 10 },
          registrationFeePaid: { type: "boolean", example: false },
          totalCourseFees: { type: "number", example: 200 },
          balance: { type: "number", example: 210 },
          courses: {
            type: "array",
            items: { $ref: "#/components/schemas/Course" },
          },
          discounts: {
            type: "object",
            properties: {
              registration: { type: "number", example: 10 },
              courses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    course: { $ref: "#/components/schemas/Course" },
                    discount: { type: "number", example: 15 },
                  },
                },
              },
            },
          },
          financialSummary: {
            type: "object",
            properties: {
              totalOwed: { type: "number", example: 210 },
              registrationFee: { type: "number", example: 10 },
              registrationFeePaid: { type: "boolean", example: false },
              totalCourseFees: { type: "number", example: 200 },
              paymentsMade: { type: "number", example: 0 },
            },
          },
        },
      },
      Course: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64b7c2e9c8b6c" },
          title: { type: "string", example: "Introduction to Programming" },
          description: {
            type: "string",
            example: "Basic programming concepts",
          },
          duration: { type: "string", example: "6 weeks" },
          basePrice: { type: "number", example: 100 },
          discount: { type: "number", example: 15 },
          discountedPrice: { type: "number", example: 85 },
          learners: {
            type: "array",
            items: { $ref: "#/components/schemas/Learner" },
          },
          isDeleted: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Invoice: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64b7c2e9c8b6c" },
          learnerId: { $ref: "#/components/schemas/Learner" },
          courseId: { $ref: "#/components/schemas/Course" },
          amount: { type: "number", example: 500 },
          status: {
            type: "string",
            enum: ["Pending", "Paid", "Overdue", "Voided"],
          },
          installments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                dueDate: { type: "string", format: "date-time" },
                amount: { type: "number" },
                status: {
                  type: "string",
                  enum: ["Pending", "Paid", "Overdue"],
                },
              },
            },
          },
          totalAmount: { type: "number", example: 1500 },
          discountApplied: { type: "number", example: 10 },
          remainingBalance: { type: "number", example: 1000 },
        },
      },
      Revenue: {
        type: "object",
        properties: {
          totalRevenue: { type: "number", example: 15000 },
          invoices: {
            type: "array",
            items: { $ref: "#/components/schemas/Invoice" },
          },
          revenueEntries: {
            type: "array",
            items: { $ref: "#/components/schemas/RevenueEntry" },
          },
        },
      },
      RevenueEntry: {
        type: "object",
        properties: {
          date: { type: "string", format: "date-time" },
          amount: { type: "number", example: 500 },
          invoice: { $ref: "#/components/schemas/Invoice" },
        },
      },
    },
    PaginationMetadata: {
      type: "object",
      properties: {
        currentPage: { type: "integer", example: 1 },
        totalPages: { type: "integer", example: 10 },
        totalItems: { type: "integer", example: 100 },
        itemsPerPage: { type: "integer", example: 10 },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        status: { type: "string", example: "error" },
        message: { type: "string", example: "Error message" },
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication required",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { message: "Not authenticated" },
          },
        },
      },
      Forbidden: {
        description: "Insufficient permissions",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { message: "Access denied. Admins only" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { message: "User not found" },
          },
        },
      },
      BadRequest: {
        description: "Invalid request parameters",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { message: "Validation error" },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/v1/auth/admin/signup": {
      post: {
        tags: ["Admin Authentication"],
        summary: "Register new admin",
        description: "Admin registration with email verification OTP",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "first_name",
                  "last_name",
                  "email",
                  "password",
                  "passwordConfirm",
                  "contact",
                ],
                properties: {
                  first_name: { type: "string", example: "John" },
                  last_name: { type: "string", example: "Doe" },
                  email: { type: "string", example: "admin@example.com" },
                  password: { type: "string", example: "AdminPass123!" },
                  passwordConfirm: { type: "string", example: "AdminPass123!" },
                  contact: { type: "string", example: "+233123456789" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Admin created - OTP sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example:
                        "Admin registered successfully. Please check your email for OTP.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email already exists",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Email sending failure",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email could not be sent",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/admin/signin": {
      post: {
        tags: ["Admin Authentication"],
        summary: "Admin login",
        description: "Authenticate admin with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                  password: { type: "string", example: "AdminPass123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Admin logged in successfully",
                    },
                    token: {
                      type: "string",
                      example: "Bearer eyJhbGciOiJIUz...",
                    },
                    data: {
                      type: "object",
                      properties: {
                        admin: { $ref: "#/components/schemas/Admin" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please provide email and password",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Invalid credentials" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/admin/check-auth": {
      get: {
        tags: ["Admin Authentication"],
        summary: "Check admin authentication status",
        description: "Verify valid admin JWT token",
        responses: {
          200: {
            description: "Authentication valid",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Admin authenticated" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "64b7c2e9c8b6c" },
                        email: { type: "string", example: "admin@example.com" },
                        isVerified: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/admin/signout": {
      post: {
        tags: ["Admin Authentication"],
        summary: "Admin logout",
        description: "Invalidate admin authentication token",
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Admin logged out successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/user/signup": {
      post: {
        tags: ["User Authentication"],
        summary: "Register new user",
        description: "User registration with email verification OTP flow",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password", "passwordConfirm"],
                properties: {
                  username: {
                    type: "string",
                    example: "JohnDoe",
                    minLength: 3,
                    maxLength: 30,
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    example: "SecurePass123!",
                    minLength: 6,
                  },
                  passwordConfirm: {
                    type: "string",
                    example: "SecurePass123!",
                    minLength: 6,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created - OTP sent to email",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example:
                        "User registered successfully. Please check email for OTP.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email already exists",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Email sending failure",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email could not be sent",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/user/signin": {
      post: {
        tags: ["User Authentication"],
        summary: "Authenticate user",
        description: "User login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "SecurePass123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User logged in successfully",
                    },
                    token: {
                      type: "string",
                      example: "Bearer eyJhbGciOiJIUz...",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          type: "object",
                          properties: {
                            _id: { type: "string", example: "64b7c2e9c8b6c" },
                            username: { type: "string", example: "JohnDoe" },
                            email: {
                              type: "string",
                              example: "user@example.com",
                            },
                            isVerified: { type: "boolean", example: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Please provide email and password",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid email or password",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/user/check-auth": {
      get: {
        tags: ["User Authentication"],
        summary: "Check user authentication status",
        description: "Verify valid user JWT token",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Authenticated user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User authenticated" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "64b7c2e9c8b6c" },
                        email: { type: "string", example: "user@example.com" },
                        isVerified: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User not authenticated",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/user/signout": {
      post: {
        tags: ["User Authentication"],
        summary: "User logout",
        description: "Invalidate user authentication token",
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User logged out successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/otp/user/verify-account/user": {
      post: {
        tags: ["User OTP Management"],
        summary: "Verify user account with OTP",
        description: "Complete user registration by verifying email with OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "OTP"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  OTP: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Account verified successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Email verification successful",
                    },
                    token: {
                      type: "string",
                      example: "Bearer eyJhbGciOiJIUz...",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          type: "object",
                          properties: {
                            _id: { type: "string", example: "64b7c2e9c8b6c" },
                            username: { type: "string", example: "JohnDoe" },
                            email: {
                              type: "string",
                              example: "user@example.com",
                            },
                            isVerified: { type: "boolean", example: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid OTP or expired",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid OTP. Please try again.",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/otp/user/resend-OTP/user": {
      post: {
        tags: ["User OTP Management"],
        summary: "Resend verification OTP to user",
        description: "Resend email verification OTP for user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "New OTP sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "A new OTP has been sent to your email address.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Account already verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "This user account is already verified",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/password/user/forgot-password": {
      post: {
        tags: ["User Password Management"],
        summary: "Initiate user password reset",
        description: "Send password reset OTP to user's email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example:
                        "OTP sent to your email. Please check your inbox.",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/password/user/reset-password": {
      post: {
        tags: ["User Password Management"],
        summary: "Reset user password with OTP",
        description: "Complete password reset using OTP sent to email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "OTP", "newPassword", "newPasswordConfirm"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  OTP: { type: "string", example: "123456" },
                  newPassword: { type: "string", example: "NewSecurePass123!" },
                  newPasswordConfirm: {
                    type: "string",
                    example: "NewSecurePass123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example:
                        "Password reset successfully. Please log in with new password.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid OTP or passwords mismatch",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid or expired OTP",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/otp/user/verify-account/admin": {
      post: {
        tags: ["User OTP Management"],
        summary: "Verify admin-created user profile",
        description: "Verify user account created by admin using OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "OTP"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  OTP: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Account verification successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User account verified successfully",
                    },
                    token: {
                      type: "string",
                      example: "Bearer eyJhbGciOiJIUz...",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidOTP: {
                    value: { message: "Invalid OTP. Please try again" },
                  },
                  expiredOTP: { value: { message: "OTP has expired" } },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/otp/user/resend-OTP/admin": {
      post: {
        tags: ["User OTP Management"],
        summary: "Resend OTP for admin-created profile",
        description: "Resend verification OTP for admin-created user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "New OTP sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "New OTP sent to email",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Account already verified",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Email sending failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/otp/admin/verify-account": {
      post: {
        tags: ["Admin OTP Management"],
        summary: "Verify admin account",
        description: "Complete admin registration with OTP verification",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "OTP"],
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                  OTP: { type: "string", example: "654321" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Admin account verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Admin account activated successfully",
                    },
                    token: {
                      type: "string",
                      example: "Bearer eyJhbGciOiJIUz...",
                    },
                    data: {
                      type: "object",
                      properties: {
                        admin: { $ref: "#/components/schemas/Admin" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Verification error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidOTP: { value: { message: "Invalid OTP" } },
                  alreadyVerified: {
                    value: { message: "Account already verified" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/otp/admin/resend-OTP": {
      post: {
        tags: ["Admin OTP Management"],
        summary: "Resend admin verification OTP",
        description: "Resend OTP for admin account verification",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP resent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "New OTP sent to email",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Admin not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/password/admin/forgot-password": {
      post: {
        tags: ["Admin Password Management"],
        summary: "Request admin password reset",
        description: "Initiate password reset process for admin accounts",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Reset OTP sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "OTP sent to registered email",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Admin not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/password/admin/reset-password": {
      post: {
        tags: ["Admin Password Management"],
        summary: "Reset admin password",
        description: "Complete password reset using OTP verification",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "OTP", "newPassword", "newPasswordConfirm"],
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                  OTP: { type: "string", example: "987654" },
                  newPassword: { type: "string", example: "NewSecurePass123!" },
                  newPasswordConfirm: {
                    type: "string",
                    example: "NewSecurePass123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Password updated successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  passwordMismatch: {
                    value: { message: "Passwords do not match" },
                  },
                  invalidOTP: { value: { message: "Invalid or expired OTP" } },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/profile/user/get-profile": {
      get: {
        tags: ["User Profile"],
        summary: "Get user profile",
        description: "Retrieve authenticated user's profile information",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User profile retrieved successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/v1/profile/user/update-profile": {
      put: {
        tags: ["User Profile"],
        summary: "Update user profile",
        description: "Update authenticated user's profile information",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "new_username" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "new@example.com",
                  },
                  password: { type: "string", example: "NewPass123!" },
                  passwordConfirm: { type: "string", example: "NewPass123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User profile updated successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/profile/user/delete-profile": {
      delete: {
        tags: ["User Profile"],
        summary: "Delete user profile",
        description: "Soft delete authenticated user's account",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User profile deleted successfully",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/profile/admin/get-profile": {
      get: {
        tags: ["Admin Profile"],
        summary: "Get admin profile",
        description: "Retrieve authenticated admin's profile information",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Admin profile retrieved successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        admin: { $ref: "#/components/schemas/Admin" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/profile/admin/update-profile": {
      put: {
        tags: ["Admin Profile"],
        summary: "Update admin profile",
        description: "Update authenticated admin's profile information",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  first_name: { type: "string", example: "NewFirstName" },
                  last_name: { type: "string", example: "NewLastName" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "new@example.com",
                  },
                  contact: { type: "string", example: "+233987654321" },
                  password: { type: "string", example: "NewAdminPass123!" },
                  passwordConfirm: {
                    type: "string",
                    example: "NewAdminPass123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Admin profile updated successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        admin: { $ref: "#/components/schemas/Admin" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/v1/profile/admin/delete-profile": {
      delete: {
        tags: ["Admin Profile"],
        summary: "Delete admin profile",
        description: "Soft delete authenticated admin's account",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Profile deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Admin profile deleted successfully",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/accounts/admin/create-user-account": {
      post: {
        tags: ["Admin User Management"],
        summary: "Create new user account",
        description:
          "Create a new user account (admin only, requires OTP verification)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password", "passwordConfirm"],
                properties: {
                  username: { type: "string", example: "new_user" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "user@example.com",
                  },
                  password: { type: "string", example: "UserPass123!" },
                  passwordConfirm: { type: "string", example: "UserPass123!" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User account created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User profile created successfully",
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/api/v1/accounts/admin/get-user-account/{userId}": {
      get: {
        tags: ["Admin User Management"],
        summary: "Get user by ID",
        description: "Retrieve user details by user ID (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "User details retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/v1/accounts/admin/get-all-user-accounts": {
      get: {
        tags: ["Admin User Management"],
        summary: "List all users",
        description: "Retrieve paginated list of all users (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Users list retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    results: { type: "integer", example: 10 },
                    totalUsers: { type: "integer", example: 100 },
                    currentPage: { type: "integer", example: 1 },
                    totalPages: { type: "integer", example: 10 },
                    data: {
                      type: "object",
                      properties: {
                        users: {
                          type: "array",
                          items: { $ref: "#/components/schemas/User" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/accounts/admin/update-user-account/{userId}": {
      put: {
        tags: ["Admin User Management"],
        summary: "Update user account",
        description: "Update user details by ID (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "updated_user" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "updated@example.com",
                  },
                  password: { type: "string", example: "NewPass123!" },
                  passwordConfirm: { type: "string", example: "NewPass123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/accounts/admin/delete-user-account/{userId}": {
      delete: {
        tags: ["Admin User Management"],
        summary: "Delete user account",
        description: "Soft delete user account by ID (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "User profile deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/learners/admin/create-learner": {
      post: {
        tags: ["Learner Management"],
        summary: "Create new learner",
        description: "Create a new learner profile (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "firstname",
                  "lastname",
                  "email",
                  "gender",
                  "location",
                  "phone",
                ],
                properties: {
                  firstname: { type: "string", example: "John" },
                  lastname: { type: "string", example: "Doe" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "learner@example.com",
                  },
                  gender: {
                    type: "string",
                    enum: ["Male", "Female", "Other"],
                    example: "Male",
                  },
                  location: { type: "string", example: "Accra, Ghana" },
                  phone: { type: "string", example: "+233123456789" },
                  disability: { type: "string", example: "None" },
                  image: { type: "string", example: "profile.jpg" },
                  description: {
                    type: "string",
                    example: "Software engineering student",
                  },
                  courses: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "mongoId",
                      example: "64b7c2e9c8b6c",
                    },
                  },
                  discounts: {
                    type: "object",
                    properties: {
                      registration: {
                        type: "number",
                        minimum: 0,
                        maximum: 100,
                        example: 10,
                      },
                      courses: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            course: {
                              type: "string",
                              format: "mongoId",
                              example: "64b7c2e9c8b6c",
                            },
                            discount: {
                              type: "number",
                              minimum: 0,
                              maximum: 100,
                              example: 15,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Learner created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Learner created successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        learner: { $ref: "#/components/schemas/Learner" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/api/v1/learners/admin/all-learners": {
      get: {
        tags: ["Learner Management"],
        summary: "List all learners",
        description: "Retrieve paginated list of learners (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Learners list retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    results: { type: "integer", example: 10 },
                    totalLearners: { type: "integer", example: 100 },
                    currentPage: { type: "integer", example: 1 },
                    totalPages: { type: "integer", example: 10 },
                    data: {
                      type: "object",
                      properties: {
                        learners: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Learner" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/learners/admin/get-learner/{learnerId}": {
      get: {
        tags: ["Learner Management"],
        summary: "Get learner details",
        description: "Retrieve detailed information about a specific learner",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "learnerId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Learner details retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        learner: { $ref: "#/components/schemas/Learner" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/v1/learners/admin/update-learner/{learnerId}": {
      put: {
        tags: ["Learner Management"],
        summary: "Update learner details",
        description: "Update learner information (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "learnerId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstname: { type: "string", example: "UpdatedFirstName" },
                  lastname: { type: "string", example: "UpdatedLastName" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "updated@example.com",
                  },
                  phone: { type: "string", example: "+233987654321" },
                  courses: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "mongoId",
                      example: "64b7c2e9c8b6c",
                    },
                  },
                  discounts: {
                    type: "object",
                    properties: {
                      registration: {
                        type: "number",
                        minimum: 0,
                        maximum: 100,
                        example: 15,
                      },
                      courses: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            course: {
                              type: "string",
                              format: "mongoId",
                              example: "64b7c2e9c8b6c",
                            },
                            discount: {
                              type: "number",
                              minimum: 0,
                              maximum: 100,
                              example: 20,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Learner updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        learner: { $ref: "#/components/schemas/Learner" },
                        financialSummary: {
                          type: "object",
                          properties: {
                            totalOwed: { type: "number", example: 150.5 },
                            registrationFeePaid: {
                              type: "boolean",
                              example: true,
                            },
                            totalCourseFees: { type: "number", example: 200 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/learners/admin/delete-learner/{learnerId}": {
      delete: {
        tags: ["Learner Management"],
        summary: "Delete learner",
        description: "Soft delete learner profile (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "learnerId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Learner deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Learner deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/courses/admin/create-course": {
      post: {
        tags: ["Course Management"],
        summary: "Create new course",
        description: "Create a new course (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "duration", "basePrice"],
                properties: {
                  title: {
                    type: "string",
                    example: "Introduction to Programming",
                  },
                  description: {
                    type: "string",
                    example: "Basic programming concepts",
                  },
                  duration: { type: "string", example: "6 weeks" },
                  basePrice: { type: "number", minimum: 0, example: 100 },
                  discount: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                    example: 15,
                  },
                  learners: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "mongoId",
                      example: "64b7c2e9c8b6c",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Course created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Course created successfully",
                    },
                    data: {
                      type: "object",
                      properties: {
                        course: { $ref: "#/components/schemas/Course" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/api/v1/courses/admin/all-courses": {
      get: {
        tags: ["Course Management"],
        summary: "List all courses",
        description: "Retrieve paginated list of courses (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "Courses list retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    results: { type: "integer", example: 10 },
                    totalCourses: { type: "integer", example: 100 },
                    currentPage: { type: "integer", example: 1 },
                    totalPages: { type: "integer", example: 10 },
                    data: {
                      type: "object",
                      properties: {
                        courses: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Course" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/courses/admin/get-course/{courseId}": {
      get: {
        tags: ["Course Management"],
        summary: "Get course details",
        description: "Retrieve detailed information about a specific course",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "courseId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Course details retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        course: { $ref: "#/components/schemas/Course" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/v1/courses/admin/update-course/{courseId}": {
      put: {
        tags: ["Course Management"],
        summary: "Update course details",
        description: "Update course information (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "courseId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Advanced Programming" },
                  description: {
                    type: "string",
                    example: "Updated course description",
                  },
                  duration: { type: "string", example: "8 weeks" },
                  basePrice: { type: "number", example: 150 },
                  discount: { type: "number", example: 20 },
                  learners: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "mongoId",
                      example: "64b7c2e9c8b6c",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Course updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        updatedCourse: { $ref: "#/components/schemas/Course" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/courses/admin/delete-course/{courseId}": {
      delete: {
        tags: ["Course Management"],
        summary: "Delete course",
        description: "Soft delete course (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "courseId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Course deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Course deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/invoices/admin/create-invoice": {
      post: {
        tags: ["Invoice Management"],
        summary: "Create new invoice",
        description: "Create a new invoice for a learner (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "learnerId",
                  "courseId",
                  "amount",
                  "dueDate",
                  "status",
                  "installmentPlan",
                ],
                properties: {
                  learnerId: {
                    type: "string",
                    format: "mongoId",
                    example: "64b7c2e9c8b6c",
                  },
                  courseId: {
                    type: "string",
                    format: "mongoId",
                    example: "64b7c2e9c8b6c",
                  },
                  amount: { type: "number", example: 500 },
                  description: {
                    type: "string",
                    example: "Course enrollment fee",
                  },
                  dueDate: {
                    type: "string",
                    format: "date-time",
                    example: "2024-03-01T00:00:00Z",
                  },
                  status: {
                    type: "string",
                    enum: ["Pending", "Paid", "Overdue", "Voided"],
                    example: "Pending",
                  },
                  installmentPlan: {
                    type: "number",
                    enum: [1, 2, 3],
                    example: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Invoice created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/api/v1/invoices/admin/all-invoices": {
      get: {
        tags: ["Invoice Management"],
        summary: "List all invoices",
        description: "Retrieve paginated list of invoices (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["Pending", "Paid", "Overdue", "Voided"],
            },
          },
        ],
        responses: {
          200: {
            description: "Invoices list retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    results: { type: "integer", example: 10 },
                    totalInvoices: { type: "integer", example: 100 },
                    currentPage: { type: "integer", example: 1 },
                    totalPages: { type: "integer", example: 10 },
                    data: {
                      type: "object",
                      properties: {
                        invoices: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Invoice" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/invoices/admin/get-invoice/{invoiceId}": {
      get: {
        tags: ["Invoice Management"],
        summary: "Get invoice details",
        description: "Retrieve detailed invoice information (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "invoiceId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Invoice details retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/v1/invoices/admin/update-invoice/{invoiceId}": {
      put: {
        tags: ["Invoice Management"],
        summary: "Update invoice",
        description: "Update invoice details (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "invoiceId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["Pending", "Paid", "Overdue", "Voided"],
                  },
                  dueDate: { type: "string", format: "date-time" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Invoice updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/invoices/admin/delete-invoice/{invoiceId}": {
      delete: {
        tags: ["Invoice Management"],
        summary: "Delete invoice",
        description: "Soft delete invoice (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "invoiceId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Invoice deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Invoice deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/revenues/admin/create-revenue": {
      post: {
        tags: ["Revenue Management"],
        summary: "Create revenue entry",
        description: "Record revenue from paid invoices (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["invoiceId", "amount"],
                properties: {
                  invoiceId: {
                    type: "string",
                    format: "mongoId",
                    example: "64b7c2e9c8b6c",
                  },
                  amount: { type: "number", example: 500 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Revenue recorded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Revenue" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/revenues/admin/total-revenue": {
      get: {
        tags: ["Revenue Management"],
        summary: "Get total revenue",
        description: "Retrieve total accumulated revenue (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Total revenue retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        totalRevenue: { type: "number", example: 15000 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/revenues/admin/revenue-by-date": {
      get: {
        tags: ["Revenue Management"],
        summary: "Get revenue by date range",
        description: "Retrieve revenue within specific dates (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "startDate",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
          },
          {
            name: "endDate",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
          },
        ],
        responses: {
          200: {
            description: "Revenue data retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        totalRevenue: { type: "number", example: 5000 },
                        entries: {
                          type: "array",
                          items: { $ref: "#/components/schemas/RevenueEntry" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/revenues/admin/void-invoice/{invoiceId}": {
      patch: {
        tags: ["Revenue Management"],
        summary: "Void invoice",
        description: "Void invoice and adjust revenue (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "invoiceId",
            in: "path",
            required: true,
            schema: { type: "string", format: "mongoId" },
          },
        ],
        responses: {
          200: {
            description: "Invoice voided",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/revenues/admin/audit-log": {
      get: {
        tags: ["Revenue Management"],
        summary: "Revenue audit log",
        description: "Retrieve complete revenue audit trail (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Audit log retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    results: { type: "integer", example: 50 },
                    data: { $ref: "#/components/schemas/Revenue" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
