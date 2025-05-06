// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import "./login.css";
// import api from "../utils/api";

// function Login() {
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Handle input changes
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Handle form submission
//     const handleSubmit = async (e, type) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             // Determine the endpoint based on the form type
//             const endpoint = type === "register" ? "/api/auth/register" : "/api/auth/login";

//             // Use the environment variable for the base API URL
//             const response = await api.post(
//                 `${import.meta.env.VITE_SOCKET_URL_PROD}${endpoint}`,
//                 formData,
//                 { withCredentials: true } // Ensures cookies (if using JWT)
//             );
//             console.log("API URL:", import.meta.env.VITE_API_URL); // For Vite
//             console.log("Response:", response.data);
//             alert(response.data.message || "Success!");

//             // Handle login-specific actions
//             if (type === "login") {
//                 localStorage.setItem("authToken", response.data.token);
//                 window.location.href = "/dashboard"; // Redirect to the dashboard
//             }
//         } catch (err) {
//             // Display error message
//             setError(err.response?.data?.message || "An error occurred. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={`content d-flex shadow-lg ${isRegistering ? "active" : ""}`} id="content">
//             {/* Registration Form */}
//             <div className="col-md-6 d-flex justify-content-center">
//                 <form onSubmit={(e) => handleSubmit(e, "register")}>
//                     <div className="header-text mb-4">
//                         <h1>Register</h1>
//                     </div>
//                     <div className="input-group mb-3">
//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Name"
//                             className="form-control form-control-lg"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="input-group mb-3">
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Email"
//                             className="form-control form-control-lg"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="input-group mb-3">
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             className="form-control form-control-lg"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     {error && <p className="text-danger">{error}</p>}
//                     <div className="input-group mb-3 justify-content-center">
//                         <button
//                             type="submit"
//                             className="btn border-white text-white w-50 fs-6"
//                             disabled={loading}
//                         >
//                             {loading ? "Registering..." : "REGISTER"}
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             {/* Login Form */}
//             <div className={`col-md-6 right-box ${isRegistering ? "d-none" : ""}`}>
//                 <form onSubmit={(e) => handleSubmit(e, "login")}>
//                     <div className="header-text mb-4">
//                         <h1>Log In</h1>
//                     </div>
//                     <div className="input-group mb-3">
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Email"
//                             className="form-control form-control-lg"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="input-group mb-3">
//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             className="form-control form-control-lg"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="input-group mb-5 d-flex justify-content-between">
//                         <div className="form-check">
//                             <input type="checkbox" className="form-check-input" />
//                             <label className="form-check-label text-secondary">
//                                 <small>Remember me</small>
//                             </label>
//                         </div>
//                         <div className="forgot">
//                             <small>
//                                 <a href="#">Forgot password?</a>
//                             </small>
//                         </div>
//                     </div>
//                     {error && <p className="text-danger">{error}</p>}
//                     <div className="input-group mb-3 justify-content-center">
//                         <button
//                             type="submit"
//                             className="btn border-white text-white w-50 fs-6"
//                             disabled={loading}
//                         >
//                             {loading ? "Logging in..." : "LOGIN"}
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             {/* Switch Panel */}
//             <div className="switch-content">
//                 <div className="switch">
//                     <div className="switch-panel switch-left">
//                         <h1>Hello</h1>
//                         <p>We are happy to see you back</p>
//                         <button
//                             className="btn border-white text-white w-50 fs-6"
//                             onClick={() => setIsRegistering(false)}
//                         >
//                             LOGIN
//                         </button>
//                     </div>
//                     <div className="switch-panel switch-right">
//                         <h1>Welcome</h1>
//                         <p>Sign Up</p>
//                         <button
//                             className="btn border-white text-white w-50 fs-6"
//                             onClick={() => setIsRegistering(true)}
//                         >
//                             REGISTER
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;

// import React, { useState } from "react";
// import "./login.css";
// import api from "../utils/api";

// const Login = () => {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//         // Determine the endpoint based on the form type
//         const endpoint = "/api/auth/login"; // Since registration is not needed, we only use the login endpoint
      
//         // Use the environment variable for the base API URL
//         const response = await api.post(
//           `${import.meta.env.VITE_SOCKET_URL_PROD}${endpoint}`, // Use the environment variable for the base URL
//           { name, password }, // Pass the login credentials
//           { withCredentials: true } // Ensures cookies (e.g., for JWT)
//         );
      
//         console.log("API URL:", import.meta.env.VITE_SOCKET_URL_PROD); // For debugging
//         console.log("Response:", response.data);
//         alert(response.data.message || "Login successful!");
      
//         // Handle login-specific actions
//         localStorage.setItem("authToken", response.data.token); // Save token to localStorage
//         window.location.href = "/dashboard"; // Redirect to the dashboard
//       } catch (err) {
//         // Display error message
//         console.error("Login error:", err.response?.data || err.message);
//         setError(err.response?.data?.message || "An error occurred. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#fcf4fb" }}>
//       <div className="card p-4 shadow-lg rounded-3" style={{ width: "350px", backgroundColor: "#ffffff" }}>
//         <h2 className="text-center fw-bold welcome-text">Welcome Back</h2>
//         <p className="text-center text-muted">Please login to continue</p>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Name:</label>
//             <input
//               type="text"
//               className="form-control custom-input"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Password:</label>
//             <input
//               type="password"
//               className="form-control custom-input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           {error && <p className="text-danger">{error}</p>}
//           <button type="submit" className="btn w-100 fw-bold login-btn" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <p className="text-center mt-3">
//           <a href="#" className="text-primary text-decoration-none">Forgot Password?</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import "./login.css";
import axios from "axios";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { name, password },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      alert(response.data.message || "Login successful!");
      localStorage.setItem("authToken", response.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#fcf4fb" }}>
      <div className="card p-4 shadow-lg rounded-3" style={{ width: "350px", backgroundColor: "#ffffff" }}>
        <h2 className="text-center fw-bold welcome-text">Welcome Back</h2>
        <p className="text-center text-muted">Please login to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name:</label>
            <input
              type="text"
              className="form-control custom-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              className="form-control custom-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn w-100 fw-bold login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;