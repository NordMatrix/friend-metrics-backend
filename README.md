# Friend Metrics API

Backend part of the Friend Metrics application - a system for tracking and improving relationships with friends. The API is built with NestJS using TypeScript and provides a comprehensive toolkit for managing social connections.

## 🌟 Features

- **Friend Management**
  - Create and edit friend profiles
  - Track relationship scores
  - Add and manage notes

- **Interaction Tracking**
  - Record various types of interactions
  - Automatic relationship score impact calculation
  - Interaction statistics by type and time

- **Personality Analysis**
  - MBTI personality type assessment
  - Big Five model analysis
  - Friend compatibility calculation

- **Security**
  - JWT authentication
  - Google OAuth 2.0
  - Protected endpoints

## 🚀 Technologies

- [NestJS](https://nestjs.com/) - progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - typed JavaScript
- [PostgreSQL](https://www.postgresql.org/) - relational database
- [TypeORM](https://typeorm.io/) - TypeScript ORM
- [Passport.js](http://www.passportjs.org/) - authentication
- [Swagger](https://swagger.io/) - API documentation

## 📋 Requirements

- Node.js (version 16 or higher)
- PostgreSQL (version 12 or higher)
- npm or yarn

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NordMatrix/friend-metrics-backend.git
   cd friend-metrics-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your values for:
   - Application port
   - Database credentials
   - JWT secret
   - Google OAuth credentials

4. **Create database**
   ```bash
   createdb friend_metrics_dev
   ```

5. **Run migrations**
   ```bash
   npm run migration:run
   ```

## 🚀 Running the app

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Tests
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 📚 API Documentation

After starting the application, Swagger documentation is available at:
```
http://localhost:3001/api
```

### Main Endpoints:

- **Auth** (`/auth`)
  - POST `/register` - register new user
  - POST `/login` - user login
  - GET `/google` - Google OAuth authentication

- **Friends** (`/friends`)
  - GET `/` - get friends list
  - POST `/` - add new friend
  - GET `/:id` - get friend details
  - PATCH `/:id` - update friend
  - DELETE `/:id` - delete friend
  - PATCH `/:id/score` - update relationship score

- **Interactions** (`/friends/:friendId/interactions`)
  - GET `/` - get interactions list
  - POST `/` - record new interaction
  - GET `/statistics` - get statistics
  - DELETE `/:id` - delete interaction

- **Personality** (`/friends/:friendId/personality`)
  - POST `/` - create personality profile
  - GET `/` - get personality profile
  - GET `/analysis` - get personality analysis
  - GET `/mbti` - get MBTI type
  - GET `/compatibility/:otherFriendId` - calculate compatibility

## 🤝 Contributing

If you want to contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Author

NordMatrix - [GitHub](https://github.com/NordMatrix)

## 🙏 Acknowledgments

- [NestJS Team](https://nestjs.com/) for the amazing framework
- [TypeORM Team](https://typeorm.io/) for the great database tools
- All contributors who help improve this project
