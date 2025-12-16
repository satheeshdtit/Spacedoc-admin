import React, { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const AddNewsVideos = ({ onAdded }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    youtube_link: "",
  });

  const [loading, setLoading] = useState(false); // 🔥 NEW LOADING STATE

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      title: "",
      date: "",
      youtube_link: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // 🔥 Start loading

    try {
      const res = await axios.post(`${BASE_URL}/admin/addNewsVideo`, formData);

      if (res.data.status === "success") {
        alert("News video added successfully!");
        handleReset();
        if (onAdded) onAdded();
      } else {
        alert("Failed to add video");
      }
    } catch (err) {
      console.error("ADD NEWS VIDEO ERROR:", err);
      alert("Error adding news video");
    } finally {
      setLoading(false); // 🔥 Stop loading
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 mt-4 shadow-sm">
        <Card.Body>
          <h5 className="text-center fw-bold mb-2">ADD NEWS VIDEOS</h5>

          <Form onSubmit={handleSubmit}>
            {/* TITLE */}
            <Form.Group className="mb-3">
              <Form.Label>Video Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter video title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* DATE */}
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* YOUTUBE LINK */}
            <Form.Group className="mb-3">
              <Form.Label>YouTube Link</Form.Label>
              <Form.Control
                type="text"
                name="youtube_link"
                placeholder="Paste YouTube link"
                value={formData.youtube_link}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* BUTTONS */}
            <div className="text-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleReset}
                disabled={loading} // disable during loading
              >
                Reset
              </Button>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddNewsVideos;
