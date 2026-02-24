import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

// Store Pages
import { Home } from "./pages/store/Home";
import { Shop } from "./pages/store/Shop";
import { Cart } from "./pages/store/Cart";
import { About } from "./pages/store/About";
import { Contact } from "./pages/store/Contact";

// Admin Pages
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminProducts } from "./pages/admin/Products";
import { AddProduct } from "./pages/admin/AddProduct";
import { EditProduct } from "./pages/admin/EditProduct";

// Components
import { FloatingButtons } from "./components/FloatingButtons";
import { getProducts } from "./utils/supabase";

function App() {
  useEffect(() => {
    // Preload products on app startup
    console.log("App started - preloading products...");
    getProducts()
      .then(() => {
        console.log("Products preloaded successfully");
      })
      .catch((err) => {
        console.error("Failed to preload products:", err);
      });
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <FloatingButtons />
      <Routes>
        {/* Store Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AddProduct />} />
        <Route path="/admin/products/:id/edit" element={<EditProduct />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
