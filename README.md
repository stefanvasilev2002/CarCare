# CarCare SaaS - Vehicle Maintenance Tracking

A modern, full-stack SaaS application for tracking vehicle maintenance, expenses, and service history. Built with Next.js 14, TypeScript, Prisma, and Supabase.

## 🚗 Features

### Core Functionality
- **Vehicle Management**: Add, edit, and manage multiple vehicles
- **Service Tracking**: Log maintenance records with photos and receipts
- **Smart Reminders**: Automated maintenance alerts based on mileage/time
- **Expense Analytics**: Track costs and analyze spending patterns
- **Dashboard**: Overview of fleet status and recent activities

### Technical Features
- **Authentication**: Secure user auth with Supabase
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Photo/receipt uploads via Supabase Storage
- **Real-time UI**: Optimistic updates and responsive design
- **Type Safety**: Full TypeScript coverage
- **Mobile Ready**: Responsive design (React Native app planned)

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with Zod validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Reliable database
- **Supabase** - Auth, database, and storage

### Future (Mobile)
- **React Native** with Expo
- **NativeWind** for styling
- Shared API endpoints

## 📁 Project Structure

```
/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # Reusable components
│   │   │   ├── contexts/    # React contexts
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   └── store/       # Zustand store
│   │   └── package.json
│   └── mobile/              # React Native app (planned)
├── packages/
│   ├── database/            # Prisma schema and migrations
│   ├── ui/                  # Shared UI components
│   └── types/               # TypeScript type definitions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── supabase/                # Supabase configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd carcare-saas
```

### 2. Install Dependencies
```bash
cd apps/web
npm install
```

### 3. Environment Setup
Copy the environment template:
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/carcare?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# NextJS
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup
Initialize and migrate the database:
```bash
cd ../../  # Back to project root
npx prisma generate
npx prisma db push
```

### 5. Start Development Server
```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄 Database Schema

The application uses these main models:

- **User**: User accounts and authentication
- **Vehicle**: Car information (make, model, year, VIN, etc.)
- **Service**: Maintenance records with costs and dates
- **Reminder**: Upcoming maintenance alerts

See `prisma/schema.prisma` for the complete schema.

## 📱 API Endpoints

### Vehicles
- `GET /api/vehicles?userId={id}` - Get user's vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles` - Update vehicle
- `DELETE /api/vehicles?id={id}` - Delete vehicle

### Services
- `GET /api/services?userId={id}&vehicleId={id}` - Get services
- `POST /api/services` - Create new service record
- `PUT /api/services` - Update service
- `DELETE /api/services?id={id}` - Delete service

## 🎨 Components

### Key Components
- `VehicleCard` - Display vehicle info and stats
- `AuthForm` - Login/signup with validation
- `Sidebar` - Navigation and user menu
- `Dashboard` - Overview with metrics

### UI Components (shadcn/ui)
- Button, Card, Input, Label
- Form, Select, Textarea
- Dialog, Sheet, Dropdown Menu
- Badge, Avatar, Tabs

## 🔧 Development

### Code Quality
- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting (recommended)

### Commands
```bash
# Development
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Database
npx prisma studio        # Database browser
npx prisma db push       # Push schema changes
npx prisma generate      # Generate client
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Vehicle management
- ✅ Service tracking
- ✅ Basic dashboard
- 🔄 Service forms and validation

### Phase 2
- Smart reminders system
- Photo upload for receipts
- Advanced analytics and charts
- Export/import functionality

### Phase 3
- React Native mobile app
- Push notifications
- Offline capability
- Vehicle value tracking

### Phase 4
- Multi-user families/fleets
- Service provider integrations
- AI-powered maintenance predictions
- Advanced reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an issue for bug reports
- Start a discussion for feature requests
- Check existing issues before creating new ones

---

**CarCare** - Keep your vehicles running smoothly! 🚗✨
