import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Layout & Components
import Layout from "./components/Layout/Layout";
import AIChatBox from "./components/Ui/AIChatBox/AIChatBox";

// Lazy loading pages
const Home = lazy(() => import("./pages/Home/Home"));
const Auth = lazy(() => import("./pages/Auth/Auth"));
const Explore = lazy(() => import("./pages/Explore/Explore"));
const Review = lazy(() => import("./pages/Review/Review"));
const SampleItinerary = lazy(() => import("./pages/SampleItinerary/SampleItinerary"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail/DestinationDetail"));
const News = lazy(() => import("./pages/News/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail/NewsDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Planner = lazy(() => import("./pages/Planner/Planner"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Admin = lazy(() => import("./pages/Admin/AdminDashboard"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword/ForgotPassword"));
const ItineraryDetail = lazy(() => import("./pages/ItineraryDetail/ItineraryDetail"));

// Component để quản lý NProgress khi chuyển trang
const SuspenseLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return <>{children}</>;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<SuspenseLayout>{null}</SuspenseLayout>}>
          <Routes>
            {/* Group 1: Các trang có Navbar/Footer thông qua Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/review" element={<Review />} />
              <Route path="/attraction/:id" element={<DestinationDetail />} />
              <Route path="/hotel/:id" element={<DestinationDetail />} />
              <Route path="/restaurant/:id" element={<DestinationDetail />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/sample" element={<SampleItinerary />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>

            {/* Group 2: Trang Auth thường không dùng chung Layout với Navbar */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/itinerary-detail/:id?" element={<ItineraryDetail />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        style={{ zIndex: 99999 }}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <AIChatBox />
    </>
  );
}

export default App;

