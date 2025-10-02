import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/SafariTix.png";

function SignupPage() {
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (formError) setFormError("");
  };

  const validate = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return "First and last name are required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!formData.phone.trim()) {
      return "Phone is required";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setIsLoading(true);
    try {
      const { firstName, lastName, email, phone, password } = formData;
      const result = await signup({ firstName, lastName, email, phone, password });
      if (result?.success) {
        navigate("/");
      }
    } catch (err) {
      // error handled via context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section signup">
      <div className="signup-card">
        <div className="signup-left">
          <img src={logo} alt="SafariTix" className="signup-logo" />
          <h2>Create SafariTix
            <br />
            Account
          </h2>
        </div>
        <div className="signup-right">
          <h3 className="signup-title">SafariTix</h3>
          <p className="login-sub">Create your account</p>

          {(formError || error) && (
            <div className="error-message" style={{
              color: '#e74c3c',
              backgroundColor: '#fdf2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {formError || error}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="firstName" 
              placeholder="First name" 
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input 
              type="text" 
              name="lastName" 
              placeholder="Last name" 
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input 
              type="email" 
              name="email" 
              placeholder="example@gmail.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              type="text" 
              name="phone" 
              placeholder="Phone (e.g. +2507...)" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button 
              className="signup-submit" 
              type="submit"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <p className="login-footnote">Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

