import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import main_logo from "../../assets/Images/main_logo.png";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // means valid
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert("Sign In Successful!");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg auth-card">
        <div className="text-center mb-3">
          <img src={main_logo} alt="Logo" className="auth-logo" />
        </div>

        <h3 className="text-center mb-3 fw-bold">Sign In</h3>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password*</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 mt-2"
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </Form>
      </Card>
    </Container>
  );
}




