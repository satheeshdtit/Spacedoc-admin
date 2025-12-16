// src/pages/Admin/UpdateProfileImageModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import axios from "axios";

export default function UpdateProfileImageModal({
  show,
  onClose,
  profile,
  onUpdated,
}) {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const token = JSON.parse(localStorage.getItem("authUser"))?.token || "";

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ CLEAN UP PREVIEW TO PREVENT MEMORY LEAK
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ✅ RESET WHEN MODAL CLOSES
  useEffect(() => {
    if (!show) {
      setFile(null);
      setPreview(null);
    }
  }, [show]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const previewURL = URL.createObjectURL(selectedFile);
    setPreview(previewURL);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    if (!profile?.id) {
      alert("Profile not loaded. Please refresh the page.");
      return;
    }

    const formData = new FormData();
    formData.append("admin_img", file);   // ✅ backend field name
    formData.append("adminId", profile.id);

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE}/admin/uploadImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

const newImage = res.data.admin_img;

const imageWithNoCache = `${newImage}?t=${Date.now()}`;

localStorage.setItem("adminProfileImage", imageWithNoCache);

window.dispatchEvent(new Event("profile-image-updated"));

alert("Profile image updated successfully");

onUpdated();   
onClose();

    } catch (err) {
      console.error("IMAGE UPDATE ERROR:", err?.response?.data || err.message);
      alert(
        err?.response?.data?.message ||
        "Server error while uploading image"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Profile Image</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <Image
          src={preview || profile?.image || "/placeholder-profile.png"}
          roundedCircle
          width={140}
          height={140}
          style={{ objectFit: "cover" }}
          className="mb-3"
        />

        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <Button
          className="mt-3 w-100"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Upload"}
        </Button>
      </Modal.Body>
    </Modal>
  );
}
