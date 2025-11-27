import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import main_logo from "../../assets/Images/main_logo.png";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", cryptId: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.cryptId) newErrors.cryptId = "Crypt ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert("Account Created Successfully!");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg auth-card">
        <div className="text-center mb-3">
          <img src={main_logo} alt="Logo" className="auth-logo" />
        </div>

        <h3 className="text-center mb-3 fw-bold">Sign Up</h3>

        <Form>
          {/* NAME */}
          <Form.Group className="mb-3">
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* CRYPT ID */}
          <Form.Group className="mb-3">
            <Form.Label>Crypt ID*</Form.Label>
            <Form.Control
              type="text"
              name="cryptId"
              placeholder="Enter Crypt ID"
              value={form.cryptId}
              onChange={handleChange}
              isInvalid={!!errors.cryptId}
            />
            <Form.Control.Feedback type="invalid">
              {errors.cryptId}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" className="w-100 mt-2" onClick={handleSubmit}>
            Sign Up
          </Button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/signin">Login</Link>
          </p>
        </Form>
      </Card>
    </Container>
  );
}
