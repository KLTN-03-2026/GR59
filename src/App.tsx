import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Layout & Components
import Layout from "./components/Layout/Layout";
import AIChatBox from "./components/Ui/AIChatBox/AIChatBox";
import PrivateRoute from "./routes/PrivateRoute";
import PreferenceModal from "./components/Modals/PreferenceModal/PreferenceModal";
import type { UserData } from "./services/userService";

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
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa và đã làm khảo sát chưa
    const userData = localStorage.getItem("user");
    const surveyCompleted = localStorage.getItem("surveyCompleted");

    if (userData && !surveyCompleted) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        
        // Nếu không có preferences trong data trả về từ BE (giả lập)
        if (!parsedUser.preferences) {
          // Trễ một chút để không gây choáng ngợp khi vừa load trang
          const timer = setTimeout(() => {
            setShowPreferenceModal(true);
          }, 2000);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error("Lỗi parse user data:", e);
      }
    }
  }, []);

  const handlePreferenceComplete = () => {
    setShowPreferenceModal(false);
    localStorage.setItem("surveyCompleted", "true");
  };
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<SuspenseLayout>{null}</SuspenseLayout>}>
          <Routes>
            {/* Group 1: Các trang có Navbar/Footer thông qua Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/review"
                element={
                  <PrivateRoute>
                    <Review />
                  </PrivateRoute>
                }
              />
              <Route path="/attraction/:id" element={<DestinationDetail />} />
              <Route path="/hotel/:id" element={<DestinationDetail />} />
              <Route path="/restaurant/:id" element={<DestinationDetail />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/sample" element={<SampleItinerary />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route
                path="/planner"
                element={
                  <PrivateRoute>
                    <Planner />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>

            {/* Group 2: Trang Auth thường không dùng chung Layout với Navbar */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route
              path="/itinerary-detail/:id?"
              element={
                <PrivateRoute>
                  <ItineraryDetail />
                </PrivateRoute>
              }
            />
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
      {showPreferenceModal && currentUser && (
        <PreferenceModal 
          userId={currentUser.id} 
          onClose={() => setShowPreferenceModal(false)}
          onComplete={handlePreferenceComplete}
        />
      )}
    </>
  );
}

export default App;

