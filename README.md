# 🏀 Basketball Stats Tracker

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.14-purple)](https://vitejs.dev/)

> **Building a Better World Through Code** 🌍

---

## 🏢 About Iron Code Studios

**Iron Code Studios** is a software NGO committed to creating technology that makes a positive impact on the world. We believe in the power of open-source software, community collaboration, and using our technical skills to solve real-world problems.

### 🎯 Our Mission
- **Empowerment**: Building tools that empower communities and individuals
- **Education**: Creating educational resources and platforms for learning
- **Accessibility**: Ensuring our software is accessible to everyone
- **Sustainability**: Developing solutions for long-term positive impact

---

## 📊 Project Overview

The **Basketball Stats Tracker** is a comprehensive fantasy basketball platform that provides real-time NBA statistics, advanced analytics, and competitive fantasy league management. This project demonstrates our commitment to creating engaging, data-driven applications that bring communities together.

### ✨ Key Features

- 🔥 **Real-Time NBA Stats** - Live statistics updated instantly
- 🏆 **Fantasy League Management** - Create and manage competitive leagues
- 📈 **Advanced Analytics** - Deep insights for strategic decision-making
- 👥 **Community Features** - Connect with other basketball enthusiasts
- 💰 **Prize Competitions** - Compete for rewards and recognition
- 📱 **Responsive Design** - Beautiful UI that works on all devices

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and context
- **TypeScript 5.6.3** - Type-safe development
- **Vite 5.4.14** - Lightning-fast build tool
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful data visualizations
- **React Query** - Powerful data synchronization

### Backend
- **Node.js 20+** - JavaScript runtime
- **Express 4.21.2** - Web application framework
- **TypeScript** - Full-stack type safety
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **Passport.js** - Authentication middleware
- **WebSocket** - Real-time communication

### Development & Deployment
- **ESBuild** - Fast JavaScript bundler
- **Drizzle Kit** - Database schema management
- **Git** - Version control
- **GitHub** - Repository hosting and CI/CD

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dillmantis/BasketballStatsTracker.git
   cd BasketballStatsTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/basketball_stats
   SESSION_SECRET=your-session-secret
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

---

## 📁 Project Structure

```
BasketballStatsTracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── main.tsx        # Application entry point
├── server/                 # Backend Express server
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
├── migrations/             # Database migration files
├── attached_assets/        # Static assets
└── dist/                   # Production build output
```

---

## 🎮 Usage

### For Players
1. **Sign Up** - Create your account and join the community
2. **Create Leagues** - Start fantasy leagues with friends
3. **Draft Players** - Build your dream team
4. **Track Performance** - Monitor real-time statistics
5. **Compete** - Climb leaderboards and win prizes

### For Administrators
1. **League Management** - Oversee league operations
2. **User Administration** - Manage user accounts and permissions
3. **Analytics Dashboard** - View platform-wide statistics
4. **Content Management** - Update news and announcements

---

## 📱 Screenshots

### Landing Page
Beautiful, responsive landing page with clear value proposition and pricing plans.

### Dashboard
Real-time statistics dashboard with interactive charts and player performance metrics.

### League Management
Intuitive interface for creating, joining, and managing fantasy basketball leagues.

---

## 🤝 Contributing

We welcome contributions from developers who share our vision of creating positive impact through technology!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |

### Database Configuration

The application uses Drizzle ORM with PostgreSQL. Schema definitions are located in `shared/schema.ts`.

---

## 📊 Performance & Monitoring

- **Real-time Updates** - WebSocket connections for live data
- **Optimized Queries** - Efficient database operations with Drizzle ORM
- **Caching Strategy** - React Query for client-side caching
- **Bundle Optimization** - Vite for fast builds and optimal bundles

---

## 🔒 Security

- **Authentication** - Secure session-based authentication
- **Data Validation** - Comprehensive input validation with Zod
- **SQL Injection Protection** - Type-safe queries with Drizzle ORM
- **XSS Prevention** - Sanitized user inputs
- **HTTPS Enforcement** - Secure connections in production

---

## 🌐 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your-production-db-url
   export SESSION_SECRET=your-secure-secret
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📈 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced ML-based player predictions
- [ ] Social features and chat
- [ ] Multi-sport support
- [ ] API for third-party integrations
- [ ] Enhanced accessibility features

### Long-term Vision
- Become the leading platform for fantasy sports analytics
- Expand to support multiple sports leagues
- Build a thriving community of sports enthusiasts
- Develop educational content for sports analytics

---

## 📞 Support & Community

### Get Help
- 📧 **Email**: support@ironcodestudios.org
- 💬 **Discord**: [Join our community](https://discord.gg/iron-code-studios)
- 📚 **Documentation**: [Read the docs](https://docs.basketballstats.com)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/dillmantis/BasketballStatsTracker/issues)

### Community Guidelines
- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experiences
- Contribute to open-source projects
- Focus on building positive impact

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NBA API** - For providing comprehensive basketball statistics
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has helped improve this project
- **Beta Testers** - Community members who provided valuable feedback

---

## 🌟 Iron Code Studios Projects

Explore our other projects focused on creating positive impact:

- 🏥 **HealthCare Connect** - Connecting patients with healthcare resources
- 🎓 **EduPlatform** - Free educational platform for underserved communities
- 🌱 **EcoTracker** - Environmental impact tracking and sustainability tools
- 🤝 **CommunityHub** - Local community organization and event management

---

<div align="center">

**Built with ❤️ by Iron Code Studios**

*Creating a better world through code, one project at a time.*

[Website](https://ironcodestudios.org) • [GitHub](https://github.com/ironcodestudios) • [Twitter](https://twitter.com/ironcodestudios) • [LinkedIn](https://linkedin.com/company/iron-code-studios)

</div>
