import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/SafariTix.png";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        // Check if user is admin/transport company and redirect accordingly
        // For now, we'll assume admin role check would come from the API response
        // You would typically check user.role === 'admin' or user.type === 'transport_company'
        const isAdmin = formData.email.includes('admin') || formData.email.includes('transport');
        navigate(isAdmin ? '/admin' : '/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section login">
      <div className="login-card">
        <div className="login-left">
          <img src={logo} alt="SafariTix" className="login-logo" />
          <h2>Get started
            <br />
            With us
          </h2>
        </div>
        <div className="login-right">
          <h3 className="login-title">SafariTix</h3>
          <p className="login-sub">Welcome Back</p>
          
          {error && (
            <div className="error-message" style={{
              color: '#e74c3c',
              backgroundColor: '#fdf2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              name="email"
              placeholder="example@gmail.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              type="password" 
              name="password"
              placeholder="**********" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="login-row">
              <label className="remember">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a className="forgot" href="#">Forget Password?</a>
            </div>
            <button 
              className="login-submit" 
              type="submit"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="login-footnote">if you dont have an account signup <Link to="/signup" className="login-link">here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

