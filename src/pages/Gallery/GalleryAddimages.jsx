import React, { useState } from "react";
import { Container, Card, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GalleryAddImages = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); 

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    order_id: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    setLoading(true); 

    const fd = new FormData();
    fd.append("image_category", formData.category);
    fd.append("title", formData.title);
    fd.append("order_id", formData.order_id);
    fd.append("gallery_image", imageFile);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_ADD_GALLERY,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message || "Image uploaded successfully");
      navigate("/gallery");

    } catch (error) {
      console.error("Upload Error:", error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="md-5">
      <Container className="my-5">
        <Card className="journey-card p-4 mt-4">
          <Card.Body>
            <h5 className="text-center fw-bold mb-2">ADD IMAGES</h5>

            <Form onSubmit={handleSubmit}>
              {/* CATEGORY */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  disabled={loading}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="NASA Johnson Space Center">NASA Johnson Space Center</option>
                  <option value="Project PoSSUM">Project PoSSUM</option>
                  <option value="MDRS">MDRS</option>
                  <option value="Mars Academy USA">Mars Academy USA</option>
                  <option value="ISU">ISU</option>
                  <option value="Project SIRIUS">Project SIRIUS</option>
                  <option value="Austrian Space Forum">Austrian Space Forum</option>
                  <option value="Conferences">Conferences</option>
                  <option value="Others">Others</option>
                </Form.Select>
              </Form.Group>

              {/* TITLE */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  disabled={loading}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Form.Group>

              {/* IMAGE UPLOAD */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  disabled={loading}
                  onChange={handleImageChange}
                />
              </Form.Group>

              {/* IMAGE PREVIEW */}
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

              {/* BUTTONS */}
              <div className="text-center d-flex justify-content-center gap-3">
                <Button
                  variant="secondary"
                  disabled={loading}
                  onClick={() => {
                    document.querySelector("form").reset();
                    setImagePreview(null);
                    setImageFile(null);
                    setFormData({ category: "", title: "", order_id: "" });
                  }}
                >
                  Reset
                </Button>

                <Button type="submit"  variant="primary" disabled={loading}>
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

export default GalleryAddImages;
