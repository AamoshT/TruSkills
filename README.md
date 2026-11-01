# TruSkills

**A student-to-student skills marketplace for discovering, offering, and booking services within a university community.**

TruSkills connects students who have useful skills with students who need them. Whether it's tutoring, photography, design, programming, music lessons, résumé help, or another student service, TruSkills provides one place to discover providers, book services, communicate, and manage the entire process.

Built with a **microservices architecture**, TruSkills combines real-time communication, event-driven services, caching, recommendations, and secure authentication into a scalable full-stack marketplace.

---

## Features

### Student Marketplace

- Discover services offered by other students
- Search and filter services by category
- View detailed service and provider profiles
- Save services for later
- Book services directly through the platform
- Track active and completed bookings

### Provider Experience

- Create and manage a provider profile
- Create, update, and manage service listings
- Configure pricing, packages, and service details
- Manage incoming bookings
- Create discounts and promotional offers
- Track services and customer activity through a dedicated dashboard

### Authentication & Security

- Email-based account registration
- OTP email verification
- Secure login and logout
- Access and refresh token authentication
- Password recovery and reset
- Role-based authorization
- HTTP-only cookie-based sessions
- Protected user and provider routes

### Real-Time Communication

- Direct messaging between students and providers
- Real-time conversations using WebSockets
- Conversation history
- Booking-related communication

### Personalized Recommendations

TruSkills uses user activity to provide personalized service recommendations.

Events such as service views, searches, saves, and bookings are streamed through Kafka and processed by the recommendation system to continuously improve suggestions.

### Payments & Booking

- Secure checkout flow
- Provider payment onboarding
- Booking and order management
- Payment status tracking
- Service discounts and promotional codes

---

## Architecture

TruSkills follows a distributed **microservices architecture** with independently responsible services communicating through APIs and asynchronous events.

```text
                         ┌─────────────────────┐
                         │      Frontend       │
                         │   Next.js / React   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway     │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌──────────────┐       ┌─────────────┐
      │    Auth     │       │   Service    │       │   Booking   │
      │   Service   │       │   Service    │       │   Service   │
      └─────────────┘       └──────────────┘       └─────────────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │       Kafka         │
                         │    Event Stream     │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
                  ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │ Recommendation   │                │       Chat       │
        │     Service      │                │     Service      │
        └──────────────────┘                └──────────────────┘

              MongoDB Atlas • Redis • WebSockets
```

### Service Responsibilities

| Service | Responsibility |
| --- | --- |
| **API Gateway** | Central entry point and request routing |
| **Auth Service** | Registration, authentication, OTP verification, token management, and account recovery |
| **Service/Listing Service** | Service creation, discovery, categories, provider listings, and service management |
| **Booking Service** | Booking lifecycle, pricing, discounts, and transaction state |
| **Chat Service** | Real-time communication and conversation management |
| **Recommendation Service** | Personalized service and provider recommendations |
| **Kafka Pipeline** | Asynchronous communication and user activity events |

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- React Hook Form

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- REST APIs
- WebSockets

### Data & Infrastructure

- MongoDB Atlas
- Redis
- Apache Kafka
- Docker
- AWS EC2
- AWS ECR

### Authentication

- JWT access and refresh tokens
- HTTP-only cookies
- OTP email verification
- SMTP
- Role-based access control

### Recommendation System

- Kafka event streams
- Redis for fast user state
- MongoDB for persistent interaction data
- TensorFlow-based recommendation processing

### Development & DevOps

- Nx Monorepo
- Docker / Docker Compose
- GitHub Actions
- GitHub
- CI/CD

---

## Repository Structure

```text
TruSkills/
│
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-ui/
│   ├── seller-ui/
│   ├── listing-service/
│   ├── booking-service/
│   ├── chat-service/
│   └── recommendation-service/
│
├── packages/
│   ├── middleware/
│   ├── shared-types/
│   └── shared-utils/
│
├── docker-compose.yml
├── nx.json
├── package.json
└── README.md
```

> Internal service names may retain `seller` terminology while the product-facing experience refers to students offering services as **providers**.

---

## Event-Driven Recommendations

User interactions generate events that can be consumed asynchronously without blocking the main application flow.

```text
Student Action
      │
      ▼
API / Service
      │
      ▼
Kafka Event
      │
      ├──────────────► Analytics / Activity Processing
      │
      ▼
Recommendation Service
      │
      ├── Redis User State
      │
      └── MongoDB Interaction History
      │
      ▼
Recommendation Model
      │
      ▼
Personalized Services
```

Example events include:

```text
service.viewed
service.saved
service.searched
booking.created
booking.completed
provider.viewed
```

This keeps recommendation processing decoupled from the core marketplace services and allows the system to scale independently.

---

## Authentication Flow

```text
Register
   │
   ▼
Email OTP
   │
   ▼
Verify Account
   │
   ▼
Login
   │
   ├── Access Token
   └── Refresh Token
           │
           ▼
     HTTP-only Cookies
           │
           ▼
     Protected Routes
```

When an access token expires, the frontend can request a new token using the refresh token without requiring the user to log in again.

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Docker
- Docker Compose
- Git

You will also need access to the external services configured for the project, including MongoDB, Redis, email delivery, and any payment infrastructure.

### Clone the Repository

```bash
git clone https://github.com/AamoshT/TruSkills.git
cd TruSkills
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create the required `.env` and `.env.local` files for the services you intend to run.

Example:

```env
DATABASE_URL=
REDIS_DATABASE_URI=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

NEXT_PUBLIC_SERVER_URI=http://localhost:8080
NEXT_PUBLIC_SERVER_URL=http://localhost:8080
```

Never commit real credentials or secrets to the repository.

### Generate Prisma Client

```bash
npx prisma generate
```

If setting up the database for the first time:

```bash
npx prisma db push
```

### Start Backend Services

```bash
npm run dev
```

### Start the Student UI

```bash
npm run user-ui
```

### Start the Provider UI

```bash
npm run seller-ui
```

The exact ports used by individual services can be configured through their respective environment files.

---

## Docker

Services can be containerized independently and orchestrated using Docker Compose.

```bash
docker compose up --build
```

Each service maintains its own responsibility while shared infrastructure such as Kafka and Redis can be provided through the development Compose environment.

---

## CI/CD

TruSkills uses GitHub Actions to automate the development and deployment workflow.

The pipeline can perform:

```text
Push / Pull Request
        │
        ▼
Install Dependencies
        │
        ▼
Lint & Type Check
        │
        ▼
Build / Test
        │
        ▼
Build Docker Images
        │
        ▼
Push to Amazon ECR
        │
        ▼
Deploy Services
```

---

## Design Philosophy

TruSkills was built around a simple idea: **students already have valuable skills, but discovering those skills within a campus community is unnecessarily difficult.**

Instead of treating every student as only a buyer or only a seller, TruSkills allows the same student to participate on both sides of the marketplace.

The technical architecture follows the same principle of flexibility. Authentication, listings, bookings, messaging, and recommendations are separated so that individual parts of the platform can evolve and scale without requiring the entire system to be rewritten.

---

## Future Improvements

Potential extensions include:

- University email/domain verification
- Provider ratings and reviews
- Availability calendars
- Smarter recommendation models
- Semantic service search
- Provider analytics
- Push notifications
- Dispute and refund workflows
- Multi-university support
- Mobile applications

---

## Contributors

**Ananga Tripathee**  
Computer Science — Truman State University

**Aamosh Thapa**  
Computer Science — Truman State University

---

## License

This project is intended for educational and portfolio purposes. Add an appropriate open-source license before redistributing or accepting external contributions.