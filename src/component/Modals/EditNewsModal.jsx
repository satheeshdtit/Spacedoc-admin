import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNews } from "../../context/NewsContext";

const EditNewsModal = ({ show, onClose, data }) => {
  const { updateNews } = useNews();
  const [form, setForm] = useState(data);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(data);
    setImagePreview(data?.image || "");
  }, [data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setForm({ ...form, image: url });
    }
  };

  const handleSave = () => {
    updateNews(form);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit News</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={form?.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Order ID</Form.Label>
            <Form.Control
              value={form?.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={form?.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Update Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          {imagePreview && (
            <div className="text-center mb-3">
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: "120px", height: "80px", objectFit: "cover" }}
                className="rounded"
              />
            </div>
          )}

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditNewsModal;
