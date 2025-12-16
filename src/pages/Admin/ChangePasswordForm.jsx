import React, { useState } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi"; 

export default function ChangePasswordForm({ onCancel, adminId }) {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.oldPassword)
      newErrors.oldPassword = "Old password is required.";

    if (!form.newPassword)
      newErrors.newPassword = "New password is required.";
    else if (form.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters.";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.newPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!adminId) {
      alert("Admin not loaded. Please refresh.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", adminId);
      formData.append("old_password", form.oldPassword);
      formData.append("new_password", form.newPassword);

      const res = await axios.post(
        `${BASE}/admin/changePassword`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data?.message || "Password changed successfully ✅");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onCancel();
    } catch (err) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        err?.response?.data || err.message
      );

      alert(
        err?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">CHANGE PASSWORD</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Old Password*</Form.Label>
          <InputGroup>
            <Form.Control
              type={showOld ? "text" : "password"}
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              isInvalid={!!errors.oldPassword}
            />
            <InputGroup.Text
              style={{ cursor: "pointer" }}
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? <FiEyeOff /> : <FiEye />}
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {errors.oldPassword}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password*</Form.Label>
          <InputGroup>
            <Form.Control
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              isInvalid={!!errors.newPassword}
            />
            <InputGroup.Text
              style={{ cursor: "pointer" }}
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <FiEyeOff /> : <FiEye />}
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {errors.newPassword}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Re-enter New Password*</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
            />
            <InputGroup.Text
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </div>
      </Form>
    </>
  );
}
