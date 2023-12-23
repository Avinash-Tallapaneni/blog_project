import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

import MainLayout from "../components/MainLayout";
import { TraceSpinner } from "react-spinners-kit";
import Header from "../components/Header";

const RegisterPage = () => {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: {
      length: false,
      number: false,
      lowercases: false,
      uppercases: false,
      special: false,
    },
    confirmPassword: false,
    passwordMsgRing: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const notify = () => toast.success("Credentials validated.");

  const validation = () => {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;

    const nameValidation = nameRegex.test(register.name);
    setErrors((prev) => ({ ...prev, name: nameValidation }));

    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const emailValidation = emailRegex.test(register.email);

    setErrors((prev) => ({ ...prev, email: emailValidation }));

    const passwordRegex = {
      length: /^.{8}/,
      number: /[0-9]/,
      lowercases: /[a-z]/,
      uppercases: /[A-Z]/,
      special: /[#?!@$%^&*-]/,
    };

    const passwordValidation = {
      length: passwordRegex.length.test(register.password),
      number: passwordRegex.number.test(register.password),
      lowercases: passwordRegex.lowercases.test(register.password),
      uppercases: passwordRegex.uppercases.test(register.password),
      special: passwordRegex.special.test(register.password),
    };

    setErrors((prev) => ({ ...prev, password: passwordValidation }));

    if (Object.values(passwordValidation).every((field) => field)) {
      setErrors((prev) => ({ ...prev, passwordMsgRing: true }));
    } else {
      setErrors((prev) => ({ ...prev, passwordMsgRing: false }));
    }

    if (register.confirmPassword.length > 0) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: register.password === register.confirmPassword,
      }));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(() => true);

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:7000/register", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: register.name,
            email: register.email,
            password: register.password,
            imageUrl:
              "https://png.pngtree.com/png-clipart/20230813/original/pngtree-circular-vector-avatar-illustrationfemale-business-business-person-up-vector-picture-image_10581241.png",

            role: "user",
          }),
        });

        // if (!response.ok) {
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

        setRegister(() => ({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
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

    // setTimeout(() => {
    //   setIsLoading(() => false);
    //   navigate("/");
    //   console.log("here");
    //   notify();
    // }, 2000);
  };

  useEffect(() => {
    validation();
  }, [register]);

  return (
    <div className="flex flex-col  items-center justify-start h-screen w-full   bg-slate-100">
      <Header />
      {isLoading ? (
        <div className="h-screen flex items-center">
          <TraceSpinner size={50} frontColor="#0ea5e9" loading={true} />
        </div>
      ) : (
        <MainLayout>
          <section className="container flex justify-center items-center  py-10">
            <div className="w-full max-w-sm mx-auto bg-slate-200 p-5 rounded-xl border border-gray-700">
              <h1 className="text-4xl text-center  mb-4">Sign Up</h1>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="name" className="font-semibold block">
                    Name
                  </label>
                  <div>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter name"
                      value={register.name}
                      onChange={(e) => {
                        setRegister((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                        validation();
                      }}
                      className={`placeholder:text-slate-800 w-full text-slate-800  rounded-lg px-4 py-3 outline-none border ${
                        errors.name ? "border-green-600" : "border-red-500"
                      }`}
                    />

                    <p
                      className={`${
                        errors.name ? "text-green-600" : "text-red-500"
                      } text-xs mt-1`}
                    >
                      Name length must be at least 3 character
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className=" font-semibold block">
                    Email
                  </label>
                  <div>
                    <input
                      type="email"
                      id="email"
                      value={register.email}
                      onChange={(e) => {
                        setRegister((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }));
                        validation();
                      }}
                      placeholder="Enter email"
                      className={`placeholder:text-slate-800 w-full  text-slate-800  rounded-lg px-4 py-3 outline-none border ${
                        errors.email ? "border-green-500" : "border-red-500"
                      }`}
                    />
                    <p
                      className={`${
                        errors.email ? "text-green-500" : "text-red-500"
                      } text-xs mt-1`}
                    >
                      Email is required / valid Email is required
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="password" className=" font-semibold block">
                    Password
                  </label>
                  <div>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter password"
                      value={register.password}
                      onChange={(e) => {
                        setRegister((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));
                        validation();
                      }}
                      className={`placeholder:text-slate-800 w-full  text-slate-800  rounded-lg px-4 py-3 outline-none border ${
                        errors.passwordMsgRing
                          ? "border-green-500"
                          : "border-red-500"
                      }`}
                    />

                    <div className=" flex flex-col">
                      <small
                        className={`${
                          errors.password.length
                            ? "text-green-500"
                            : "text-red-500"
                        } px-2`}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span> be atlease 8 characters long. </span>
                      </small>
                      <small
                        className={`${
                          errors.password.number
                            ? "text-green-500"
                            : "text-red-500"
                        } px-2`}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span> contain atleast 1 number (0...9) </span>
                      </small>
                      <small
                        className={`${
                          errors.password.lowercases
                            ? "text-green-500"
                            : "text-red-500"
                        } px-2`}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>
                          {" "}
                          contain atleast 1 lowercase letter (a...z){" "}
                        </span>
                      </small>
                      <small
                        className={`${
                          errors.password.uppercases
                            ? "text-green-500"
                            : "text-red-500"
                        } px-2`}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>
                          {" "}
                          Should contain atleast 1 uppercase letter (A...Z){" "}
                        </span>
                      </small>
                      <small
                        className={`${
                          errors.password.special
                            ? "text-green-500"
                            : "text-red-500"
                        } px-2`}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span> contain atleast 1 special symbol (!...$) </span>
                      </small>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="password" className=" font-semibold block">
                    Password
                  </label>
                  <div>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Enter password"
                      value={register.confirmPassword}
                      onChange={(e) => {
                        setRegister((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }));
                        validation();
                      }}
                      className={`placeholder:text-slate-800 w-full  text-slate-800  rounded-lg px-4 py-3 outline-none border ${
                        errors.confirmPassword
                          ? "border-green-500"
                          : "border-red-500"
                      }`}
                    />

                    <p
                      className={`${
                        errors.confirmPassword
                          ? "text-green-500"
                          : "text-red-500"
                      } text-xs mt-1`}
                    >
                      Password must be same
                    </p>
                  </div>
                </div>

                {/* <button
              type="submit"
            //   disabled={!isValid || isLoading}
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Register
            </button> */}

                <button
                  type="submit"
                  onClick={handleRegisterSubmit}
                  className="bg-primary text-slate-100 bg-blue-600 font-bold text-lg py-2 px-4 w-full rounded-lg my-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Register
                </button>
                {/* <p className="text-sm font-semibold text-[#5a7184]">
              You have an account?{" "}
              <Link to="/login" className="text-primary">
                Login now
              </Link>
            </p> */}

                <p className="text-md font-semibold flex  gap-2 justify-evenly ">
                  Do not have an account?{" "}
                  <Link to="/login" className="text-blue-600">
                    Login now
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </MainLayout>
      )}
    </div>
  );
};

export default RegisterPage;
