import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import main_logo from "../../assets/Images/main_logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignIn() {
  const [form, setForm] = useState({
    adminname: "",
    admin_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [showPassword, setShowPassword] = useState(false); // ✅ TOGGLE STATE

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.adminname) newErrors.adminname = "Admin name is required";
    if (!form.admin_password)
      newErrors.admin_password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      const user = await login(form.adminname, form.admin_password);
      console.log("USER AFTER LOGIN:", user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: 420, width: "100%" }}>
        <div className="text-center mb-3">
          <img src={main_logo} alt="Logo" style={{ height: 70 }} />
        </div>

        <h3 className="text-center fw-bold mb-3">Sign In</h3>

        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* ✅ ADMIN NAME */}
          <Form.Group className="mb-3">
            <Form.Label>Admin Name</Form.Label>
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

          {/* ✅ PASSWORD WITH EYE ICON */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>

            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"} // ✅ TOGGLE
                name="admin_password"

                
                placeholder="Enter password"
                value={form.admin_password}
                onChange={handleChange}
                isInvalid={!!errors.admin_password}
              />

              <InputGroup.Text
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </InputGroup.Text>

              <Form.Control.Feedback type="invalid">
                {errors.admin_password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </Card>
    </Container>
  );
}
