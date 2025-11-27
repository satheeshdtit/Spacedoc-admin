import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNews } from "../../context/NewsContext";

const AddNewsVideos = () => {
  const { addNewsVideo } = useNews();

  const [formData, setFormData] = useState({
    order_id: "",
    title: "",
    date: "",
    link: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({ order_id: "", title: "", date: "", link: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewsVideo(formData);
    handleReset();
  };

  return (
    <div className="md-5">
      <Container className="my-5">
        <Card className="journey-card p-4 mt-4">
          <Card.Body>
            <h5 className="text-center journey-title mb-4">ADD NEWS VIDEOS</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Order Id</Form.Label>
                <Form.Control
                  type="number"
                  name="order_id"
                  value={formData.order_id}
                  onChange={handleChange}
                  placeholder="Enter Order ID"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  required
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label>YouTube Link</Form.Label>
                <Form.Control
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Paste YouTube Link"
                  required
                />
              </Form.Group>

              <div className="text-end mt-4">
                <Button variant="secondary" type="button" className="me-2" onClick={handleReset}>
                  Reset
                </Button>
                <Button variant="primary" type="submit">
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

export default AddNewsVideos;

