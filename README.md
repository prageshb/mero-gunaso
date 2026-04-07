# Mero Gunaso (मेरो गुनासो)

**Mero Gunaso** is a next-generation, full-stack Public Complaint Management System designed to bridge the gap between citizens and local government authorities. Built with a "Civic Modern" aesthetic, it empowers citizens to report issues, track real-time investigations, and witness community transformation through a transparent, secure digital platform.

---

## 🎨 The Pulse Interface (Frontend)

The frontend is a high-performance, reactive single-page application (SPA) focused on "awe-worthy" visual storytelling and intuitive citizen guidance.

### Core Tech Stack
*   **Framework**: [React 18.3](https://reactjs.org/) (Vite-powered)
*   **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) (Strict mode)
*   **State & Data Sync**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
*   **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom Mesh Gradient foundations
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (built on Radix UI primitives)
*   **Icons**: [Lucide React](https://lucide.dev/) (Modern stroke-based iconography)

### Key Libraries
*   **Forms**: `React Hook Form` + `Zod` (for robust schema-based validation)
*   **Navigation**: `React Router DOM v6`
*   **Networking**: `Axios` (with custom interceptors for JWT handling)
*   **Charts**: `Recharts` (for administrative data visualization)
*   **Notifications**: `Sonner` (High-end toast notifications)
*   **Themes**: `Next Themes` (Adaptive Dark/Light mode support)

---

## ⚙️ Mero Gunaso API (Backend)

The backend is a secure, scalable RESTful API built on the Spring ecosystem, optimized for high data integrity and role-based accountability.

### Core Tech Stack
*   **Framework**: [Spring Boot 3.2.10](https://spring.io/projects/spring-boot)
*   **Language**: [Java 17 (LTS)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
*   **Security**: [Spring Security](https://spring.io/projects/spring-security) (Stateless architecture)
*   **Database**: [MongoDB](https://www.mongodb.com/) (NoSQL)
*   **Build System**: [Maven](https://maven.apache.org/)

### Key Features & Libraries
*   **Authentication**: JWT (JSON Web Tokens) using [jjwt 0.12.3](https://github.com/jwtk/jjwt)
*   **Data Access**: [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)
*   **Validation**: `Spring Boot Starter Validation` (Hibernate Validator)
*   **Security Logic**: BCrypt password hashing and Role-based Access Control (RBAC)
*   **IDs**: Atomic ID generation via a `database_sequences` collection in MongoDB

---

## 🚀 Platform Features

### 👤 Citizen Experience
*   **Public Portal**: An immersive homepage featuring a "Pulse" of community activity and a live resolution timeline.
*   **Secured Submission**: Multi-step reporting flow with specialized "Identity" and "Report" sections.
*   **Privacy-First Design**: Citizens can mark reports as **Public** (visible to community) or **Private** (exclusive to authorities).
*   **Tracking Pulse**: Searchable feed and status tracking using unique, human-readable **Ticket IDs**.
*   **Interactive Journey**: A scrolling "Resolution Map" explaining the internal government workflow.

### 👮 Administrative Tools (Admin & Super Admin)
*   **Dynamic Dashboard**: Real-time "Pill" statistics and visual charts for department-wide performance tracking.
*   **Complaint Hub**: Server-side paginated management of reports with status updating (Not Opened → In Progress → Resolved).
*   **Case Notes**: Admins can attach official notes to resolution updates for citizen transparency.
*   **Audit Logging**: A strictly monitored log of all administrative actions (status changes, edits) to ensure accountability.
*   **Department Governance**: Super Admins can manage government departments, categories, and descriptions.
*   **User Management**: Super Admin control over Admin account creation and secure password resets.

---

## 🛠️ Getting Started

### Prerequisites
*   **Node.js**: v18.0 or higher
*   **Java**: JDK 17
*   **Database**: MongoDB (Local or Atlas)

### 1. Backend Setup
1.  Navigate to the `backend` directory.
2.  Configure your MongoDB URI in `src/main/resources/application.properties`.
3.  Run the application using your IDE or Maven:
    ```sh
    ./mvnw spring-boot:run
    ```

### 2. Frontend Setup
1.  Navigate to the root directory.
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run dev
    ```

---

## 🛡️ Security Architecture
*   **Roles**: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`.
*   **JWT Protection**: All non-public endpoints are protected via JWT filters.
*   **Frontend Guarding**: Protected routes and context-based permissioning prevent unauthorized access to Admin panels.

---
*Created with ❤️ for community transparency and civic progress.*