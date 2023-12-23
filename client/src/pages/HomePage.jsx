import React, { useEffect, useState } from "react";
import ArticleCardTemplate from "../components/ArticleCardTemplate";
import Header from "../components/Header";
import ArticleCard from "../components/ArticleCard";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [getRole, setGetRole] = useState("");
  const [blog, setBlog] = useState([]);

  // const post = {
  //   id: 1,
  //   title: "Sample Blog Post",
  //   author: "John Doe",
  //   description:
  //     "This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content. This is a sample blog post with some dummy content. This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content. This is a sample blog post with some dummy content. This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.This is a sample blog post with some dummy content. This is a sample blog post with some dummy content. This is a sample blog post with some dummy content.This is a sample blog post with some dummy content.",
  //   imageUrl: "https://via.placeholder.com/800x400", // Placeholder image URL
  //   datePublished: "2023-01-01T12:00:00Z", // ISO 8601 format
  // };

  const fetchblog = async () => {
    try {
      const response = await fetch("http://127.0.0.1:7000/blog"); 
      const data = await response.json();

      setBlog(() => data);

      console.log(blog,"here");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    setGetRole(() => localStorage.getItem("role"));
  }, [getRole]);

  useEffect(() => {
    fetchblog();
  }, []);
  return (
    <div className=" h-screen w-full  bg-slate-100  ">
      <Header getRole={getRole} />
      <div className="flex flex-wrap md:gap-x-5 gap-y-5  p-10">
        <AliceCarousel
          mouseTracking
          infinite
          autoPlayInterval={1000}
          items={blog.map((post, index) => (
            <ArticleCard
              post={post}
              className="w-full md:w-[calc(33.33%-20px)] lg:w-[100%]"
            />
          ))}
        />

        {isLoading ? (
          <div className="flex flex-col w-full gap-4 mt-10">
            <div className="text-2xl font-semibold">Blog Post</div>
            <div className="flex gap-4 justify-center">
              {[...Array(4)].map((item, index) => (
                <ArticleCardTemplate
                  key={index}
                  className="w-full md:w-[calc(33.33%-20px)] lg:w-[calc(25%-21px)]"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {blog.map((item, index) => (
              // <ArticleCard
              //   post={item}
              //   className="w-full md:w-[calc(33.33%-20px)] lg:w-[100%]"
              // />
              <Link
                to={`/blog/${item._id}`}
                key={index}
                className="w-full md:w-[calc(33.33%-20px)] lg:w-[calc(25%-21px)]"
              >
                <ArticleCardTemplate post={item} />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
