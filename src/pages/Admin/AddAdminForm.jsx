import React, { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function AddAdminForm({ onAdd, onCancel }) {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const ADD_ADMIN_API = "/admin/profile"; 
  const [form, setForm] = useState({
    type: "",
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  const validate = () => {
    let newErrors = {};

    if (!form.type) newErrors.type = "Admin type is required";
    if (!form.name.trim()) newErrors.name = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password.trim())
      newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${BASE}${ADD_ADMIN_API}`,
        {
          admin_type: form.type,
          adminname: form.name,
          email: form.email,
          password: form.password
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Admin Profile Added Successfully") {
        setForm({
          type: "",
          name: "",
          email: "",
          password: "",
        });
        
        if (onAdd) {
          onAdd();
        }
        
        alert("Admin added successfully!");
        
        if (onCancel) {
          onCancel();
        }
      }
    } catch (error) {
      console.error("Add Admin Error:", error);
      
      if (error.response) {
        if (error.response.status === 409) {
          setErrorMessage("Admin with this email already exists");
        } else if (error.response.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Failed to add admin. Please try again.");
        }
      } else if (error.request) {
        setErrorMessage("No response from server. Please check your connection.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">ADD ADMIN</h5>

      {errorMessage && (
        <Alert variant="danger" className="mb-3">
          {errorMessage}
        </Alert>
      )}

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Admin Type*</Form.Label>
          <Form.Select
            name="type"
            value={form.type}
            onChange={handleChange}
            isInvalid={!!errors.type}
            disabled={loading}
          >
            <option value="">--Select admin type--</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.type}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Username*</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter Username"
            value={form.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email*</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password*</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Adding...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Form>
    </>
  );
}