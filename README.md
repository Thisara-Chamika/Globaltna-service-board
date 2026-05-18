GlobalTNA Service Board
A full-stack, role-based service request board built with Next.js, Node.js/Express, TypeScript, Tailwind CSS, and MongoDB.

🚀 Features Implemented
Core Requirements: Full CRUD operations for service requests, category filtering, and status management.

Decoupled Architecture: Separate Next.js frontend and Node.js/Express backend communicating via APIs.

Bonus - JWT Authentication: Role-based access control separating 'Homeowner' and 'Tradesperson' roles. Only logged-in users can post, manage, or delete requests.

Bonus - Keyword Search: Implemented keyword search functionality across job titles and descriptions.

📂 Project Structure
This is a monorepo containing both the frontend and backend in separate directories:

/frontend: Next.js application

/backend: Node.js/Express API

🛠️ Setup & Run Instructions
Prerequisites
Node.js installed

MongoDB instance (local or MongoDB Atlas)

1. Backend Setup
Navigate to the backend directory:

Bash
cd backend
npm install
Environment Variables (backend/.env):
Create a .env file in the backend directory:

Code snippet
PORT=5000
DATABASE_URL=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
Run Backend:

Bash
npm run dev
The API will start running on http://localhost:5000.

2. Frontend Setup
Open a new terminal and navigate to the frontend directory:

Bash
cd frontend
npm install
Environment Variables (frontend/.env.local or frontend/.env):
Create the environment file in the frontend directory:

Code snippet
NEXT_PUBLIC_API_URL=http://localhost:5000
Run Frontend:

Bash
npm run dev
The Next.js application will run on http://localhost:3000. Open this URL in your browser.
