import React, { useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGallery } from "../../context/GalleryContext";

const GalleryAddvideos = () => {
  const navigate = useNavigate();
  const { addVideo } = useGallery();
  const [videoPreview, setVideoPreview] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    order_id: "",
    url: "",
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setFormData({ ...formData, url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addVideo({ id: Date.now(), type: "video", ...formData });
    navigate("/galleryvideos");
  };

  return (
    <div className="md-5">
      <Container className="my-5">
        <Card className="journey-card p-4 mt-4">
          <Card.Body>
            <h5 className="text-center journey-title mb-4">Add Videos</h5>

            <Form className="journey-form" onSubmit={handleSubmit}>
              {/* Category + Title */}
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter category"
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter video title"
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Order Id</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter order id"
                  onChange={(e) =>
                    setFormData({ ...formData, order_id: e.target.value })
                  }
                />
              </Form.Group>

              {/* Upload */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Video</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </Form.Group>

              {videoPreview && (
                <div className="image-preview mb-3 text-center">
                  <video
                    src={videoPreview}
                    controls
                    className="img-fluid rounded"
                    style={{ maxHeight: "280px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="text-center d-flex justify-content-center gap-3">
                <Button
                  variant="secondary"
                  className="journey-submit-btn"
                  onClick={() => {
                    document.querySelector(".journey-form").reset();
                    setVideoPreview(null);
                  }}
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  className="journey-submit-btn"
                  variant="primary"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GalleryAddvideos;
