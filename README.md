# Project Management Dashboard

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-yellow.svg)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive **Project Management Dashboard** built with modern web technologies to streamline construction and project-based workflows. This application provides role-based access control for administrators, clients, and labor, enabling efficient project tracking, expense management, reporting, and collaboration.

## 🚀 Features

### Core Functionality

- **Authentication & User Management**: Secure login, OTP verification, password reset, and role-based access (SuperAdmin, PrimeAdmin, BasicAdmin, Client).
- **Dashboard Analytics**: Interactive charts for earnings, project status, and profit tracking using Recharts.
- **Project Lifecycle Management**: Create, edit, delete, share, and monitor projects with detailed sub-modules.

### Project Modules

- **Expense Tracking**: Forms and tables for cost management, labor association, and document uploads.
- **Reporting & Documentation**: Rich text editors (Toast UI, Quill) for site reports, PDF exports, and document viewers.
- **Site Management**: Image galleries, certificates, second fix lists, time schedules, and task scheduling.
- **Client & Labor Tools**: Handover tools, notes, snagging lists, and payment trackers.
- **Shared Resources**: Folder management, notifications, and collaborative sharing.

### Additional Tools

- **Responsive UI**: Built with Ant Design and Tailwind CSS for mobile-friendly interfaces.
- **Data Visualization**: Charts and analytics for project insights.
- **File Handling**: Image uploads, PDF generation, and document viewers.
- **State Management**: Redux Toolkit with persisted authentication and API queries.

## 🛠 Tech Stack

### Frontend

- **React 19.1.0** - UI library for building user interfaces.
- **TypeScript 5.8.3** - Typed JavaScript for better code quality.
- **Vite 7.0.4** - Fast build tool and development server.
- **Redux Toolkit 2.8.2** - State management with React Redux 9.2.0.
- **React Router DOM 7.7.0** - Client-side routing.
- **Ant Design 5.26.6** - UI component library.
- **Tailwind CSS 4.1.11** - Utility-first CSS framework.

### Forms & Validation

- **React Hook Form 7.61.1** - Performant forms with easy validation.
- **Zod 4.0.5** - TypeScript-first schema validation.

### Visualization & Editors

- **Recharts 3.1.0** - Composable charting library.
- **Toast UI Editor 3.2.2** - Rich text editor.
- **Quill 2.0.3** - WYSIWYG editor.
- **html2pdf.js 0.11.2** - Client-side PDF generation.

### Utilities

- **Day.js 1.11.13** - Date manipulation library.
- **SweetAlert2 11.22.2** - Beautiful alert modals.
- **Lucide React 0.525.0** - Icon library.
- **JWT Decode 4.0.0** - Decode JWT tokens.

### Development & Deployment

- **ESLint 9.30.1** - Linting for code quality.
- **Docker & Docker Compose** - Containerization for easy deployment.
- **Nginx** - Web server for production builds.

## 📸 Screenshots

_(Add screenshots here to showcase the dashboard, project details, and key features.)_

- Dashboard Overview
- Project Management Interface
- Expense Tracking Module
- Report Generation

## 🚀 Installation

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Docker (optional, for containerized setup)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/project-management-dashboard.git
   cd project-management-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

### Production Build

1. Build the app:

   ```bash
   npm run build
   ```

2. Preview the build:
   ```bash
   npm run preview
   ```

### Docker Setup

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
   The app will be served on `http://localhost:5173`.

## 📖 Usage

1. **Login**: Use role-based credentials to access the dashboard.
2. **Create Projects**: Navigate to the projects section to add new projects.
3. **Manage Expenses**: Add and track expenses with associated documents.
4. **Generate Reports**: Use the editor to create detailed site reports and export to PDF.
5. **View Analytics**: Monitor project progress and earnings on the dashboard.

For detailed API integration, ensure your backend is running and update `VITE_API_URL` in the environment variables.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- **Author**: Ahmad Musa Vai
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
- **GitHub**: [your-username](https://github.com/your-username)

---

_Built with ❤️ using React, TypeScript, and modern web technologies._
