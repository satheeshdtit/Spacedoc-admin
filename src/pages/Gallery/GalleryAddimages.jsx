import React, { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGallery } from "../../context/GalleryContext";

const GalleryAddimages = () => {
  const navigate = useNavigate();
  const { addImage } = useGallery();
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    order_id: "",
    url: ""
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData({ ...formData, url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addImage({ id: Date.now(), ...formData });
    navigate("/gallery");
  };

  return (
    <div className="md-5">
      <Container className="my-5">
        <Card className="journey-card p-4 mt-4">
          <Card.Body>
            <h5 className="text-center journey-title mb-4">Add Images</h5>

            <Form className="journey-form" onSubmit={handleSubmit}>
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


              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Order Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter order id"
                  onChange={(e) =>
                    setFormData({ ...formData, order_id: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
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

              <div className="text-center d-flex justify-content-center gap-3">
                <Button
                  variant="secondary"
                  className="journey-submit-btn"
                  onClick={() => {
                    document.querySelector(".journey-form").reset();
                    setImagePreview(null);
                  }}
                >
                  Reset
                </Button>

                <Button type="submit" className="journey-submit-btn" variant="primary">
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

export default GalleryAddimages;
