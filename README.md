# GlobalTNA Service Board

A full-stack, role-based service request board built with Next.js, Node.js/Express, TypeScript, Tailwind CSS, and MongoDB.

## 🚀 Features Implemented

* **Core Requirements:** Full CRUD operations for service requests, category filtering, and status management.
* **Decoupled Architecture:** Separate Next.js frontend and Node.js/Express backend communicating via APIs.
* **Bonus - JWT Authentication:** Role-based access control separating 'Homeowner' and 'Tradesperson' roles. Only logged-in users can post, manage, or delete requests.
* **Bonus - Keyword Search:** Implemented keyword search functionality across job titles and descriptions.

## 📂 Project Structure
This is a monorepo containing both the frontend and backend in separate directories:
* `/frontend`: Next.js application
* `/backend`: Node.js/Express API

## 🛠️ Setup & Run Instructions

### Prerequisites
* Node.js installed
* MongoDB instance (local or MongoDB Atlas)

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
npm install
