import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// AUTH
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';

// PAGES
import Home from './Pages/User/Home';
import AboutUs from './Pages/User/AboutUs';
import Contact from './Pages/User/Contact';
import Category from './Pages/User/Category';
import DetailProduct from './Pages/User/DetailProduct';
import Product from './Pages/User/Product';
import ProductsByCategory from './Pages/User/ProductsByCategory';
import NotFoundPage from './Pages/User/NotFoundPage';
import UserProfilePage from './Pages/User/UserProfilePage';
import Checkout from './Pages/User/Checkout';
import MyOrder from './Pages/User/MyOrder';
import OrderSuccess from './Pages/User/OrderSuccess';
import FloatingCart from './Components/User/FloatingCart';
import { CartProvider } from './contexts/CartContext';

// ADMIN PAGES
import DashboardPage from './Pages/Admin/DashboardPage';
import MyProfilePage from './Pages/Admin/MyProfilePage';
import ProductList from './Pages/Admin/ProductList';
import OrderListPage from './Pages/Admin/OrderList';
import UserListPage from './Pages/Admin/UserListPage';
import CategoryListPage from './Pages/Admin/Category';

// Routes
import PrivateRoute from './Auth/PrivateRoute';
import AdminRoute from './Auth/AdminRoute';

const CheckTokenExpiration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenTimestamp = localStorage.getItem('tokenTimestamp');
      if (tokenTimestamp) {
        const now = new Date().getTime();
        const elapsed = now - parseInt(tokenTimestamp, 10);
        const expirationTime = 60 * 60 * 1000; // 1 jam

        if (elapsed >= expirationTime) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('tokenTimestamp');
          alert("Sesi Anda telah berakhir. Silakan login kembali.");
          navigate('/login');
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // periksa setiap 1 menit
    checkTokenExpiration(); // langsung periksa saat mount

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <CheckTokenExpiration />
        <div className="app-container">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category" element={<Category />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/products" element={<ProductsByCategory />} />
            <Route path="/" element={<Home />} />
            <Route path="/products/:id_category" element={<ProductsByCategory />} />
            <Route path="/products/detail-product/:id" element={<DetailProduct />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* USER ROUTES (accessible to authenticated users only) */}
            <Route path="/user-profile" element={<PrivateRoute element={<UserProfilePage />} />} />
            <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
            <Route path="/logout" element={<PrivateRoute element={<Logout />} />} />
            <Route path="/my-order" element={<PrivateRoute element={<MyOrder />} />} />
            <Route path="/order-success" element={<PrivateRoute element={<OrderSuccess />} />} />

            {/* ADMIN ROUTES (accessible to admin only) */}
            <Route
              path="/dashboard"
              element={<AdminRoute element={<DashboardPage />} />}
            />
            <Route
              path="/dashboard/my-profile"
              element={<AdminRoute element={<MyProfilePage />} />}
            />
            <Route
              path="/dashboard/product-list"
              element={<AdminRoute element={<ProductList />} />}
            />
            <Route
              path="/dashboard/user-list"
              element={<AdminRoute element={<UserListPage />} />}
            />
            <Route
              path="/dashboard/category-list"
              element={<AdminRoute element={<CategoryListPage />} />}
            />
            <Route
              path="/dashboard/order-list"
              element={<AdminRoute element={<OrderListPage />} />}
            />

            {/* Fallback route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <FloatingCart />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;