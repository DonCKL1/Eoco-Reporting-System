# EOCO Reporting System

A comprehensive and secure platform for reporting, tracking, and managing cases. The system features multiple role-based dashboards (Citizen, Officer, Supervisor, Admin) to ensure a streamlined workflow for handling reports, tracking progress, and managing evidence.

## 🚀 Features

*   **Role-Based Access Control**: Tailored dashboards and permissions for Citizens, Officers, Supervisors, and Administrators.
*   **Anonymous Reporting**: Securely submit reports without exposing personal identity.
*   **Evidence Management**: Upload and manage media/files securely.
*   **Real-time Notifications**: Keep all stakeholders updated on case status changes and assignments.
*   **Analytics & Dashboard**: Interactive charts and statistics for supervisors and admins to monitor platform metrics.
*   **Wanted Persons Directory**: Publicly accessible database of persons of interest.

## 🛠 Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand (State Management), React Query.
*   **Backend**: Laravel (PHP), MySQL.
*   **Authentication**: Laravel Sanctum.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [PHP](https://www.php.net/) (v8.1 or newer)
*   [Composer](https://getcomposer.org/)
*   [Node.js](https://nodejs.org/) (v18 or newer)
*   [MySQL](https://www.mysql.com/) (or XAMPP/WAMP for local development)

## ⚙️ Installation Guide

### 1. Clone the repository
```bash
git clone https://github.com/DonCKL1/Eoco-Reporting-System.git
cd Eoco-Reporting-System
```

### 2. Backend Setup (Laravel)
```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file and generate application key
cp .env.example .env
php artisan key:generate

# Configure your database credentials in the .env file
# DB_DATABASE=eoco_system (Make sure to create this database in MySQL)
# DB_USERNAME=root
# DB_PASSWORD=

# Run database migrations and seed initial users/roles
php artisan migrate --seed

# Link storage for uploaded files and evidence
php artisan storage:link

# Start the Laravel development server
php artisan serve
```

### 3. Frontend Setup (React/Vite)
Open a new terminal window/tab:
```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

## 🌐 Running the Application

*   **Frontend User Interface**: Open your browser and go to `http://localhost:5173`
*   **Backend API**: The API will be running at `http://localhost:8000`

---
*Developed for the Economic and Organised Crime Office (EOCO) Reporting Workflow.*