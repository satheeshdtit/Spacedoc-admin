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
  });

  const [journey_image, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ optional loader

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!journey_image) {
      alert("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("date", form.date);
      formData.append("description", form.description);
      formData.append("link", form.link);
      formData.append("journey_image", journey_image);

      // ✅ SINGLE API CALL ONLY
      const response = await addJourney(formData);

      // ✅ SUCCESS ALERT
      alert(response?.message || "Journey added successfully ✅");

      // ✅ RESET FORM AFTER SUCCESS
      setForm({
        title: "",
        date: "",
        description: "",
        link: "",
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("ADD JOURNEY ERROR:", err);
      alert("Failed to add journey ❌");
    } finally {
      setLoading(false);
    }
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
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                as="textarea"
                rows={2}
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
                onChange={handleChange}
                placeholder="Enter Link"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>

            {imagePreview && (
              <div className="text-center mb-3">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: 150 }}
                />
              </div>
            )}

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JourneyAdd;
  