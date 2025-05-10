import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearPasswordResetState,
} from "../../../Redux/Slicers/PasswordResetSlice";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(
    (state) => state.passwordReset
  );

  // Clear message and error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearPasswordResetState());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="auth-form-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address to receive a password reset link.</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="mt-3 text-center">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
