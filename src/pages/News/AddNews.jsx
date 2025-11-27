import React, { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useNews } from "../../context/NewsContext";

const AddNews = () => {
  const { addNews } = useNews();
  const [form, setForm] = useState({
    order_id: "",
    title: "",
    date: "",
    description: "",
    link: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setForm({ ...form, image: url }); // FIXED
    }
  };

  const handleSubmit = () => {
    if (!form.title) return alert("Enter title");
    addNews(form);
    setForm({
      order_id: "",
      title: "",
      date: "",
      description: "",
      link: "",
      image: "",
    });
  };

  return (
    <Container className="my-5">
      <Card className="journey-card p-4 mt-4">
        <Form>
          <h5 className="text-center mb-4">Add News</h5>

          <Form.Group className="mb-3">
            <Form.Label>Order ID</Form.Label>
            <Form.Control
              value={form.order_id}
              placeholder="Enter Order Id"
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
            />
          </Form.Group>

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
            <Button
              variant="secondary"
              onClick={() =>
                setForm({
                  order_id: "",
                  title: "",
                  date: "",
                  description: "",
                  link: "",
                  image: "",
                })
              }
            >
              Reset
            </Button>

            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddNews;
