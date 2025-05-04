import React from "react";
import { useInput } from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";
import { useThunk } from "../../hooks/use-thunk";
import { registerUser } from "../../store/thunks/userThunks";
import showToast from "../../utils/toastNotifications";
import { isEmail, isNotEmpty } from "../../utils/Validation";

const RegisterForm = ({ role }) => {
  const navigate = useNavigate();
  const [doRegister, isRegistering] = useThunk(registerUser);

  const {
    value: username,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
  } = useInput("", isNotEmpty);

  const {
    value: email,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", isEmail);

  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", isNotEmpty);

  const isValid =
    username &&
    !usernameHasError &&
    email &&
    !emailHasError &&
    password &&
    !passwordHasError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      showToast("error", "Please fix validation errors before registering");
      return;
    }

    const payload = {
      username,
      email: email.toLowerCase(),
      password,
      role,
    };

    const result = await doRegister(payload);

    if (result.success) {
      showToast("success", "Registration successful! Please login.");
      navigate("/");
    } else {
      showToast("error", result.error?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 bg-[#121212] text-white w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-[#06C167] text-center">
          {role} Registration
        </h2>

        <div>
          <label>Username *</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            placeholder="Enter your name"
          />
          {usernameHasError && (
            <p className="text-red-500 text-sm">Username cannot be empty</p>
          )}
        </div>

        <div>
          <label>Email *</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="Enter your email"
          />
          {emailHasError && (
            <p className="text-red-500 text-sm">Please enter a valid email</p>
          )}
        </div>

        <div>
          <label>Password *</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            placeholder="Enter a password"
          />
          {passwordHasError && (
            <p className="text-red-500 text-sm">Password cannot be empty</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 font-bold rounded-md transition-colors duration-300 ${
            isValid
              ? "bg-[#06C167] hover:bg-[#04894e] text-black cursor-pointer"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {isRegistering ? "Registering..." : "Register"}
        </button>
        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <span
            className="text-[#06C167] hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
