import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const EditNewsModal = ({ show, onClose, data, onUpdated }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    link: "",
    language_code: "",
  });

  const [oldImage, setOldImage] = useState("");
  const [newsImage, setNewsImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        id: data.lang_id || data.id, 
        title: data.title || "",
        description: data.description || "",
        date: data.date ? data.date.slice(0, 10) : "",
        link: data.link || "",
        language_code: data.language_code || "",
      });

      setOldImage(data.image_url || "");
      setImagePreview(data.image_url || "");
    }
  }, [data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewsImage(file);
    setImagePreview(URL.createObjectURL(file));
  };


  const getToken = () => {
    try {
      const authUserStr = localStorage.getItem("authUser");
      if (!authUserStr) {
        console.error("No authUser found in localStorage");
        return null;
      }
      
      const authUser = JSON.parse(authUserStr);
      return authUser?.token || null;
    } catch (error) {
      console.error("Error parsing authUser:", error);
      return null;
    }
  };

  const handleSave = async () => {
    const token = getToken();
    
    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    if (!form.title || !form.description || !form.date) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    
    formData.append("id", form.id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("link", form.link);
    formData.append("language_code", form.language_code);
    
    if (oldImage) {
      formData.append("old_image", oldImage);
    }

    if (newsImage) {
      formData.append("news_image", newsImage);
    }

    setLoading(true);

    try {
      console.log("Sending request to:", `${BASE_URL}/admin/newsUpdate`);
      console.log("Token:", token.substring(0, 20) + "...");
      console.log("Form data keys:");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }

      const res = await axios.put(
        `${BASE_URL}/admin/newsUpdate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", res.data);

      if (res.data.status === "success") {
        alert("News updated successfully");
        onUpdated();
        onClose();
      } else {
        alert(`Update failed: ${res.data.message || "Unknown error"}`);
      }

    } catch (error) {
      console.error("UPDATE ERROR DETAILS:", error);
      
      if (error.response) {

        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        
        if (error.response.status === 401) {
          alert("Session expired. Please login again.");
        } else if (error.response.status === 403) {
          alert("Permission denied. You don't have access to update news.");
        } else {
          alert(`Update failed: ${error.response.data.message || `Server error ${error.response.status}`}`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Check your network connection.");
      } else {
        console.error("Request setup error:", error.message);
        alert(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="my-5">
      <Modal.Header closeButton>
        <Modal.Title>Edit News</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date *</Form.Label>
            <Form.Control
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link</Form.Label>
            <Form.Control
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language Code</Form.Label>
            <Form.Control
              value={form.language_code}
              onChange={(e) => setForm({ ...form, language_code: e.target.value })}
              placeholder="e.g., en, fr, es"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Update Image</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleImageChange}
              accept="image/*"
            />
            <Form.Text className="text-muted">
              Leave empty to keep current image
            </Form.Text>
          </Form.Group>

          {imagePreview && (
            <div className="text-center mb-3">
              <p className="small">Image Preview:</p>
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  width: 200,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
                onError={(e) => {
                  e.target.src = "https://dummyimage.com/200x120/cccccc/000000&text=No+Image";
                }}
              />
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={loading || !form.title || !form.description || !form.date}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditNewsModal;