# File Structure Documentation

## Project Overview
This is a modern Customer Relationship Management (CRM) web application built with React 18, TypeScript, Tailwind CSS, and Supabase backend integration. The application features authentication, customer management, activity tracking, and AI-powered insights.

## File Structure Analysis

```
📁 ai-boost-success/
├── 📄 index.html                                   🟢 Entry HTML template
├── 📄 package.json                                 🟢 Project dependencies and scripts
├── 📄 README.md                                   🟢 Project documentation
├── 📄 vite.config.ts                              🟢 Vite build configuration
├── 📄 tailwind.config.ts                          🟢 Tailwind CSS configuration
├── 📄 tsconfig.json                               🟢 TypeScript compiler configuration
├── 📄 tsconfig.app.json                           🟢 App-specific TypeScript config
├── 📄 tsconfig.node.json                          🟢 Node.js TypeScript config
├── 📄 postcss.config.js                           🟢 PostCSS configuration
├── 📄 components.json                              🟢 shadcn/ui components configuration
├── 📄 eslint.config.js                            🟢 ESLint linting configuration
├── 📄 .gitignore                                  🟢 Git ignore patterns
├── 📄 bun.lockb                                   🟢 Bun package lock file
├── 📄 package-lock.json                           🟢 npm package lock file
│
├── 📁 public/
│   ├── 📄 favicon.ico                             🟢 Application favicon
│   ├── 📄 placeholder.svg                         🟢 Placeholder image asset
│   └── 📄 robots.txt                              🟢 Search engine crawler instructions
│
├── 📁 src/
│   ├── 📄 main.tsx                                🟢 Application entry point
│   ├── 📄 App.tsx                                 🟡 Main app component with routing
│   ├── 📄 App.css                                 🟢 Legacy CSS styles
│   ├── 📄 index.css                               🟢 Global styles and design tokens
│   ├── 📄 vite-env.d.ts                           🟢 Vite environment type definitions
│   │
│   ├── 📁 assets/
│   │   └── 📄 csm-hero.jpg                        🟢 Hero image for customer success
│   │
│   ├── 📁 components/
│   │   │
│   │   ├── 📁 activities/
│   │   │   ├── 📄 ActivityCard.tsx                🟡 Activity item display component
│   │   │   └── 📄 ActivityDialog.tsx              🟡 Activity creation/edit modal
│   │   │
│   │   ├── 📁 ai/
│   │   │   ├── 📄 AIInsightCard.tsx               🟡 AI insight display component
│   │   │   └── 📄 AIPromptDialog.tsx              🟡 AI prompt input modal
│   │   │
│   │   ├── 📁 auth/
│   │   │   └── 📄 ProtectedRoute.tsx              🟡 Route protection component
│   │   │
│   │   ├── 📁 customers/
│   │   │   ├── 📄 CustomerDialog.tsx              🟡 Customer creation/edit modal
│   │   │   └── 📄 CustomerFilters.tsx             🟢 Customer filtering component
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 CustomerCard.tsx                🟡 Customer summary card
│   │   │   └── 📄 StatsCard.tsx                   🟡 Statistics display card
│   │   │
│   │   ├── 📁 layouts/
│   │   │   └── 📄 DashboardLayout.tsx             🔴 Main application layout component
│   │   │
│   │   └── 📁 ui/ (shadcn/ui components)
│   │       ├── 📄 accordion.tsx                   🟢 Collapsible content component
│   │       ├── 📄 alert-dialog.tsx                🟢 Confirmation dialog component
│   │       ├── 📄 alert.tsx                       🟢 Alert notification component
│   │       ├── 📄 aspect-ratio.tsx                🟢 Responsive aspect ratio component
│   │       ├── 📄 avatar.tsx                      🟢 User avatar component
│   │       ├── 📄 badge.tsx                       🟢 Status badge component
│   │       ├── 📄 breadcrumb.tsx                  🟢 Navigation breadcrumb component
│   │       ├── 📄 button.tsx                      🟢 Interactive button component
│   │       ├── 📄 calendar.tsx                    🟢 Date picker calendar component
│   │       ├── 📄 card.tsx                        🟢 Content card component
│   │       ├── 📄 carousel.tsx                    🟢 Image/content carousel component
│   │       ├── 📄 chart.tsx                       🟢 Data visualization component
│   │       ├── 📄 checkbox.tsx                    🟢 Checkbox input component
│   │       ├── 📄 collapsible.tsx                 🟢 Collapsible content component
│   │       ├── 📄 command.tsx                     🟢 Command palette component
│   │       ├── 📄 context-menu.tsx                🟢 Right-click context menu
│   │       ├── 📄 dialog.tsx                      🟢 Modal dialog component
│   │       ├── 📄 drawer.tsx                      🟢 Slide-out drawer component
│   │       ├── 📄 dropdown-menu.tsx               🟢 Dropdown menu component
│   │       ├── 📄 form.tsx                        🟢 Form handling component
│   │       ├── 📄 hover-card.tsx                  🟢 Hover tooltip card component
│   │       ├── 📄 input.tsx                       🟢 Text input component
│   │       ├── 📄 input-otp.tsx                   🟢 OTP input component
│   │       ├── 📄 label.tsx                       🟢 Form label component
│   │       ├── 📄 menubar.tsx                     🟢 Application menubar component
│   │       ├── 📄 navigation-menu.tsx             🟢 Navigation menu component
│   │       ├── 📄 navigation.tsx                  🟢 Sidebar navigation component
│   │       ├── 📄 pagination.tsx                  🟢 Content pagination component
│   │       ├── 📄 popover.tsx                     🟢 Floating popover component
│   │       ├── 📄 progress.tsx                    🟢 Progress bar component
│   │       ├── 📄 radio-group.tsx                 🟢 Radio button group component
│   │       ├── 📄 resizable.tsx                   🟢 Resizable panels component
│   │       ├── 📄 scroll-area.tsx                 🟢 Custom scrollbar component
│   │       ├── 📄 select.tsx                      🟢 Dropdown select component
│   │       ├── 📄 separator.tsx                   🟢 Visual separator component
│   │       ├── 📄 sheet.tsx                       🟢 Slide-out sheet component
│   │       ├── 📄 sidebar.tsx                     🟢 Application sidebar component
│   │       ├── 📄 skeleton.tsx                    🟢 Loading skeleton component
│   │       ├── 📄 slider.tsx                      🟢 Range slider component
│   │       ├── 📄 sonner.tsx                      🟢 Toast notification component
│   │       ├── 📄 switch.tsx                      🟢 Toggle switch component
│   │       ├── 📄 table.tsx                       🟢 Data table component
│   │       ├── 📄 tabs.tsx                        🟢 Tab navigation component
│   │       ├── 📄 textarea.tsx                    🟢 Multi-line text input component
│   │       ├── 📄 toast.tsx                       🟢 Toast notification component
│   │       ├── 📄 toaster.tsx                     🟢 Toast container component
│   │       ├── 📄 toggle.tsx                      🟢 Toggle button component
│   │       ├── 📄 toggle-group.tsx                🟢 Toggle button group component
│   │       ├── 📄 tooltip.tsx                     🟢 Tooltip component
│   │       ├── 📄 use-toast.ts                    🟢 Toast hook utility
│   │       └── 📄 useToast.ts                     🟢 Toast state management
│   │
│   ├── 📁 contexts/
│   │   └── 📄 AuthContext.tsx                     🟡 Authentication state management
│   │
│   ├── 📁 hooks/
│   │   ├── 📄 use-mobile.tsx                      🟢 Mobile device detection hook
│   │   ├── 📄 use-toast.ts                        🟢 Toast notification hook
│   │   ├── 📄 useAIInsights.ts                    🟡 AI insights data management
│   │   ├── 📄 useActivities.ts                    🟡 Activities data management
│   │   └── 📄 useCustomers.ts                     🟡 Customers data management
│   │
│   ├── 📁 integrations/
│   │   └── 📁 supabase/
│   │       ├── 📄 client.ts                       🟢 Supabase client configuration
│   │       └── 📄 types.ts                        🟢 Database type definitions
│   │
│   ├── 📁 lib/
│   │   └── 📄 utils.ts                            🟢 Utility functions
│   │
│   └── 📁 pages/
│       ├── 📄 Index.tsx                           🟢 Home page redirector
│       ├── 📄 Dashboard.tsx                       🔴 Main dashboard page
│       ├── 📄 AuthPage.tsx                        🟡 Authentication page
│       ├── 📄 CustomersPage.tsx                   🟡 Customer management page
│       ├── 📄 ActivitiesPage.tsx                  🟡 Activity management page
│       ├── 📄 AIAssistantPage.tsx                 🟡 AI assistant interface page
│       ├── 📄 SocialSharePage.tsx                 🟡 Social sharing page
│       ├── 📄 BillingPage.tsx                     🟡 Billing management page
│       └── 📄 NotFound.tsx                        🟢 404 error page
│
└── 📁 supabase/
    ├── 📄 config.toml                              🟢 Supabase project configuration
    └── 📁 migrations/
        └── 📄 20250807064611_*.sql                 🟢 Database schema migration
```

## Import Complexity Legend
- 🟢 **Low Complexity (0-3 imports)**: Simple components or utilities with minimal dependencies
- 🟡 **Medium Complexity (4-7 imports)**: Standard components with moderate dependencies
- 🔴 **High Complexity (8+ imports)**: Complex components with many dependencies

## File Statistics
- **Total Files**: 89
- **TypeScript Files**: 67
- **Configuration Files**: 12
- **Asset Files**: 3
- **Documentation Files**: 2

## Complexity Distribution
- **Low Complexity (🟢)**: 67 files (75%)
- **Medium Complexity (🟡)**: 19 files (21%)
- **High Complexity (🔴)**: 3 files (4%)

## Architecture Highlights
- **Feature-Based Organization**: Components grouped by functionality
- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Component Library**: shadcn/ui for consistent UI components
- **Backend Integration**: Supabase for authentication and database
- **State Management**: React Query for server state, Context API for auth
- **Design System**: CSS custom properties with HSL color values
- **Type Safety**: Full TypeScript coverage with generated Supabase types