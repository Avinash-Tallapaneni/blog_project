import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// import "./App.css";
// import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
// import HomePage from "./pages/home/HomePage";
// import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import BlogCreate from "./pages/BlogCreate";
import ProfilePage from "./pages/ProfilePage";
import AdminLayout from "./pages/AdminLayout";
import BlogPost from "./pages/BlogPost";
import EditPost from "./pages/EditPost";
// import AdminLayout from "./pages/admin/AdminLayout";
// import Admin from "./pages/admin/screens/Admin";
// import Comments from "./pages/admin/screens/comments/Comments";
// import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
// import EditPost from "./pages/admin/screens/posts/EditPost";

function App() {
  return (
    <div className="App font-opensans">
      <Router>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog/edit/:id" element={<EditPost />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blogcreate" element={<BlogCreate />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="profile/:id" element={<ProfilePage />} />

            {/*  <Route index element={<Admin />} />
          <Route path="comments" element={<Comments />} />
          <Route path="posts/manage" element={<ManagePosts />} />
          <Route path="posts/manage/edit/:id" element={<EditPost />} /> */}
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
