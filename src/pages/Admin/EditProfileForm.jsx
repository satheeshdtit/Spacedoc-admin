import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function EditProfileForm({ data, onUpdate, onCancel }) {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const token = JSON.parse(localStorage.getItem("authUser"))?.token || "";

  const [form, setForm] = useState({
    username: data.adminname || data.username || "",
    email: data.email || "",
    type: data.admin_type || data.type || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required.";

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.type.trim()) newErrors.type = "Admin type is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await axios.put(
        `${BASE}/admin/editAdmin`,
        {
          id: data.id,                    
          adminname: form.username,      
          email: form.email,             
          admin_type: form.type,          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully");

      onUpdate?.();  
      onCancel?.();  

    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err?.response?.data || err.message);
      alert(
        err?.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">EDIT ADMIN PROFILE</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username*</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email*</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Admin Type*</Form.Label>
          <Form.Select
            name="type"
            value={form.type}
            onChange={handleChange}
            isInvalid={!!errors.type}
          >
            <option value="">-- Select --</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
          </Form.Select>

          <Form.Control.Feedback type="invalid">
            {errors.type}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Update"}
          </Button>
        </div>
      </Form>
    </>
  );
}
