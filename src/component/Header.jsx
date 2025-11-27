import React from "react";
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Dropdown,
  Image,
} from "react-bootstrap";
import { FiMenu } from "react-icons/fi";
import admin from "../assets/Images/admin.png";
import logo from "../assets/Images/logo.jpg";
import "../assets/styles/header.css";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or session if any
    localStorage.removeItem("authToken");

    // Navigate to sign-in page
    navigate("/signin");
  };

  return (
    <Navbar bg="dark" expand="lg" className="app-header px-3 shadow-sm">
      <Container fluid>
        <button
          className="menu-btn btn btn-link p-0 me-4"
          onClick={toggleSidebar}
          style={{ color: "white" }}
        >
          <FiMenu size={24} />
        </button>

        <Navbar.Brand className="d-flex align-items-center gap-2 me-auto">
          <img src={logo} alt="Logo" className="header-logo" />
        </Navbar.Brand>

        <div className="search-container d-none d-md-block me-3">
          <Form className="d-flex">
            <FormControl type="search" placeholder="Search..." />
          </Form>
        </div>

        <div className="profile-wrapper">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="profile-dropdown"
              className="p-0 border-0 bg-transparent"
            >
              <Image
                src={admin}
                roundedCircle
                width="40"
                height="40"
                style={{ objectFit: "cover" }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/profile")}>
                Profile
              </Dropdown.Item>

              <Dropdown.Item onClick={handleLogout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}
