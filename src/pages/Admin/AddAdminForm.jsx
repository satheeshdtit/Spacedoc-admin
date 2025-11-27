import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function AddAdminForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    type: "",
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newAdmin = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      type: form.type,
    };

    onAdd(newAdmin);
    onCancel();
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">ADD ADMIN</h5>

      <Form noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Admin Type*</Form.Label>
          <Form.Select
            name="type"
            value={form.type}
            onChange={handleChange}
            isInvalid={!!errors.type}
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
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}
