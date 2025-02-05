import style from "./Login.module.css";
import LoginImage from "../../assets/images/login.webp";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext.jsx";
import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;
export default function Login() {
  const navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);

  let { sendDataToLogin, token, setToken } = useContext(UserContext);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("email is required")
      .email("please enter a valid email"),
    password: Yup.string()
      .required("password is required")
      .matches(/^[A-Z]/, "password must start with uppercase letter"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,
    onSubmit: async function (values) {
      setIsLoading(true);
    
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          username: values.email,
          password: values.password,
        }, {
          headers: {
            "Content-Type": "application/json",  // Ensure the correct content type
          }
        });
    
        console.log('API Response:', response.data);  // Log the response for debugging
    
        // Check if the token exists in the response
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          navigate("/"); // Redirect to home page after successful login
        } else {
          alert("Login failed: Token not found.");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred while logging in.");
      } finally {
        setIsLoading(false);
      }
    }
    
    
    
    
  });

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className={`${style.container} row`}>
        <figure className="col-md-8 m-0 p-md-0">
          <div className="image-container">
            <img src={LoginImage} className="w-100" alt="Regsiter Image" />
          </div>
        </figure>
        <form
          className="col-md-4 d-flex flex-column justify-content-center px-5"
          onSubmit={formik.handleSubmit}
        >
          <h2 className="m-0 fw-bold font-Montserrat">
            Welcome Back <i className="fa-solid fa-heart ms-0 text-main"></i>
          </h2>
          <p className="mb-3">
            Thanks for returning! Please sign in to access your account.
          </p>
          <div className="form-group d-flex flex-column gap-2 justify-content-center">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />

            {formik.errors.email && formik.touched.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : (
              ""
            )}

            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />

            {formik.errors.password && formik.touched.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : (
              ""
            )}

            <button type="submit" className="btn btn-main">
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Login"
              )}
            </button>
            <p>
              You don't have account yet ?
              <Link to="/signup" className="text-decoration-underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
