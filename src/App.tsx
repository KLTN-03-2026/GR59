import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Bounce, ToastContainer } from "react-toastify";
import Layout from "./components/Layout/Layout";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Review from "./pages/Review/Review";
import SampleItinerary from "./pages/SampleItinerary/SampleItinerary";
import DestinationDetail from "./pages/DestinationDetail/DestinationDetail";
import News from "./pages/News/News";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Planner from "./pages/Planner/Planner";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/AdminDashboard";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import ItineraryDetail from "./pages/ItineraryDetail/ItineraryDetail";
import AIChatBox from "./components/Ui/AIChatBox/AIChatBox";

function App() {
  return (
    <>
      <BrowserRouter>
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
