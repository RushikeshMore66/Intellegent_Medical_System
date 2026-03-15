# PharmaOS - Intelligent Medical System

PharmaOS is a modern, full-stack pharmacy management system designed to streamline medical inventory, billing, and reporting processes. Built with a FastAPI backend and a React frontend, it provides a robust and scalable solution for pharmacies to manage their operations efficiently.

## 🚀 Features

- **Dashboard**: Real-time overview of sales, inventory status, and key metrics.
- **Medicine Management**: Comprehensive database for tracking medicines, categories, and batches.
- **Inventory Tracking**: Manage stock levels, expiry dates, and automated stock alerts.
- **Supplier & Purchase Management**: Track suppliers and streamline the purchasing process.
- **Billing & POS**: Fast and efficient billing system with GST calculation and invoice generation.
- **User Management**: Role-based access control (Admin/Staff) for secure system operations.
- **Reporting**: Detailed sales and inventory reports for data-driven decision making.

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Authentication**: JWT (JSON Web Tokens)

### Frontend
- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Charts**: Recharts

## ⚙️ Local Setup

### Prerequisites
- Python 3.8+
- Node.js (v18+)
- PostgreSQL

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Medical_system
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/pharmaos
   SECRET_KEY=your_secret_key
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run migrations (if applicable)**:
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📜 License
Distribute under the MIT License.
