import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiMail,
  FiDollarSign,
  FiChevronDown,
} from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, onBackdropClick }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    const p = location.pathname;

    if (p === "/journey" || p === "/journey-add") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenMenu("journey");
    } else if (p === "/outreach" || p === "/sponsors") {
      setOpenMenu("outreach");
    } else if (
      p === "/gallery" ||
      p === "/galleryvideos" ||
      p === "/gallery-add" ||
      p === "/gallery-videos"
    ) {
      setOpenMenu("gallery");
    } else if (
      p === "/news" ||
      p === "/newsvideospage" ||
      p === "/news-add" ||
      p === "/news-videos"
    ) {
      setOpenMenu("news");
    } else if (p === "/newsletter") {
      setOpenMenu("newsletter");
    } else {
      setOpenMenu(null);
    }
  }, [location.pathname]);

  const activeMain = ({ isActive }) => `nav-item${isActive ? " active" : ""}`;
  const activeSub = ({ isActive }) => `${isActive ? "active" : ""}`;

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        <nav className="sidebar-nav" style={{ overflowY: "auto", maxHeight: "100vh" }}>

          <NavLink className={activeMain} to="/dashboard">
            <FiHome /> <span>Dashboard</span>
          </NavLink>

          <NavLink className={activeMain} to="/admin">
            <FiUser /> <span>Admin</span>
          </NavLink>

          <div className="dropdown-group">
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("journey")}
            >
              <IoBookOutline /> <span>Journey</span>
              <FiChevronDown
                className={`arrow ${openMenu === "journey" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-content ${openMenu === "journey" ? "show" : ""}`}>
              <NavLink className={activeSub} to="/journey">Journey</NavLink>
              <NavLink className={activeSub} to="/journey-add">Add Journey</NavLink>
            </div>
          </div>

          <div className="dropdown-group">
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("outreach")}
            >
              <IoBookOutline /> <span>Outreach</span>
              <FiChevronDown
                className={`arrow ${openMenu === "outreach" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-content ${openMenu === "outreach" ? "show" : ""}`}>
              <NavLink className={activeSub} to="/outreach">Collaborate</NavLink>
              <NavLink className={activeSub} to="/sponsors">Sponsors</NavLink>
            </div>
          </div>

          <div className="dropdown-group">
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("gallery")}
            >
              <IoBookOutline /> <span>Gallery</span>
              <FiChevronDown
                className={`arrow ${openMenu === "gallery" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-content ${openMenu === "gallery" ? "show" : ""}`}>
              <NavLink className={activeSub} to="/gallery">Gallery Images</NavLink>
              <NavLink className={activeSub} to="/galleryvideos">Gallery Videos</NavLink>
              <NavLink className={activeSub} to="/gallery-add">Add Images</NavLink>
              <NavLink className={activeSub} to="/gallery-videos">Add Videos</NavLink>
            </div>
          </div>

          <div className="dropdown-group">
            <button className="dropdown-btn" onClick={() => toggleMenu("news")}>
              <IoBookOutline /> <span>News</span>
              <FiChevronDown
                className={`arrow ${openMenu === "news" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-content ${openMenu === "news" ? "show" : ""}`}>
              <NavLink className={activeSub} to="/news">News Images</NavLink>
              <NavLink className={activeSub} to="/newsvideospage">News Videos</NavLink>
              <NavLink className={activeSub} to="/news-add">Add News</NavLink>
              <NavLink className={activeSub} to="/news-videos">Add News Videos</NavLink>
            </div>
          </div>

          <div className="dropdown-group">
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("newsletter")}
            >
              <IoBookOutline /> <span>Newsletter</span>
              <FiChevronDown
                className={`arrow ${openMenu === "newsletter" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-content ${openMenu === "newsletter" ? "show" : ""}`}>
              <NavLink className={activeSub} to="/newsletter">Subscribers</NavLink>
            </div>
          </div>

          <NavLink className={activeMain} to="/speaker">
            <FiDollarSign /> <span>Speaker</span>
          </NavLink>

          <NavLink className={activeMain} to="/contacts">
            <FiMail /> <span>Contacts</span>
          </NavLink>

        </nav>
      </aside>

      <div
        className={`sidebar-backdrop ${isOpen ? "show" : ""}`}
        onClick={onBackdropClick}
      />
    </>
  );
}
