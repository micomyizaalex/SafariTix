import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookingManagement from "./pages/AdminBookingManagement";
import logo from "./images/SafariTix.png";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <ul className="menu-left">
        <li><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link></li>
        <li>About us</li>
        <li>Products</li>
        <li>Features</li>
        <li>Company</li>
      </ul>
      <div className="logo">
        <img src={logo} alt="SafariTix Logo" className="logo-img" />
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <span style={{ color: "#fff", marginRight: "10px", fontSize: "14px" }}>
              Welcome, {user?.firstName}
            </span>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";
  const isAdmin = location.pathname === "/admin" || location.pathname === "/dashboard" || location.pathname.startsWith("/admin/") || location.pathname === "/admin/bookings";

  useEffect(() => {
    if (isAuth || isAdmin) {
      document.body.classList.add("no-navbar");
    } else {
      document.body.classList.remove("no-navbar");
    }
  }, [isAuth, isAdmin]);

  return (
    <AuthProvider>
      <div className={`page${isAuth || isAdmin ? " no-nav" : ""}`}>
        {!isAuth && !isAdmin && <Navbar />}

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookingManagement />} />
          </Routes>
        </main>

        {!isAuth && !isAdmin && (
          <footer className="footer">
            <div className="section footer-top">
              <div className="footer-col">
                <h4>SafariTix</h4>
                <p className="muted">Fast, reliable bus ticketing for commuters and operators.</p>
                <div className="social">
                  <a href="#" aria-label="Twitter" title="Twitter">T</a>
                  <a href="#" aria-label="Facebook" title="Facebook">F</a>
                  <a href="#" aria-label="LinkedIn" title="LinkedIn">in</a>
                </div>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.9 }}>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Support</a></li>
                  <li><a href="#">Terms & Privacy</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Newsletter</h4>
                <p className="muted">Get product updates and transport tips.</p>
                <div className="newsletter">
                  <input type="email" placeholder="Your email" aria-label="Email" />
                  <button>Subscribe</button>
                </div>
              </div>
            </div>
            <div className="site-footer">
              <p>&copy; 2025 SafariTix. All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </AuthProvider>
  );
}
export default App;
