import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import Footer from "../component/Footer";

// import { GalleryProvider } from "../context/GalleryContext";
// import { NewsProvider } from "../context/NewsContext";
import { JourneyProvider } from "../context/JourneyContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Pages
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin/Admin";
import Journey from "../pages/Journey/Journey";
import JourneyAdd from "../pages/Journey/JourneyAdd";
import Outreach from "../pages/Outreach/Outreach";
import Gallery from "../pages/Gallery/Gallery";
import GalleryVideos from "../pages/Gallery/GalleryVideos";
import GalleryAddimages from "../pages/Gallery/GalleryAddimages";
import GalleryAddvideos from "../pages/Gallery/GalleryAddvideos";
import Speaker from "../pages/Speaker";
import Contacts from "../pages/Contacts";
import Newsletter from "../pages/Newsletter";
import Sponsors from "../pages/Outreach/Sponsors";
import NewsVideosPage from "../pages/News/NewsVideos";
import NewsPage from "../pages/News/News";
import AddNews from "../pages/News/AddNews";
import NewsVideos from "../pages/News/AddNewsVideos";

import Signin from "../pages/auth/Signin";
import SignUp from "../pages/auth/SignUp";

/* ---------------- PROTECTED ROUTE ---------------- */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user?.token ? children : <Navigate to="/signin" replace />;
}

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();

  const initialIsDesktop = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 992px)").matches,
    []
  );

  const [isDesktop, setIsDesktop] = useState(initialIsDesktop);
  const [sidebarOpen, setSidebarOpen] = useState(initialIsDesktop);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mm = window.matchMedia("(min-width: 992px)");

    const handler = (e) => {
      setIsDesktop(e.matches);
      setSidebarOpen(e.matches);
    };

    mm.addEventListener("change", handler);
    return () => mm.removeEventListener("change", handler);
  }, []);

  // auto-close sidebar on modal open
  useEffect(() => {
    const closeSidebarOnModal = () => setSidebarOpen(false);
    window.addEventListener("modal-open", closeSidebarOnModal);
    return () =>
      window.removeEventListener("modal-open", closeSidebarOnModal);
  }, []);

  const mainContentStyle = {
    marginLeft: isDesktop && sidebarOpen ? "230px" : "0",
    transition: "margin-left 0.3s ease",
    width: isDesktop && sidebarOpen ? "calc(100% - 230px)" : "100%",
  };

  // Hide layout for auth pages
  const hideLayout = ["/signin", "/signup"].includes(location.pathname);

  return (
    // <GalleryProvider>
      // <NewsProvider>
        <JourneyProvider>
          {hideLayout ? (
            /* ---------- AUTH PAGES ONLY ---------- */
            <main className="p-0 m-0 w-100">
              <Routes>
                <Route
                  path="/"
                  element={
                    user?.token ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/signin" replace />
                    )
                  }
                />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </main>
          ) : (
            /* ---------- MAIN LAYOUT ---------- */
            <div className="d-flex flex-column h-100">
              <Header toggleSidebar={() => setSidebarOpen((s) => !s)} />

              <div className="d-flex">
                <Sidebar
                  isOpen={sidebarOpen}
                  onBackdropClick={() => setSidebarOpen(false)}
                />

                <main
                  className="flex-grow-1 p-3 content-area mt-4"
                  style={mainContentStyle}
                >
                  <Routes>
                    {/* ROOT HANDLING */}
                    <Route
                      path="/"
                      element={
                        <Navigate to="/dashboard" replace />
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
                    <Route path="/journey-add" element={<ProtectedRoute><JourneyAdd /></ProtectedRoute>} />
                    <Route path="/outreach" element={<ProtectedRoute><Outreach /></ProtectedRoute>} />
                    <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                    <Route path="/galleryvideos" element={<ProtectedRoute><GalleryVideos /></ProtectedRoute>} />
                    <Route path="/gallery-add" element={<ProtectedRoute><GalleryAddimages /></ProtectedRoute>} />
                    <Route path="/gallery-videos" element={<ProtectedRoute><GalleryAddvideos /></ProtectedRoute>} />
                    <Route path="/speaker" element={<ProtectedRoute><Speaker /></ProtectedRoute>} />
                    <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                    <Route path="/newsletter" element={<ProtectedRoute><Newsletter /></ProtectedRoute>} />
                    <Route path="/sponsors" element={<ProtectedRoute><Sponsors /></ProtectedRoute>} />
                    <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
                    <Route path="/newsvideospage" element={<ProtectedRoute><NewsVideosPage /></ProtectedRoute>} />
                    <Route path="/news-videos" element={<ProtectedRoute><NewsVideos /></ProtectedRoute>} />
                    <Route path="/news-add" element={<ProtectedRoute><AddNews /></ProtectedRoute>} />

                    <Route
                      path="*"
                      element={
                        <div className="text-center mt-5">
                          <h2>404 - Page Not Found</h2>
                        </div>
                      }
                    />
                  </Routes>
                </main>
              </div>

              <Footer />
            </div>
          )}
        </JourneyProvider>
      // </NewsProvider>
    // </GalleryProvider>
  );
}
