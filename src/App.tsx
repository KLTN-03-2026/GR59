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
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Group 1: Các trang có Navbar/Footer thông qua Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/review" element={<Review />} />
            <Route path="/destination" element={<DestinationDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/sample" element={<SampleItinerary />} />
            <Route path="/news" element={<News />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>

          {/* Group 2: Trang Auth thường không dùng chung Layout với Navbar */}
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
