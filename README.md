# FestPass — College Fest Token System

A full-stack automated token generation and QR-based entry validation system for college fests. Built with **Next.js 14**, **MongoDB**, **TypeScript**, and **Tailwind CSS**.

**Live Demo:** [v0-automated-token-system.vercel.app](https://v0-automated-token-system.vercel.app/)

---

## Features

- **Student Registration** — Form-based registration with server-side validation and duplicate email detection. Each registrant receives a unique fest ID (`FEST-{timestamp}-{random}`).
- **QR Code Generation** — Canvas-based QR code generation per student, downloadable as PNG and shareable via the Web Share API.
- **Entry Validation** — Camera-based QR scanning and manual ID lookup for validating student entries at the gate. Prevents double validation.
- **Analytics Dashboard** — Real-time statistics including role breakdowns, validation rates, top colleges by registration count, and 24-hour activity tracking.
- **RESTful API** — Full CRUD operations with search, filter, and aggregation endpoints.
- **Responsive UI** — Mobile-first design with persistent navigation, consistent design tokens, and accessible components via shadcn/ui.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS + shadcn/ui            |
| Database    | MongoDB (native driver)             |
| API         | Next.js API Routes (RESTful)        |
| Deployment  | Vercel                              |
| QR Codes    | HTML Canvas API                     |

## API Endpoints

| Method | Endpoint                | Description                                  |
|--------|-------------------------|----------------------------------------------|
| GET    | `/api/students`         | List all students (supports `?search=` and `?role=` params) |
| POST   | `/api/students`         | Register a new student                        |
| GET    | `/api/students/[id]`    | Get a single student by fest ID               |
| POST   | `/api/validate`         | Validate a student entry                      |
| GET    | `/api/validate/recent`  | Get recent validation scans                   |
| GET    | `/api/analytics`        | Aggregated registration and validation stats  |

## Database Schema

### Students Collection

```json
{
  "id": "FEST-1718901234567-042",
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "college": "string",
  "role": "participant | volunteer | organizer | judge | sponsor",
  "registeredAt": "Date",
  "validated": "boolean",
  "validatedAt": "Date | null"
}
```

### Validation Scans Collection

```json
{
  "studentId": "string",
  "scannedAt": "Date",
  "scannedBy": "string | null",
  "method": "qr | manual"
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/hamzah10999/college-fest-system.git
cd college-fest-system
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/college-fest
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

1. Push to GitHub
2. Connect the repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy

## Project Structure

```
├── app/
│   ├── api/              # RESTful API routes
│   │   ├── students/     # Student CRUD endpoints
│   │   ├── validate/     # Validation endpoints
│   │   └── analytics/    # Aggregation endpoint
│   ├── register/         # Registration form page
│   ├── students/         # Student list + detail pages
│   ├── validate/         # QR scanner + manual validation
│   ├── analytics/        # Dashboard with charts
│   ├── layout.tsx        # Root layout with Navbar + Footer
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui component library
│   ├── navbar.tsx         # Persistent navigation
│   └── footer.tsx         # Site footer
├── lib/
│   ├── models/           # TypeScript interfaces
│   ├── services/         # Business logic (StudentService)
│   └── mongodb.ts        # Database connection singleton
└── hooks/                # Custom React hooks
```

## License

MIT
