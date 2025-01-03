# Getting Started with Friend Metrics

This guide will help you get started with Friend Metrics API. Follow these steps to set up your development environment and make your first API call.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/NordMatrix/friend-metrics-backend.git
cd friend-metrics-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=friend_metrics_dev

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. Create database:
```bash
createdb friend_metrics_dev
```

6. Run migrations:
```bash
npm run migration:run
```

7. Start the development server:
```bash
npm run start:dev
```

## Making Your First API Call

1. Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"your_password"}'
```

2. Login to get JWT token:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"your_password"}'
```

3. Add a new friend (use the token from previous step):
```bash
curl -X POST http://localhost:3000/friends \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","notes":"Met at conference"}'
```

## Next Steps

- Learn about [Authentication](./authentication.md)
- Explore the [Friends API](./friends.md)
- Understand [Personality Analysis](./personality.md)
- Check out our [API Reference](./api-reference.md)

## Need Help?

- Check our [FAQ](./faq.md)
- Join our [Discord Community](https://discord.gg/friendmetrics)
- Open an [Issue](https://github.com/NordMatrix/friend-metrics-backend/issues) 