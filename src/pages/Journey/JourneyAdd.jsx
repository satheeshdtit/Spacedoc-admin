import React, { useState, useContext } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { JourneyContext } from "../../context/JourneyContext";

const JourneyAdd = () => {
  const { addJourney } = useContext(JourneyContext);

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setForm({ ...form, image: url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addJourney(form);

    alert("Journey added!");

    setForm({ title: "", date: "", description: "", link: "", image: "" });
    setImagePreview(null);
  };

  return (
    <Container className="my-5">
      <Card className="p-4">
        <Card.Body>
          <h5 className="text-center fw-bold mb-3">Add Journey</h5>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter Title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter Description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                name="link"
                value={form.link}
                placeholder="Enter Link"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>

            {imagePreview && (
              <div className="mb-3 text-center">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: 150 }}
                />
              </div>
            )}

            <Button type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JourneyAdd;
