import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { TraceSpinner } from "react-spinners-kit";
import { jwtDecode } from "jwt-decode";

import MainLayout from "../components/MainLayout";
import Header from "../components/Header";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validation = () => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const emailValidation = emailRegex.test(credentials.email);

    setErrors((prev) => ({ ...prev, email: emailValidation }));

    const passwordRegex = {
      length: /^.{8}/,
      number: /[0-9]/,
      lowercases: /[a-z]/,
      uppercases: /[A-Z]/,
      special: /[#?!@$%^&*-]/,
    };

    const passwordValidation = {
      length: passwordRegex.length.test(credentials.password),
      number: passwordRegex.number.test(credentials.password),
      lowercases: passwordRegex.lowercases.test(credentials.password),
      uppercases: passwordRegex.uppercases.test(credentials.password),
      special: passwordRegex.special.test(credentials.password),
    };

    if (Object.values(passwordValidation).every((field) => field)) {
      setErrors((prev) => ({ ...prev, password: true }));
    } else {
      setErrors((prev) => ({ ...prev, password: false }));
    }
    console.log(errors.password);
  };
  // const notify = () => toast.success("Credentials validated.");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(() => true);

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:7000/login", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        // if (!response.ok) {
        //   setTimeout(() => {
        //     setIsLoading(() => false);
        //     navigate("/");
        //     toast.success("Credentials Invalidated.");
        //   }, 5000);

        //   throw new Error("Network response was not ok");
        // }

        if (response.status >= 400 && response.status < 500) {
          setTimeout(() => {
            setIsLoading(() => false);
            navigate("/");
            response.json().then((data) => {
              toast.success(data.msg);
            });
          }, 3000);
        }

        // const data = await response.json();
        // console.log("Data received:", data);

        setCredentials(() => ({
          email: "",
          password: "",
        }));

        if (response.status >= 200 && response.status < 300) {
          setTimeout(() => {
            setIsLoading(() => false);
            navigate("/");
            response.json().then((data) => {
              const token = data.token;
              const decoded = jwtDecode(token);
              localStorage.setItem("role", decoded.role);
              localStorage.setItem("token", token);
              toast.success(data.msg);
            });
          }, 3000);
        }
      } catch (error) {
        setTimeout(() => {
          setIsLoading(() => false);
          navigate("/");
          response.json().then((data) => {
            toast.success(data.msg);
          });
        }, 3000);

        console.error("Error during fetch:", error.message);
      }
    };
    fetchData();
  };

  return (
    <div className="flex flex-col  items-center justify-start h-screen w-full  bg-slate-100">
      <Header getRole={localStorage.getItem("role")} />
      {isLoading ? (
        <div className="h-screen flex items-center">
          <TraceSpinner size={50} frontColor="#0ea5e9" loading={true} />
        </div>
      ) : (
        <MainLayout>
          <section className="container flex justify-center items-center h-screen ">
            <div className="w-full max-w-sm mx-auto bg-slate-200 p-5 rounded-xl border border-gray-700">
              <h1 className=" text-4xl  text-center mb-4  ">Login</h1>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className=" font-semibold block">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={credentials.email}
                    onChange={(e) => {
                      validation();
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                    placeholder="Enter email"
                    className={`placeholder:text-slate-800  text-slate-800  rounded-lg px-4 py-3 outline-none border ${
                      credentials.email.length === 0
                        ? "border-slate-800"
                        : credentials.email.length > 0 && !errors.email
                        ? "border-red-500"
                        : "border-slate-800"
                    }`}
                  />
                  {credentials.email.length === 0 ? (
                    ""
                  ) : credentials.email.length > 0 && !errors.email ? (
                    <p className="text-red-500 text-xs mt-1">
                      Email is required / valid Email is required
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="password" className=" font-semibold block">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    className={`placeholder:text-slate-800  text-slate-800  rounded-lg px-4 py-3 outline-none border `}
                    value={credentials.password}
                    onChange={(e) => {
                      validation();
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                  />

                  {/* {credentials.password.length === 0 ? (
                    ""
                  ) : credentials.password.length > 0 && !errors.password ? (
                    <p className="text-red-500 text-xs mt-1">
                      password is required / valid password is required
                    </p>
                  ) : (
                    ""
                  )} */}
                </div>

                <button
                  type="submit"
                  onClick={handleLoginSubmit}
                  className="bg-primary text-slate-100 bg-blue-600 font-bold text-lg py-2 px-4 w-full rounded-lg my-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
                <p className="text-md font-semibold flex  gap-2 justify-evenly ">
                  Do not have an account?{" "}
                  <Link to="/register" className="text-blue-600">
                    Register now
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </MainLayout>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LoginPage;
