import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GalleryAddvideos = () => {
  const navigate = useNavigate();

  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading

  const [formData, setFormData] = useState({
    video_category: "",
    title: "",
    order_id: "",
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please upload a video file");
      return;
    }

    setLoading(true); // ⬅️ Start loading

    const fd = new FormData();
    fd.append("video_category", formData.video_category);
    fd.append("title", formData.title);
    fd.append("order_id", formData.order_id);
    fd.append("videos", videoFile);

    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/addVideoGallery`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Video uploaded successfully!");
      navigate("/galleryvideos");
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed! Check console.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="md-5">
      <Container className="my-5">
        <Card className="journey-card p-4 mt-4">
          <Card.Body>
            <h5 className="text-center fw-bold mb-2">ADD VIDEOS</h5>

            <Form className="journey-form" onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      className="form-control form-select"
                      disabled={loading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          video_category: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">-- Select Video Category --</option>
                      <option value="Project PoSSUM Acceleration ‘G’ profile">
                        Project PoSSUM Acceleration ‘G’ profile
                      </option>
                      <option value="Project PoSSUM Intravehicular Spacesuit">
                        Project PoSSUM Intravehicular Spacesuit
                      </option>
                      <option value="Mars Academy 3D Printing">
                        Mars Academy 3D Printing
                      </option>
                      <option value="Rover/ATV in Mars Analog Mission">
                        Rover/ATV in Mars Analog Mission
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter video title"
                      disabled={loading}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Upload Video</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  disabled={loading}
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

              <div className="text-center d-flex justify-content-center gap-3">
                <Button
                  variant="secondary"
                  disabled={loading} 
                  onClick={() => {
                    document.querySelector(".journey-form").reset();
                    setVideoPreview(null);
                  }}
                >
                  Reset
                </Button>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Uploading...
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
    </div>
  );
};

export default GalleryAddvideos;
