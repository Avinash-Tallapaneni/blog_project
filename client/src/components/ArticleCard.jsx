import React from "react";

import { Link } from "react-router-dom";

const ArticleCard = ({ post, className }) => {
  return (
    <div
      className={`rounded-xl w-[100%] bg-slate-200 border border-gray-300 overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}
    >
      {/* image */}
      {/* <div className="w-full aspect-video bg-slate-300" /> */}
      <Link to={`/blog/${post._id}`}>
        <div className="p-5 ">
          <div className="flex gap-4  items-center ">
            <div className="flex flex-col justify-start items-start w-full gap-4 ">
              {/* title */}
              <div className="text-2xl font-semibold">{post.title}</div>
              {/* caption */}
              <div className=" overflow-hidden w-full text-left h-32 text-wrap py-2 ">
                <div
                  dangerouslySetInnerHTML={{ __html: post.blogDescription }}
                />
              </div>
            </div>

            {/* image */}
            <img
              src={post.blogImage || "https://via.placeholder.com/800x400"}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "https://via.placeholder.com/800x400";
              }}
              alt="title"
              className="w-[20%] object-cover object-center rounded-md h-[100%] aspect-video md:h-32 lg:h-48 xl:h-32"
            />
          </div>

          <div className="flex justify-between flex-nowrap items-center mt-6">
            <div className="flex items-center gap-x-2 md:gap-x-2.5">
              {/* profile image */}
              <div className=" rounded-full  md:h-12 md:w-12 lg:h-15 xl:h-15 overflow-hidden">
                <img
                  src={post.authorProfile.imageUrl}
                  alt="title"
                  className=" object-cover object-center w-full h-full "
                />
              </div>
              {/* user's name */}
              <div className=" rounded-lg px-2">{post.author}</div>
            </div>
            {/* date */}
            <span className=" text-dark-light  text-sm">
              {new Date(post.datePublished).toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: "UTC",
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
