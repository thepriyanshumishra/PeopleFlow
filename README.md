# PeopleFlow HRMS

An intelligent, Odoo-inspired Human Resource Management System (HRMS) built for modern, scaling organizations. PeopleFlow simplifies core HR operations—attendance tracking, leave requests, employee records, and payroll—under a unified, premium visual interface, enhanced with built-in AI routing.

---

## 🚀 Key Features

*   **Split-Screen Secure Portal**: Visual login screens matching our premium style, with quick-access buttons for instant programmatic demo evaluation (Admin & Employee).
*   **Dual Dashboard Views**:
    *   *Employee Dashboard*: A friendly workspace with personalized greeting banners, easy clock-in/out registers, time-off balances, and automated payslip checks.
    *   *Admin Dashboard*: Quick-scan KPI widgets (Workforce size, hiring status, Payroll expenditure, average tenure), priority AI notifications, and leave approval action sheets.
*   **AI Leave Assistant**: Leverages Google Gemini API to analyze leave descriptions, categorize requests, extract priority indices, and generate summaries to reduce HR load.
*   **Shifts & Attendance**: Real-time checking actions logging active hours, late statuses, and full-day/half-day state determinations with admin logs.
*   **Automated Payroll**: Calculates gross salaries, income taxes, deductions, allowances, and outputs readable monthly payslip summaries.
*   **Corporate Directories**: Searchable listing of active personnel cards, department groupings, division head counts, and managers.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, React Hook Form, React Router DOM, React Query.
*   **Backend**: Node.js, Express, TypeScript.
*   **Database**: PostgreSQL connected through Prisma ORM for fully-typed relational mapping.
*   **AI Integration**: Google Gemini API for intelligent summary processing.

---

## ⚙️ Project Architecture

```text
├── docs/                 # Detailed PRD, API contracts, UI/UX specs, and architectural files
├── backend/              # Express REST API, Prisma schema, and DB transaction managers
└── frontend/             # React Vite Single Page Application containing all UI/UX components
```

For in-depth explanations, refer to our internal specifications:
- [Product Requirement Document](docs/01_PRD.md)
- [Architecture Specifications](docs/02_ARCHITECTURE.md)
- [Database Schema Contract](docs/03_DATABASE.md)
- [Backend API Contract](docs/04_API_CONTRACT.md)
- [UI/UX Style Guidelines](docs/05_UI_UX_GUIDE.md)

---

## 💻 Local Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [PostgreSQL](https://www.postgresql.org/) (v14+ running locally)

---

### 1. Database Configuration
Ensure you have a local PostgreSQL instance running. Create a database named `peopleflow_db`.
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/peopleflow_db"
JWT_SECRET="your_jwt_secret_token"
GEMINI_API_KEY="your_google_gemini_api_key"
```

---

### 2. Backend Setup
1. Open a terminal session and navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Prisma database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed the database with core demo data:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
The backend server runs at `http://localhost:5000`.

---

### 3. Frontend Setup
1. Open another terminal session and navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
The application will be accessible at `http://localhost:5173`.

---

## 🧪 Running Tests & Build Checks

Before pushing code changes to repository branches, ensure all TypeScript interfaces and Vite configs compile cleanly.
From the `/frontend` directory, run:
```bash
npm run build
```

---

## 🤝 Contributing

We welcome contributions to PeopleFlow! Please read our [Contribution Guidelines](CONTRIBUTING.md) to understand our branching strategy, coding conventions, and pull request process.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
