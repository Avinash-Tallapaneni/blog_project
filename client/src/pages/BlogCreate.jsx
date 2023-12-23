import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Link, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { TraceSpinner } from "react-spinners-kit";
import Header from "../components/Header";

const BlogCreate = () => {
  const [blogContent, setBlogContent] = useState({
    title: "",
    blogImage: "",
    blogDescription: "",
    author: "",
    datePublished: "",
  });
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePublish = (e) => {
    e.preventDefault();
    setIsLoading(() => true);
    if (blogContent.title.length > 0 && value.length > 0) {
      const postBlog = async () => {
        try {
          const response = await fetch("http://127.0.0.1:7000/blogcreate", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: blogContent.title,
              blogImage:
                blogContent.blogImage || "https://via.placeholder.com/800x400",
              blogDescription: value,
              author: blogContent.author,
              datePublished: new Date(),
            }),
          });

          setBlogContent(() => ({
            title: "",
            blogImage: "",
            blogDescription: "",
            author: "",
            datePublished: "",
          }));

          if (response.status >= 200 && response.status < 300) {
            setTimeout(() => {
              setIsLoading(() => true);
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

          console.error("Error during fetch:", error.message);
        }
      };
      postBlog();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setBlogContent((prev) => ({
      ...prev,
      author: decoded.name,
    }));
  }, []);

  return (
    // <div className="my-5 max-w-screen-md mx-auto">
    //   <h1 className="text-3xl font-bold mb-5">Create new Blog</h1>
    //   <form className="my-5">
    //     <div className="mb-4">
    //       <label
    //         htmlFor="title"
    //         className="block text-sm font-medium text-gray-600"
    //       >
    //         Title
    //       </label>
    //       <input
    //         type="text"
    //         id="title"
    //         placeholder="Enter title"
    //         className="mt-1 p-2 border border-gray-300 rounded w-full"
    //       />
    //     </div>
    //     <div className="mb-4">
    //       <label
    //         htmlFor="image"
    //         className="block text-sm font-medium text-gray-600"
    //       >
    //         Blog header Image
    //       </label>
    //       <input
    //         type="text"
    //         id="image"
    //         placeholder="Enter image URL"
    //         className="mt-1 p-2 border border-gray-300 rounded w-full"
    //       />
    //     </div>

    //     <div className="mb-4">
    //       <label
    //         htmlFor="content"
    //         className="block text-sm font-medium text-gray-600"
    //       >
    //         Content
    //       </label>
    //       <ReactQuill theme="snow" value={value} onChange={setValue} />
    //     </div>
    //     <button
    //       type="submit"
    //       className="bg-blue-500 text-white px-4 py-2 rounded"
    //     >
    //       Publish
    //     </button>
    //   </form>
    //   <Link to="/" className="text-blue-500 hover:underline">
    //     &#8592; Back to Home
    //   </Link>
    // </div>
    <div className="flex flex-col  items-center justify-start h-screen w-full  bg-slate-100">
      <Header getRole={localStorage.getItem("role")} />
      {isLoading ? (
        <div className="h-screen flex items-center">
          <TraceSpinner size={50} frontColor="#0ea5e9" loading={true} />
        </div>
      ) : (
        <div className="my-5 w-full  p-2 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]  rounded-md max-w-screen-md mx-auto">
          <h1 className="text-3xl font-bold mb-5">Create New Blog</h1>
          <form className="my-5">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-600"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter title"
                onChange={(e) =>
                  setBlogContent((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1 p-2 border border-slate-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="flex gap-2 text-sm font-medium text-slate-600"
              >
                Blog Header Image
                <small>
                  (if wrong or no link is provided, default placeholder image is
                  set)
                </small>
              </label>
              <input
                type="text"
                id="image"
                placeholder="Enter image URL"
                onChange={(e) =>
                  setBlogContent((prev) => ({
                    ...prev,
                    blogImage: e.target.value,
                  }))
                }
                className="mt-1 p-2 border border-slate-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-slate-600"
              >
                Content
              </label>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>
            <button
              type="submit"
              onClick={handlePublish}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Publish
            </button>
          </form>
          <Link to="/" className="text-blue-500 hover:underline">
            &#8592; Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogCreate;
