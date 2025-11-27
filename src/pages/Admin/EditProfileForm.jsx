import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function EditProfileForm({ data, onUpdate, onCancel }) {
  const [form, setForm] = useState({
    username: data.username,
    email: data.email,
    type: data.type,
  });

  const [errors, setErrors] = useState({});

  // Validate fields
  const validate = () => {
    let newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.type.trim()) {
      newErrors.type = "Admin type is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // no errors → valid
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // remove error message after typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = () => {
    if (!validate()) return; // stop if invalid

    onUpdate(form);
    onCancel();
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">EDIT ADMIN PROFILE</h5>

      <Form>
        {/* Username */}
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

        {/* Email */}
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

        {/* Admin Type */}
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
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </div>
      </Form>
    </>
  );
}
