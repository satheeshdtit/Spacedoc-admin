import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function ChangePasswordForm({ onCancel }) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error
  };

  const validate = () => {
    const newErrors = {};

    if (!form.oldPassword) newErrors.oldPassword = "Old password is required.";

    if (!form.newPassword)
      newErrors.newPassword = "New password is required.";
    else if (form.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters.";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.newPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // No errors
  };

  const handleSubmit = () => {
    if (!validate()) return;

    alert("Password Changed Successfully!");

    onCancel();
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">CHANGE PASSWORD</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Old Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Old Password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            isInvalid={!!errors.oldPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.oldPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            isInvalid={!!errors.newPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.newPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Re-enter New Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
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
