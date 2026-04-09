# LocalGoAI - Personalized Travel Itinerary Platform

<div align="center">

**An AI-powered travel planning platform that generates personalized travel itineraries based on user preferences and interests.**

[![Java](https://img.shields.io/badge/Java-17-007396?style=flat-square)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-6DB33F?style=flat-square)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=flat-square)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**LocalGoAI** is an enterprise-grade travel itinerary platform that leverages artificial intelligence to create personalized travel plans. The platform integrates with OpenAI to generate intelligent recommendations based on user preferences, providing a seamless experience for travel planning and booking.

**Key Business Benefits:**
- 🤖 AI-powered personalization for enhanced user engagement
- 📱 Real-time notifications and updates via WebSocket
- 🔐 Enterprise-grade security with JWT authentication
- 📊 Comprehensive booking and itinerary management
- 🌍 Multi-language support (English, Vietnamese)
- 🚀 Scalable microservices-ready architecture

---

## ✨ Key Features

### Core Features
- **Personalized Itineraries**: AI-generated travel plans based on user preferences
- **Destination Management**: Comprehensive destination database with highlights and attractions
- **Booking System**: Integrated booking management for accommodations and activities
- **User Authentication**: Secure JWT-based authentication and authorization
- **File Management**: Robust file upload and management system for travel documents
- **Real-time Notifications**: WebSocket-based real-time notification delivery
- **Travel News**: Latest travel updates and recommendations
- **Multi-language Support**: English and Vietnamese interface support

### Technical Features
- REST API with comprehensive documentation
- Database-agnostic design (JPA with customizable implementations)
- Secure file upload with validation
- Real-time communication via WebSocket
- Localization and internationalization support
- Request validation and error handling
- Comprehensive logging infrastructure

---

## 🛠 Tech Stack

### Backend
| Component | Version | Purpose |
|-----------|---------|---------|
| **Java** | 17 | Programming language |
| **Spring Boot** | 3.4.3 | Application framework |
| **Spring Data JPA** | Latest | ORM and database abstraction |
| **Spring Security** | Latest | Authentication & authorization |
| **Spring AI** | 1.0.0-M1 | AI integration (OpenAI) |
| **Spring Web** | Latest | REST API development |
| **JWT (jjwt)** | 0.11.5 | Token-based authentication |

### Database
- **Primary**: Relational database (MySQL/PostgreSQL via JPA)
- **Cache**: Optional Redis/MongoDB support

### DevOps & Tools
- **Build**: Maven
- **Containerization**: Docker & Docker Compose
- **Logging**: Logback

---

## 📦 Prerequisites

### System Requirements
- **Java Development Kit (JDK)**: Version 17 or higher
- **Apache Maven**: Version 3.6.0 or higher
- **Docker** (optional): Latest version for containerization
- **Git**: For version control

### Development Environment
- **IDE**: IntelliJ IDEA / Eclipse / VS Code with extensions
- **Database**: MySQL 8.0+ or PostgreSQL 12+
- **API Testing**: Postman or Insomnia

### External Services
- **OpenAI API Key**: For AI-powered itinerary generation
- **SMTP Server**: For email notifications (optional)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd java-travel
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```properties
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/local_go_ai
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# OpenAI Configuration
SPRING_AI_OPENAI_API_KEY=your_openai_key
SPRING_AI_OPENAI_CHAT_OPTIONS_MODEL=gpt-4

# Application
SERVER_PORT=8080
APP_JWT_SECRET=your_jwt_secret_key
APP_JWT_EXPIRATION_MS=86400000

# File Upload
APP_UPLOAD_PATH=/uploads
APP_MAX_FILE_SIZE=10485760
```

### 3. Build the Project
```bash
# Using Maven wrapper
./mvnw clean install

# Or using system Maven
mvn clean install
```

### 4. Setup Database
```bash
# Run database migrations (if using Flyway/Liquibase)
./mvnw flyway:migrate

# Or execute SQL scripts
mysql -u root -p local_go_ai < sql/seed_data.sql
```

### 5. Run the Application
```bash
# Using Maven
./mvnw spring-boot:run

# Or using Docker Compose
docker-compose up -d

# Application will be available at: http://localhost:8080
```

### 6. Verify Installation
```bash
# Check health endpoint
curl http://localhost:8080/actuator/health

# Expected response: {"status":"UP"}
```

---

## 📁 Project Structure

```
java-travel/
├── src/
│   ├── main/
│   │   ├── java/com/java/kltn/
│   │   │   ├── KltnApplication.java          # Main application class
│   │   │   ├── components/                    # Utility components
│   │   │   ├── config/                        # Configuration classes
│   │   │   │   ├── AiConfig.java             # OpenAI integration
│   │   │   │   ├── SecurityConfig.java       # Security settings
│   │   │   │   └── WebConfig.java            # Web configuration
│   │   │   ├── controllers/                   # REST API endpoints
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── BookingController.java
│   │   │   │   ├── DestinationController.java
│   │   │   │   ├── ItineraryController.java
│   │   │   │   └── ...
│   │   │   ├── entities/                      # JPA entities
│   │   │   ├── services/                      # Business logic
│   │   │   ├── repositories/                  # Data access layer
│   │   │   ├── models/                        # DTOs and view models
│   │   │   ├── exceptions/                    # Custom exceptions
│   │   │   ├── filters/                       # Request/response filters
│   │   │   ├── websocket/                     # WebSocket handlers
│   │   │   └── utils/                         # Utility classes
│   │   └── resources/
│   │       ├── application.yaml               # Application configuration
│   │       ├── logback.xml                    # Logging configuration
│   │       └── i18n/                          # Internationalization
│   └── test/                                   # Unit and integration tests
├── sql/
│   ├── seed_data.sql                          # Initial data
│   └── fake_data.sql                          # Test data
├── docker-compose.yml                         # Docker services
├── Dockerfile                                 # Container definition
├── pom.xml                                    # Maven dependencies
└── README.md                                  # This file
```

---

## ⚙️ Configuration

### Application Properties
Edit `src/main/resources/application.yaml`:

```yaml
spring:
  application:
    name: kltn
  datasource:
    url: jdbc:mysql://localhost:3306/local_go_ai
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  ai:
    openai:
      api-key: ${SPRING_AI_OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    com.java.kltn: DEBUG
  file:
    name: logs/application.log
```

### Security Configuration
- JWT tokens are used for authentication
- Token expiration: Configurable via `APP_JWT_EXPIRATION_MS`
- CORS enabled for frontend integration
- Role-based access control implemented

---

## 📚 API Documentation

### Authentication
```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response includes JWT token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Generate Itinerary
```bash
POST /api/itineraries/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination": "Da Nang",
  "duration": 5,
  "interests": ["beach", "culture", "food"],
  "budget": 1000
}
```

### View Destinations
```bash
GET /api/destinations?page=0&size=10
Authorization: Bearer {token}
```

For complete API documentation, use Swagger/Springdoc:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

---

## 👨‍💻 Development

### IDE Setup
**IntelliJ IDEA:**
1. Open project root directory
2. Maven will auto-configure
3. Configure JDK to Java 17+
4. Run `KltnApplication.java` to start

**VS Code:**
```bash
# Install extensions
- Extension Pack for Java (Microsoft)
- Spring Boot Extension Pack (Microsoft)
- REST Client (Huachao Mao)
```

### Running Tests
```bash
# Run all tests
./mvnw test

# Run specific test
./mvnw test -Dtest=UserControllerTest

# With coverage
./mvnw test jacoco:report
```

### Code Standards
- Follow Google Java Style Guide
- Use meaningful variable and method names
- Add JavaDoc for public methods
- Keep methods under 30 lines of code
- Write unit tests for services

### Common Development Tasks
```bash
# Clean build
./mvnw clean

# Build without tests
./mvnw clean install -DskipTests

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Format code (if configured)
./mvnw spotless:apply
```

---

## 🐳 Deployment

### Docker Deployment
```bash
# Build image
docker build -t localgoai:latest .

# Run container
docker run -d \
  --name localgoai \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/local_go_ai \
  -e SPRING_AI_OPENAI_API_KEY=your_key \
  localgoai:latest
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Deployment Checklist
- [ ] Environment variables configured securely
- [ ] Database backed up
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring and alerts set up
- [ ] Log aggregation configured
- [ ] Database connections pooled
- [ ] Cache strategy implemented

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Application fails to start
```
Error: Unable to connect to database
```
**Solution**: Verify database credentials in `application.yaml`

**Issue**: JWT token validation fails
```
Error: Invalid token
```
**Solution**: Check token expiration and secret key configuration

**Issue**: File upload fails
```
Error: File size exceeds limit
```
**Solution**: Increase `APP_MAX_FILE_SIZE` in environment variables

**Issue**: OpenAI integration not working
```
Error: API key invalid
```
**Solution**: Verify OpenAI API key and ensure account has credit

### Debug Mode
```bash
# Run with debug logging
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

### Logs Location
- Application logs: `logs/application.log`
- Docker logs: `docker logs <container-id>`

---

## 🤝 Contributing

### Branch Naming Convention
```
feature/feature-name
bugfix/bug-description
hotfix/critical-issue
```

### Commit Message Format
```
feat: Add new feature description
fix: Resolve bug description
docs: Update documentation
style: Code formatting
refactor: Code refactoring
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with descriptive commits
3. Add tests for new features
4. Update documentation
5. Submit pull request with detailed description
6. Wait for code review and approval
7. Merge when approved

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support & Contact

- **Documentation**: [Project Wiki](#)
- **Issue Tracker**: [GitHub Issues](#)
- **Email**: support@localgoai.com
- **Slack/Teams**: [Team Channel](#)

---

<div align="center">

**Made with ❤️ by the LocalGoAI Team**

[⬆ Back to top](#localgoai---personalized-travel-itinerary-platform)

</div>
# GR59
