# Scripts Documentation

## Available Scripts

This document provides comprehensive information about all available npm scripts in the project, their purposes, parameters, and troubleshooting guides.

## Script Reference Table

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Start development server with hot reload | None | `npm run dev` | Clear .vite cache, check port 5173 availability |
| `build` | Create optimized production build | None | `npm run build` | Clear node_modules if build fails, check TypeScript errors |
| `build:dev` | Create development mode build for testing | None | `npm run build:dev` | Useful for debugging production issues with dev tools |
| `lint` | Run ESLint to check code quality | None | `npm run lint` | Fix auto-fixable issues with `npm run lint -- --fix` |
| `preview` | Preview production build locally | None | `npm run preview` | Run `npm run build` first, check build output exists |

## Detailed Script Information

### Development Scripts

#### `npm run dev`
**Purpose**: Starts the Vite development server with hot module replacement (HMR) for rapid development.

**Features**:
- Hot reload on file changes
- Source maps for debugging
- TypeScript compilation in watch mode
- CSS processing with Tailwind
- Proxy configuration for API calls

**Default Configuration**:
- **Port**: 5173
- **Host**: localhost
- **Open Browser**: false
- **HTTPS**: false

**Example Usage**:
```bash
# Standard development start
npm run dev

# With custom port
npm run dev -- --port 3000

# With custom host (for network access)
npm run dev -- --host 0.0.0.0

# Open browser automatically
npm run dev -- --open
```

**Expected Output**:
```
  VITE v5.4.19  ready in 342 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Troubleshooting**:
- **Port already in use**: Change port with `--port` flag
- **Slow startup**: Clear `.vite` cache folder
- **Module not found**: Verify file paths and imports
- **TypeScript errors**: Check `tsconfig.json` configuration

---

### Build Scripts

#### `npm run build`
**Purpose**: Creates an optimized production build with minification, tree-shaking, and asset optimization.

**Build Process**:
1. TypeScript compilation and type checking
2. React component optimization
3. CSS purging and minification
4. Asset optimization and compression
5. Bundle analysis and code splitting

**Output Location**: `dist/` directory

**Example Usage**:
```bash
# Standard production build
npm run build

# Build with source maps for debugging
npm run build -- --sourcemap

# Build with bundle analysis
npm run build -- --analyze
```

**Expected Output**:
```
vite v5.4.19 building for production...
✓ 1247 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-DiwrgTda.css    8.15 kB │ gzip:  2.31 kB
dist/assets/index-BNthxkKP.js   236.17 kB │ gzip: 75.33 kB
✓ built in 3.21s
```

**Troubleshooting**:
- **Build fails**: Run `npm run lint` to check for code issues
- **Out of memory**: Increase Node.js memory with `NODE_OPTIONS=--max-old-space-size=4096`
- **Large bundle size**: Analyze with webpack-bundle-analyzer
- **Missing assets**: Check asset imports and public folder

#### `npm run build:dev`
**Purpose**: Creates a development build for testing production-like behavior while retaining debugging capabilities.

**Use Cases**:
- Testing production builds locally
- Debugging production-specific issues
- Performance testing with dev tools
- Staging environment deployment

**Example Usage**:
```bash
npm run build:dev
npm run preview
```

---

### Quality Assurance Scripts

#### `npm run lint`
**Purpose**: Runs ESLint to analyze code quality, catch potential errors, and enforce coding standards.

**Linting Rules**:
- TypeScript-specific rules
- React best practices
- Accessibility guidelines
- Performance optimizations
- Code style consistency

**Example Usage**:
```bash
# Check for linting issues
npm run lint

# Auto-fix fixable issues
npm run lint -- --fix

# Lint specific files
npm run lint -- src/components/**/*.tsx

# Lint with detailed output
npm run lint -- --format=detailed
```

**Expected Output**:
```
✓ No ESLint warnings or errors found.
```

**Common Linting Issues & Fixes**:

| Issue | Description | Fix |
|-------|-------------|-----|
| `no-unused-vars` | Unused variables | Remove or prefix with underscore |
| `react-hooks/exhaustive-deps` | Missing dependency in useEffect | Add missing dependencies |
| `@typescript-eslint/no-explicit-any` | Using any type | Define proper types |
| `jsx-a11y/alt-text` | Missing alt text | Add descriptive alt attributes |

---

### Preview Scripts

#### `npm run preview`
**Purpose**: Serves the production build locally for testing before deployment.

**Requirements**: Must run `npm run build` first

**Features**:
- Serves optimized production assets
- Tests routing in production mode
- Validates build integrity
- Performance testing

**Example Usage**:
```bash
# Build and preview
npm run build && npm run preview

# Preview with custom port
npm run preview -- --port 4173

# Preview with network access
npm run preview -- --host 0.0.0.0
```

**Expected Output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

---

## Advanced Script Usage

### Environment-Specific Builds

#### Development Environment
```bash
# Full development workflow
npm install
npm run dev

# Development with linting
npm run lint && npm run dev
```

#### Staging Environment
```bash
# Build for staging
npm run build:dev
npm run preview

# With environment variables
NODE_ENV=staging npm run build:dev
```

#### Production Environment
```bash
# Production build and test
npm run lint
npm run build
npm run preview

# CI/CD pipeline commands
npm ci
npm run lint -- --max-warnings 0
npm run build
```

### Custom Script Combinations

#### Quality Check Workflow
```bash
# Complete quality check
npm run lint && npm run build && npm run preview
```

#### Development Troubleshooting
```bash
# Clean and restart
rm -rf node_modules .vite dist
npm install
npm run dev
```

### Performance Monitoring

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle size
npm run build
npx webpack-bundle-analyzer dist/stats.json
```

#### Build Performance
```bash
# Time build process
time npm run build

# Profile build with verbose output
npm run build -- --profile
```

## Environment Variables in Scripts

### Development Variables
```bash
# Custom API endpoint
VITE_API_URL=http://localhost:3001 npm run dev

# Enable debug mode
VITE_DEBUG=true npm run dev

# Custom build target
BUILD_TARGET=modern npm run build
```

### Build Optimization Variables
```bash
# Increase memory for large builds
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Enable experimental features
NODE_OPTIONS="--experimental-modules" npm run dev
```

## Continuous Integration Scripts

### GitHub Actions Example
```yaml
name: Build and Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run preview &
```

## Common Issues and Solutions

### Script Execution Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Permission denied | Script execution rights | `chmod +x node_modules/.bin/*` |
| Command not found | Missing dependencies | `npm install` |
| Port already in use | Another process using port | Kill process or use different port |
| Out of memory | Large project/limited RAM | Increase Node.js memory limit |
| Slow build times | Large dependencies | Enable caching, analyze bundle |

### Performance Optimization

#### Development Performance
```bash
# Use SWC instead of Babel for faster builds
npm install --save-dev @vitejs/plugin-react-swc

# Enable build caching
npm run dev -- --force
```

#### Build Performance
```bash
# Parallel processing
npm run build -- --parallel

# Tree shaking optimization
npm run build -- --tree-shake
```

## Monitoring and Debugging

### Build Analysis
```bash
# Generate build report
npm run build -- --reporter=json > build-report.json

# Analyze dependencies
npm ls --depth=0
npm audit
```

### Development Monitoring
```bash
# Watch mode with verbose output
npm run dev -- --debug

# Profile development server
npm run dev -- --profile
```

This comprehensive scripts documentation ensures developers can effectively use all available build tools and troubleshoot common issues during development and deployment.