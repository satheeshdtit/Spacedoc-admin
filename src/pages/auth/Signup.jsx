import React, { useState } from "react";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import main_logo from "../../assets/Images/main_logo.png";
import { useAuth } from "../../context/AuthContext";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    adminname: "",
    email: "",
    crypt_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!form.adminname) newErrors.adminname = "Admin name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.crypt_id) newErrors.crypt_id = "Crypt ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler with API
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await signup(form.adminname, form.email, form.crypt_id);
      alert("Account Created Successfully!");
      navigate("/signin");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg auth-card" style={{ width: "100%", maxWidth: "420px" }}>
        
        <div className="text-center mb-3">
          <img src={main_logo} alt="Logo" className="auth-logo" />
        </div>

        <h3 className="text-center mb-3 fw-bold">Sign Up</h3>

        <Form>
          {/* ✅ ADMIN NAME */}
          <Form.Group className="mb-3">
            <Form.Label>Admin Name*</Form.Label>
            <Form.Control
              type="text"
              name="adminname"
              placeholder="Enter admin name"
              value={form.adminname}
              onChange={handleChange}
              isInvalid={!!errors.adminname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.adminname}
            </Form.Control.Feedback>
          </Form.Group>

          {/* ✅ EMAIL */}
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

          {/* ✅ CRYPT ID */}
          <Form.Group className="mb-3">
            <Form.Label>Crypt ID*</Form.Label>
            <Form.Control
              type="text"
              name="crypt_id"
              placeholder="Enter Crypt ID"
              value={form.crypt_id}
              onChange={handleChange}
              isInvalid={!!errors.crypt_id}
            />
            <Form.Control.Feedback type="invalid">
              {errors.crypt_id}
            </Form.Control.Feedback>
          </Form.Group>

          {/* ✅ SUBMIT BUTTON */}
          <Button
            variant="primary"
            className="w-100 mt-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Sign Up"}
          </Button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/signin">Login</Link>
          </p>
        </Form>
      </Card>
    </Container>
  );
}
