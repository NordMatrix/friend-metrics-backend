# Friend Metrics 🤝

[![Build Status](https://github.com/NordMatrix/friend-metrics-backend/actions/workflows/main.yml/badge.svg)](https://github.com/NordMatrix/friend-metrics-backend/actions)
[![Code Coverage](https://codecov.io/gh/NordMatrix/friend-metrics-backend/branch/main/graph/badge.svg)](https://codecov.io/gh/NordMatrix/friend-metrics-backend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-9.0.0-red)](https://nestjs.com/)

Friend Metrics is an innovative platform for tracking and analyzing friendships using personality psychology frameworks like MBTI and Big Five. This backend service provides a robust API for managing friends, tracking interactions, and analyzing compatibility based on personality traits.

## 🌟 Features

- **Authentication System**
  - JWT-based authentication
  - Google OAuth integration
  - Secure password handling

- **Friend Management**
  - CRUD operations for friends
  - Relationship score tracking
  - Notes and interaction history

- **Personality Analysis**
  - MBTI personality type assessment
  - Big Five personality traits tracking
  - Compatibility scoring algorithm

- **Interaction Tracking**
  - Various interaction types support
  - Automatic score adjustments
  - Interaction statistics and analytics

- **Advanced Analytics**
  - Personality compatibility calculations
  - Friendship strength metrics
  - Interaction patterns analysis

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v13+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NordMatrix/friend-metrics-backend.git
cd friend-metrics-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npm run migration:run
```

5. Start the server:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

API documentation is available via Swagger UI at `/api/docs` when running the server.

### Key Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/google` - Google OAuth login
- `POST /friends` - Add new friend
- `GET /friends` - List all friends
- `POST /friends/:id/personality` - Add personality profile
- `GET /friends/:id/compatibility/:targetId` - Get compatibility score
- `POST /friends/:id/interactions` - Record new interaction

## 🧪 Testing

1. Set up test environment:
```bash
cp .env.test.example .env.test
# Edit .env.test if needed
```

2. Run tests:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

Note: Make sure your PostgreSQL server is running and the credentials in `.env.test` match your test database configuration.

## 🏗️ Architecture

The application follows a modular architecture based on NestJS framework:

```
src/
├── auth/           # Authentication module
├── friends/        # Friend management
├── personality/    # Personality analysis
├── interactions/   # Interaction tracking
├── users/         # User management
└── config/        # Configuration
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📈 Roadmap

- [ ] Advanced friendship analytics
- [ ] Machine learning for compatibility predictions
- [ ] Real-time notifications
- [ ] Friend groups and circles
- [ ] Integration with social networks
- [ ] Mobile app support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show your support

Give a ⭐️ if this project helped you!
