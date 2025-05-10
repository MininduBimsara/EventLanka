import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  verifyResetToken,
  resetPassword,
  clearPasswordResetState,
} from "../Slicers/PasswordResetSlice";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, message, error, tokenValid, resetSuccess } = useSelector(
    (state) => state.passwordReset
  );

  // Verify token when component mounts
  useEffect(() => {
    if (token) {
      dispatch(verifyResetToken(token));
    }

    // Clear state when component unmounts
    return () => {
      dispatch(clearPasswordResetState());
    };
  }, [token, dispatch]);

  // Redirect to login after successful password reset
  useEffect(() => {
    if (resetSuccess) {
      // Show success message for 3 seconds, then redirect
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [resetSuccess, navigate]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    dispatch(resetPassword({ token, password }));
  };

  // If token is invalid, show error message
  if (error && !tokenValid) {
    return (
      <div className="auth-form-container">
        <div className="alert alert-danger">{error}</div>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="btn btn-primary">
            Request New Password Reset
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <h2>Reset Password</h2>
      <p>Enter your new password below.</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-control"
          />
          {passwordError && <div className="text-danger">{passwordError}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !tokenValid}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="mt-3 text-center">
          <a href="/login">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
