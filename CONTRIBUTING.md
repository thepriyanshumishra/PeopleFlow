# Contributing to PeopleFlow

Thank you for your interest in contributing to PeopleFlow HRMS! To maintain code quality, UI consistency, and database integrity, we follow a structured contribution flow.

---

## 🚦 Pull Request Lifecycle

To make updates or implement new features, please follow these steps:

### 1. Create a New Branch
Do not commit directly to the `main` branch. Create a descriptive local branch:
```bash
# For feature additions
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b bugfix/your-fix-name
```

### 2. Implementation Guidelines
*   **Aesthetics & UX**: Refer to [docs/05_UI_UX_GUIDE.md](docs/05_UI_UX_GUIDE.md). Ensure rounded card outlines, friendly font typography (`Caveat`, `Manrope`), and clean spacing align with Odoo's design philosophies.
*   **Database Schema**: If database migrations are required, modify `backend/prisma/schema.prisma` and execute `npx prisma migrate dev --name <migration_name>` locally. Keep data model normalized.
*   **API Integrity**: Refer to [docs/04_API_CONTRACT.md](docs/04_API_CONTRACT.md) to check endpoints and types before adding routing integrations.

### 3. Pre-Commit Validation
Before staging your changes, always verify that your code compiles correctly without errors.
Navigate to the `/frontend` directory and compile the project:
```bash
npm run build
```
Verify that the output contains zero TypeScript compilation or bundle warnings.

### 4. Push & Send a Pull Request (PR)
1. Commit your changes locally with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: implement daily check-in logs overlay cards"
   ```
2. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request on the main repository:
   - Provide a detailed summary of the changes made.
   - Attach screenshots or screen recordings showing UI/UX updates where applicable.
   - Reference any related issue ticket number in the PR description.

---

## 🎨 Coding Conventions
*   **Lucide-React Icons**: Do not use raw Google Material Symbol HTML spans or ligatures. Use local SVG Lucide components to prevent rendering fallbacks when offline.
*   **Component Modularity**: Keep frontend components modular, reusable, and type-safe.
*   **Environment Files**: Do not commit secrets, database passwords, or Google Gemini keys to public repositories. Always list them in `.gitignore`.
