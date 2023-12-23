import { Link } from "react-router-dom";

const ArticleCardTemplate = ({ post, className }) => {
  return (
    <>
      {!post ? (
        <div
          className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className} animate-pulse`}
        >
          {/* image */}
          <div className="w-full aspect-video bg-slate-300" />
          <div className="p-5">
            {/* title */}
            <div className="w-56 h-2 mt-4 bg-slate-300 rounded-lg" />
            {/* caption */}
            <div className="w-24 h-2 mt-4 bg-slate-300 rounded-lg" />
            <div className="flex justify-between flex-nowrap items-center mt-6">
              <div className="flex items-center gap-x-2 md:gap-x-2.5">
                {/* profile image */}
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-300" />
                <div className="flex flex-col">
                  {/* user's name */}
                  <div className="w-24 h-2 bg-slate-300 rounded-lg" />
                  {/* verified status */}
                  <div className="w-16 h-2 mt-2 bg-slate-300 rounded-lg" />
                </div>
              </div>
              {/* date */}
              <div className="w-10 h-2 mt-4 bg-slate-300 rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}
        >
          {/* image */}
          <img
            src={post.blogImage || "https://via.placeholder.com/800x400"}
            alt={post.title}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "https://via.placeholder.com/800x400";
            }}
            className="w-full aspect-video"
          />
          <div className="p-5 flex flex-col gap-1">
            {/* title */}
            <h1 className="text-2xl font-bold max-h-[5rem] text-ellipsis overflow-hidden ">
              {post.title}
            </h1>

            {/* <div className="w-24 h-2 mt-4 bg-slate-300 rounded-lg" /> */}
            <div className="flex justify-between flex-nowrap items-center ">
              <div className="flex items-center text-sm gap-x-2 md:gap-x-2.5">
                {/* profile image */}
                <img
                  src={post.authorProfile.imageUrl}
                  alt={`Profile of ${post.authorProfile.name}`}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full"
                />
                <div className="flex flex-col">
                  {/* user's name */}
                  <p className="w-24 text-wrap  rounded-lg">{post.author} </p>
                </div>
              </div>
              {/* date */}
              <p className="   rounded-lg">
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
              </p>
            </div>

            {/* blog description */}
            <div
              dangerouslySetInnerHTML={{ __html: post.blogDescription }}
              className="h-[5rem]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleCardTemplate;
