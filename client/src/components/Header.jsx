import React, { useState } from "react";
// import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ getRole }) => {
  const navigate = useNavigate();

  const location = useLocation();

  let logoutHandler = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <section className="sticky top-0 left-0 right-0 z-50 bg-white w-full">
      <header className="container mx-auto px-10 flex justify-between py-4 items-center">
        <Link to="/">
          <span className="text-slate-800 font-semibold text-2xl ">
            Talavin Blog
          </span>
        </Link>
        <div
          className={` transition-all duration-300  bg-dark-hard  z-[49] flex   justify-center  gap-4 items-center`}
        >
          <ul className="text-slate-800 items-center gap-x-5 lg:text-dark-soft flex  lg:flex-row font-semibold ">
            <Link to="/">
              <li className="cursor-pointer">Home</li>
            </Link>
            <Link to="/blogcreate">
              <li className="cursor-pointer">Post</li>
            </Link>
          </ul>
          {getRole === "admin" || getRole === "user" ? (
            <div className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
              <div className="relative group">
                <div className="flex flex-col items-center">
                  <button
                    className="flex gap-x-1 items-center mt-5 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
                    // onClick={() => setProfileDrowpdown(!profileDrowpdown)}
                  >
                    <span>Account</span>
                    {/* <MdKeyboardArrowDown /> */}
                  </button>
                  <div
                    className={`lg:hidden transition-all bg-white rounded-lg duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
                  >
                    <ul className="bg-dark-soft  text-center flex flex-col shadow-lg rounded-lg overflow-hidden">
                      {getRole === "admin" && (
                        <button
                          onClick={() => navigate("/admin")}
                          type="button"
                          className="hover:bg-dark-hard hover:text-blue-500 px-4 py-2 text-slate-800 lg:text-dark-soft"
                        >
                          Admin Dashboard
                        </button>
                      )}

                      {getRole === "user" || getRole === "admin" ? (
                        <>
                          <button
                            onClick={() => navigate("/profile")}
                            type="button"
                            className="hover:bg-dark-hard hover:text-blue-500 px-4 py-2 text-slate-800 lg:text-dark-soft"
                          >
                            Profile Page
                          </button>
                          <button
                            onClick={logoutHandler}
                            type="button"
                            className="hover:bg-dark-hard hover:text-blue-500 px-4 py-2 text-slate-800 lg:text-dark-soft"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (location.pathname === "/") {
                  navigate("/login");
                } else if (location.pathname === "/login") {
                  navigate("/register");
                } else {
                  navigate("/login");
                }
              }}
              className=" lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              {getRole === null && location.pathname === "/"
                ? "Log in"
                : location.pathname === "/login"
                ? "Register"
                : "Log in"}
            </button>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;
