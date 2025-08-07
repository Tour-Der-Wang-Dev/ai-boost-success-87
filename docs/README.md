# AI Boost Success CRM

A modern Customer Relationship Management (CRM) application built with React, TypeScript, and Supabase. This application provides comprehensive customer management, activity tracking, AI-powered insights, and team collaboration features.

## 🚀 Features

- **Customer Management**: Comprehensive customer profiles with health scores and revenue tracking
- **Activity Tracking**: Tasks, meetings, calls, and notes with priority management
- **AI Insights**: AI-powered customer analysis and recommendations
- **Authentication**: Secure user authentication with Supabase Auth
- **Real-time Updates**: Live data synchronization across the application
- **Responsive Design**: Mobile-first design with dark/light mode support
- **Social Sharing**: Team collaboration and social media integration
- **Billing Integration**: Customer billing and subscription management

## 🛠 Technical Stack

### Frontend
- **React 18.3.1** - UI library with hooks and functional components
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 5.4.19** - Fast build tool and development server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Router DOM 6.30.1** - Client-side routing
- **React Query 5.83.0** - Server state management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or **Bun** 1.0.0+)
- **Git**: Latest version

### Development Environment
- **VS Code** (recommended) with these extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Prettier - Code formatter

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://inaiwowobcjubchogjda.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWl3b3dvYmNqdWJjaG9namRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzUyNzAsImV4cCI6MjA2OTkxMTI3MH0.XdQvDLzdID_XWLp4rbXSa9RhRm_U1ZvwHpzPp-MZwNU

# Application Configuration
VITE_APP_TITLE=AI Boost Success CRM
VITE_APP_DESCRIPTION=Modern Customer Relationship Management System

# Optional: Development Settings
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-boost-success
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using Bun (faster alternative)
bun install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 4. Database Setup
The application uses Supabase with pre-configured tables. The database schema will be automatically applied through migrations.

### 5. Start Development Server
```bash
# Using npm
npm run dev

# Using Bun
bun run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Development Guidelines

### Code Style & Conventions

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type assertions sparingly
- Prefer `interface` over `type` for object shapes

#### React Components
- Use functional components with hooks
- Follow PascalCase naming for components
- Use camelCase for props and variables
- Group imports: external libraries, internal modules, relative imports

#### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` (prefix with `use`)
- Utils: `camelCase.ts`
- Types: `camelCase.ts` or `types.ts`

#### CSS & Styling
- Use Tailwind CSS classes
- Prefer design system tokens from `index.css`
- Use semantic color names (primary, secondary, accent)
- Implement responsive design mobile-first

### Git Workflow

#### Branch Naming
```
[type]/[ticket-number]-[description]

Examples:
feature/CRM-123-customer-dashboard
bugfix/CRM-456-auth-redirect-issue
hotfix/CRM-789-critical-data-loss
```

#### Commit Messages
```
[type]: [description]

Examples:
feat: add customer health score calculation
fix: resolve authentication redirect loop
docs: update installation instructions
style: improve responsive layout for mobile
refactor: optimize database queries
test: add unit tests for customer hooks
```

### Pull Request Template

```markdown
## 🎯 Purpose
Brief description of what this PR accomplishes.

## 🔧 Changes Made
- [ ] Feature/Component changes
- [ ] Database schema updates
- [ ] API modifications
- [ ] UI/UX improvements
- [ ] Bug fixes
- [ ] Performance optimizations

## 🧪 Testing Steps
1. Step-by-step testing instructions
2. Expected behavior
3. Edge cases to verify

## 📸 Screenshots/Videos
Include relevant visual changes

## ✅ Review Checklist
- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Accessibility standards met
- [ ] Performance impact considered
```

### Code Review Criteria

#### Must-Have
- ✅ Code compiles without errors
- ✅ All TypeScript types are properly defined
- ✅ No console errors or warnings
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ Follows established code conventions

#### Should-Have
- ✅ Performance optimizations considered
- ✅ Error handling implemented
- ✅ Loading states included
- ✅ Accessibility standards followed
- ✅ Comments for complex logic

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Setup

#### Development
```bash
npm run dev
```
- Hot reload enabled
- Source maps included
- Development-only features active

#### Staging
```bash
npm run build:dev
```
- Production build with development environment variables
- Debugging enabled

#### Production
```bash
npm run build
```
- Optimized bundle
- Minified assets
- Production environment variables

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Supabase RLS policies active
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Performance monitoring setup
- [ ] Error tracking configured

## 🔒 Security Considerations

### Database Security
- Row Level Security (RLS) enabled on all tables
- User authentication required for data access
- SQL injection prevention through Supabase client
- Sensitive data encryption at rest

### Frontend Security
- Environment variables for sensitive data
- XSS prevention through React's built-in protections
- CSRF protection via Supabase Auth
- Secure authentication token storage

### Deployment Security
- HTTPS enforcement
- Secure headers configuration
- Regular dependency updates
- Security audit monitoring

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

#### TypeScript Errors
```bash
# Regenerate types
npm run build
# Check TypeScript configuration
npx tsc --noEmit
```

#### Supabase Connection Issues
- Verify environment variables
- Check Supabase project status
- Confirm API keys are correct
- Review RLS policies

### Performance Optimization
- Use React.memo for expensive components
- Implement virtualization for large lists
- Optimize images and assets
- Monitor bundle size with `npm run build`

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Community
- [GitHub Discussions](link-to-discussions)
- [Discord Server](link-to-discord)
- [Project Wiki](link-to-wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Join our Discord community
- Email: support@example.com