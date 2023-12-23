import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import { TraceSpinner } from "react-spinners-kit";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    imageUrl: "",
    email: "",
    password: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();
  const userRole = localStorage.getItem("role");

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:7000/profile", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: profile.email,
            imageUrl: profile.imageUrl,
            password: profile.password,
          }),
        });

        if (response.status >= 400 && response.status < 500) {
          setTimeout(() => {
            setIsLoading(() => false);
            navigate("/");
            response.json().then((data) => {
              toast.success(data.msg);
            });
          }, 3000);
        }

        if (response.status >= 200 && response.status < 300) {
          setTimeout(() => {
            setIsLoading(() => false);
            navigate("/");
            response.json().then((data) => {
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
      }
    };

    fetchData();

    if (userRole === "admin") {
      updateData();
    }
    if (userRole === "user") {
      updateData();
    }
  };

  // const adminProfile = () => {
  //   console.log("here");

  //   const fetchProileData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://127.0.0.1:7000/admin/profile/${id}`

  //       );

  //       console.log(response)

  //       // if (response.status >= 400 && response.status < 500) {
  //       //   setTimeout(() => {
  //       //     setIsLoading(() => false);
  //       //     navigate("/");
  //       //     response.json().then((data) => {
  //       //       toast.success(data.msg);
  //       //     });
  //       //   }, 3000);
  //       // }

  //       // if (response.status >= 200 && response.status < 300) {
  //       //   setTimeout(() => {
  //       //     setIsLoading(() => false);
  //       //     navigate("/");
  //       //     response.json().then((data) => {
  //       //       toast.success(data.msg);
  //       //     });
  //       //   }, 3000);
  //       // }
  //     } catch (error) {
  //       // setTimeout(() => {
  //       //   setIsLoading(() => false);
  //       //   navigate("/");
  //       //   response.json().then((data) => {
  //       //     toast.success(data.msg);
  //       //   });
  //       // }, 3000);
  //     }
  //   };

  //   const updateData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://127.0.0.1:7000/admin/profile/${id}`,
  //         {
  //           method: "POST",
  //           mode: "cors",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             email: profile.email,
  //             imageUrl: profile.imageUrl,
  //             password: profile.password,
  //           }),
  //         }
  //       );

  //       if (response.status >= 400 && response.status < 500) {
  //         setTimeout(() => {
  //           setIsLoading(() => false);
  //           navigate("/");
  //           response.json().then((data) => {
  //             toast.success(data.msg);
  //           });
  //         }, 3000);
  //       }

  //       if (response.status >= 200 && response.status < 300) {
  //         setTimeout(() => {
  //           setIsLoading(() => false);
  //           navigate("/");
  //           response.json().then((data) => {
  //             toast.success(data.msg);
  //           });
  //         }, 3000);
  //       }
  //     } catch (error) {
  //       setTimeout(() => {
  //         setIsLoading(() => false);
  //         navigate("/");
  //         response.json().then((data) => {
  //           toast.success(data.msg);
  //         });
  //       }, 3000);
  //     }
  //   };

  //   fetchProileData()
  //   // updateData();
  // };

  const fetchProileData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:7000/admin/profile/${id}`);
      const data = await response.json();

      setProfile((prev) => ({
        ...prev,
        imageUrl: data.user.imageUrl,
        email: data.user.email,
        password: data.user.password,
        role: data.user.role,
      }));

      console.log(data.user);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const updateData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:7000/admin/profile/${id}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: profile.email,
            imageUrl: profile.imageUrl,
            password: profile.password,
            role: profile.role,
          }),
        }
      );



    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setProfile((prev) => ({
      ...prev,
      imageUrl: decoded.imageUrl,
      email: decoded.email,
      password: password,
    }));
  }, []);

  useEffect(() => {
    if (userRole === "admin") {
      fetchProileData();
    }
  }, [id]);

  return (
    <div className="flex flex-col  items-center justify-start h-screen w-full  bg-slate-100">
      {localStorage.getItem("role") === "admin" ? (
        ""
      ) : (
        <Header getRole={localStorage.getItem("role")} />
      )}
      {isLoading ? (
        <div className="h-screen flex items-center">
          <TraceSpinner size={50} frontColor="#0ea5e9" loading={true} />
        </div>
      ) : (
        <MainLayout>
          <section className="container flex flex-col gap-4 justify-center items-center py-10">
            <div className="w-full max-w-sm mx-auto bg-slate-200 p-5 rounded-xl border border-gray-700">
              <h1 className="text-4xl text-center mb-4">Profile Page</h1>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={profile.imageUrl}
                      alt=""
                      className="w-[7rem] h-[7rem] rounded-full"
                    />
                  </div>
                  <label htmlFor="imageUrl" className="font-semibold block">
                    Profile pic URL
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    placeholder="Enter image URL"
                    value={profile.imageUrl}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    className="placeholder:text-slate-800 w-full text-slate-800 rounded-lg px-4 py-3 outline-none border"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="email"
                    className="font-semibold  flex items-center gap-1"
                  >
                    Email
                    <small>(cannot Update)</small>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    disabled={userRole !== "admin"}
                    value={profile.email}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                    className={`placeholder:text-slate-800 w-full text-slate-800 rounded-lg px-4 py-3 outline-none border border-blue-500`}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="password" className="font-semibold block">
                    Update Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={profile.password}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                    className={`placeholder:text-slate-800 w-full text-slate-800 rounded-lg px-4 py-3 outline-none border `}
                  />
                  {/* Add password validation indicators here */}
                </div>

                {userRole === "admin" && (
                  <div className="flex justify-start items-center gap-3 ">
                    <label className="flex items-center gap-2 ">
                      <input
                        type="radio"
                        name="radioOption"
                        value="user"
                        onChange={() =>
                          setProfile({ ...profile, role: "user" })
                        }
                        checked={profile.role === "user"}
                        // checked={selectedRadioOption === "cancel"}
                        className="mr-2"
                      />
                      <span className="text-slate-800 font-bold text-lg">
                        user
                      </span>
                    </label>

                    <label className="flex items-center gap-2 ">
                      <input
                        type="radio"
                        name="radioOption"
                        value="editor"
                        onChange={() =>
                          setProfile({ ...profile, role: "editor" })
                        }
                        checked={profile.role === "editor"}
                        className="mr-2"
                      />
                      <span className="text-slate-800 font-bold text-lg">
                        editor
                      </span>
                    </label>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-fit text-slate-100 bg-slate-500 font-bold text-lg py-1 px-4 rounded-lg  disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    onClick={handleUpdateSubmit}
                    className="w-fit text-slate-100 bg-blue-600 font-bold text-lg py-1 px-4 rounded-lg  disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
            <Link to="/" className="text-blue-500 hover:underline">
              &#8592; Back to Home
            </Link>
          </section>
        </MainLayout>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ProfilePage;
