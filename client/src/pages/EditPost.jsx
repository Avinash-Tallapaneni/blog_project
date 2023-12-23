import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ReactQuill from "react-quill";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TraceSpinner } from "react-spinners-kit";

const EditPost = () => {
  const [isLoading, setIsLoading] = useState(false);

  const post = `<p>This is a <strong>sample blog post</strong> with some dummy content.</p>

  <p>This is a sample blog post with some dummy content. <em>This is emphasized text.</em></p>

  <ul>
    <li>This is a sample blog post with some dummy content.</li>
    <li>This is another point in the list.</li>
    <li>And here's a third point.</li>
  </ul>

  <ol>
    <li>This is an ordered list item.</li>
    <li>Another item in the ordered list.</li>
    <li>And one more for good measure.</li>
  </ol>

  <p>This is a sample blog post with some <strong>bold text</strong>. This is a sample blog post with some dummy content.</p>

  <p>This is a sample blog post with some dummy content. This is a <a href="#">sample link</a>.</p>

  <p>This is a sample blog post with some dummy content. <br /> This is a new line using the line break tag.</p>
  `;

  const [blogContent, setBlogContent] = useState([{}]);
  const [value, setValue] = useState(post);
  let { id } = useParams();
  const navigate = useNavigate();

  const fetchEditBlog = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:7000/blog/${id}`); 
      const data = await response.json();

      setBlogContent(() => data[0]);
      setValue(()=>data[0].blogDescription)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchEditBlog();
    console.log("ran")
  }, []);

  const handleUpdatePublish = (e) => {
    e.preventDefault();
    setIsLoading(() => true);
    
    if (blogContent.title.length > 0 && value.length > 0) {
      const updateBlog = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:7000/blog/edit/${id}`, {
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
      updateBlog();
    }

  };


  return (
    <div className="flex flex-col  items-center justify-start h-screen w-full  bg-slate-100">
      <Header getRole={localStorage.getItem("role")} />
      {isLoading ? (
        <div className="h-screen flex items-center">
          <TraceSpinner size={50} frontColor="#0ea5e9" loading={true} />
        </div>
      ) : (
        <div className="my-5 w-full  p-2 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]  rounded-md max-w-screen-md mx-auto">
          <h1 className="text-3xl font-bold mb-5">Edit Blog</h1>
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
                value={blogContent.title}
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
                value={blogContent.blogImage}

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
              onClick={handleUpdatePublish}
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

export default EditPost;
