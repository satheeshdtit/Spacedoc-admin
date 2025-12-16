  import React, { useState } from "react";
  import { Container, Card, Button, Form, Spinner } from "react-bootstrap";
  import axios from "axios";

  const AddNews = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [form, setForm] = useState({
      title: "",
      date: "",
      description: "",
      link: "",
      news_image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false); // 🔥 NEW LOADING STATE

    const handleImage = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setForm({ ...form, news_image: file });
      }
    };

    // SUBMIT FUNCTION
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!form.news_image) {
        alert("Please upload an image");
        return;
      }

      setLoading(true); // 🔥 START LOADING

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("date", form.date);
      fd.append("description", form.description);
      fd.append("link", form.link);
      fd.append("news_image", form.news_image);

      const token = JSON.parse(localStorage.getItem("authUser"))?.token;

      try {
        const res = await axios.post(
          `${BASE_URL}/admin/addNews`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(res.data.message || "News added successfully");
        handleReset();

      } catch (error) {
        console.error("ADD NEWS ERROR:", error);
        alert(error.response?.data?.message || "Upload failed");
      } finally {
        setLoading(false); // 🔥 STOP LOADING
      }
    };

    const handleReset = () => {
      setForm({
        title: "",
        date: "",
        description: "",
        link: "",
        news_image: null,
      });
      setImagePreview(null);
    };

    return (
      <Container className="my-5">
        <Card className="journey-card p-4 mt-4">
          <Form>
            <h5 className="text-center fw-bold mb-2">ADD NEWS</h5>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={form.title}
                placeholder="Enter Title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                placeholder="Enter Description"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                value={form.link}
                placeholder="Enter Link"
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImage} />
            </Form.Group>

            {imagePreview && (
              <div className="image-preview mb-3 text-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            <div className="d-flex gap-3 justify-content-center">
              <Button variant="secondary" onClick={handleReset} disabled={loading}>
                Reset
              </Button>

              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading} // 🔥 prevent double-click
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    );
  };

  export default AddNews;
