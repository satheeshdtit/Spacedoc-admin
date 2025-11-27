import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNews } from "../../context/NewsContext";

const EditNewsVideoModal = ({ show, onClose, data }) => {
  const { updateNewsVideo } = useNews();
  const [formData, setFormData] = useState({
    id: "",
    order_id: "",
    title: "",
    date: "",
    link: "",
  });

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        id: data.id,
        order_id: data.order_id,
        title: data.title,
        date: data.date,
        link: data.link,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateNewsVideo(formData);
    onClose(); 
  };

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit News Video</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Order Id</Form.Label>
            <Form.Control
              type="number"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>YouTube Link (Embed Link)</Form.Label>
            <Form.Control
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
            />
          </Form.Group>
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

export default EditNewsVideoModal;
