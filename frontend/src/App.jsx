import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Medicines from "./pages/Medicines";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import Register from "./pages/Register";
import UserManagement from "./pages/UserManagement";
function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicines"
          element={
            <ProtectedRoute>
              <Medicines />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>


  );
}

export default App;