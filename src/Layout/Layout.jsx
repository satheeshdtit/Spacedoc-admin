// src/layout/Layout.jsx
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import { GalleryProvider } from "../context/GalleryContext";

// Import pages
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin/Admin";
import Journey from "../pages/Journey/Journey";
import JourneyAdd from "../pages/Journey/JourneyAdd";
import Outreach from "../pages/Outreach/Outreach";
import Gallery from "../pages/Gallery/Gallery";
import Speaker from "../pages/Speaker";
import Contacts from "../pages/Contacts";
import Newsletter from "../pages/Newsletter";
import GalleryAddimages from "../pages/Gallery/GalleryAddimages";
import GalleryAddvideos from "../pages/Gallery/GalleryAddvideos";
import News from "../pages/News/News";
import NewsVideos from "../pages/News/AddNewsVideos";
import AddNews from "../pages/News/AddNews";
import GalleryVideos from "../pages/Gallery/GalleryVideos";
import NewsVideosPage from "../pages/News/NewsVideos";
import NewsPage from "../pages/News/News";
import { NewsProvider } from "../context/NewsContext";
import { JourneyProvider } from "../context/JourneyContext";
import Sponsors from "../pages/Outreach/Sponsors";
import Footer from "../component/Footer";
import SignIn from "../pages/auth/Signin.jsx";
import SignUp from "../pages/auth/Signup.jsx";






export default function Layout() {
  const location = useLocation();

  // Determine initial desktop/mobile state once
  const initialIsDesktop = useMemo(() => (
    typeof window !== 'undefined' && window.matchMedia('(min-width: 992px)').matches
  ), []);

  const [isDesktop, setIsDesktop] = useState(initialIsDesktop);
  const [sidebarOpen, setSidebarOpen] = useState(initialIsDesktop);

  // Keep isDesktop and sidebarOpen in sync with viewport changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia('(min-width: 992px)');
    const handler = (e) => {
      setIsDesktop(e.matches);
      setSidebarOpen(e.matches); // open on desktop, close on mobile
    };
    if (mm.addEventListener) mm.addEventListener('change', handler);
    else mm.onchange = handler; // fallback
    return () => {
      if (mm.removeEventListener) mm.removeEventListener('change', handler);
      else mm.onchange = null;
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isDesktop) setSidebarOpen(false);
  }, [location.pathname, isDesktop]);

  const mainContentStyle = {
    marginLeft: isDesktop && sidebarOpen ? '230px' : '0',
    transition: 'margin-left 0.3s ease',
    width: isDesktop && sidebarOpen ? 'calc(100% - 230px)' : '100%'
  };
  const hideLayout = ["/signin", "/signup"].includes(location.pathname);


return (
  <GalleryProvider>
    <NewsProvider>
      <JourneyProvider>
        {hideLayout ? (
          // AUTH PAGES WITHOUT LAYOUT
          <main className="p-0 m-0 w-100">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </main>
        ) : (
          // NORMAL DASHBOARD LAYOUT
          <div className="d-flex flex-column h-100">
            <Header toggleSidebar={() => setSidebarOpen((s) => !s)} />

            <div className="d-flex">
              <Sidebar
                isOpen={sidebarOpen}
                onBackdropClick={() => setSidebarOpen(false)}
              />

              <main
                className="flex-grow-1 p-3 content-area  mt-4"
                style={mainContentStyle}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/journey" element={<Journey />} />
                  <Route path="/journey-add" element={<JourneyAdd />} />
                  <Route path="/outreach" element={<Outreach />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/galleryvideos" element={<GalleryVideos />} />
                  <Route path="/speaker" element={<Speaker />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/gallery-add" element={<GalleryAddimages />} />
                  <Route path="/gallery-videos" element={<GalleryAddvideos />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/newsvideospage" element={<NewsVideosPage />} />
                  <Route path="/news-videos" element={<NewsVideos />} />
                  <Route path="/news-add" element={<AddNews />} />
                  <Route path="/sponsors" element={<Sponsors />} />

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
    </NewsProvider>
  </GalleryProvider>
);

}