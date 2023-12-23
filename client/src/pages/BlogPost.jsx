import React, { useEffect, useState } from "react";
import BlogDescription from "../components/blogDescription";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { TraceSpinner } from "react-spinners-kit";

const BlogPost = () => {
  const [blog, setBlog] = useState([{}]);

  const [isLoading, setIsLoading] = useState(false);

  const storedToken = localStorage.getItem("token");
  let decoded;

  if (storedToken) {
    decoded = jwtDecode(storedToken);
  }

  //   const post = {
  //     id: 1,
  //     title: "Sample Blog Post",
  //     author: "John Doe",
  //     description: `<p>This is a <strong>sample blog post</strong> with some dummy content.</p>

  // <p>This is a sample blog post with some dummy content. <em>This is emphasized text.</em></p>

  // <ul>
  //   <li>This is a sample blog post with some dummy content.</li>
  //   <li>This is another point in the list.</li>
  //   <li>And here's a third point.</li>
  // </ul>

  // <ol>
  //   <li>This is an ordered list item.</li>
  //   <li>Another item in the ordered list.</li>
  //   <li>And one more for good measure.</li>
  // </ol>

  // <p>This is a sample blog post with some <strong>bold text</strong>. This is a sample blog post with some dummy content.</p>

  // <p>This is a sample blog post with some dummy content. This is a <a href="#">sample link</a>.</p>

  // <p>This is a sample blog post with some dummy content. <br /> This is a new line using the line break tag.</p>
  // `,
  //     imageUrl: "https://via.placeholder.com/800x400", // Placeholder image URL
  //     datePublished: "2023-01-01T12:00:00Z", // ISO 8601 format
  //   };

  let { id } = useParams();
  const navigate = useNavigate();

  const fetchblog = async () => {
    console.log(id);

    try {
      const response = await fetch(`http://127.0.0.1:7000/blog/${id}`);
      const data = await response.json();

      setBlog(() => data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = () => {
    setIsLoading(() => true);

    const deleteData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:7000/blog/${id}`, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
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
    deleteData();
  };

  useEffect(() => {
    fetchblog();
  }, []);

  return (
    <div className="flex flex-col  items-center justify-start h-screen w-full  bg-slate-100">
      {isLoading ? (
        <div className="h-screen flex items-center">
          <TraceSpinner size={50} frontColor="#0ea5e9" loading={true} />
        </div>
      ) : (
        <div className="blog max-w-2xl mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
          <div>
            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">{blog[0].title}</h2>

            {/* Author and Date */}
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <span className="font-semibold">{blog[0].author}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(blog[0].datePublished).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Image */}
            <img
              src={blog[0].blogImage}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "https://via.placeholder.com/800x400";
              }}
              alt={blog[0].title}
              className="w-full h-64 object-cover mb-4 rounded-md"
            />

            {/* Description */}
            <div className="text-lg mb-4">
              <BlogDescription htmlString={blog[0].blogDescription} />
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              {/* Use the 'prose' class for basic styling of the content */}
              {blog[0].content}
            </div>
          </div>
          <div className="flex justify-between">
            <Link to="/" className="text-blue-500 hover:underline">
              &#8592; Back to Home
            </Link>
            {decoded &&
            (decoded.name === blog[0].author ||
              decoded.role === "admin" ||
              decoded.role === undefined) ? (
              <div className="flex gap-2">
                <Link to={`/blog/edit/${id}`}>
                  <button
                    type="submit"
                    className="w-fit text-slate-100 bg-blue-500 font-bold text-lg py-1 px-4 rounded-lg  disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Edit post
                  </button>
                </Link>
                <button
                  type="submit"
                  onClick={handleDelete}
                  className="w-fit text-slate-100 bg-red-500 font-bold text-lg py-1 px-4 rounded-lg  disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Delete post
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
