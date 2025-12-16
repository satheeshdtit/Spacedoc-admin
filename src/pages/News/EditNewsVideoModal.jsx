import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const EditNewsVideoModal = ({ show, onClose, data, onUpdated }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    id: "",
    order_id: "",
    title: "",
    date: "",
    youtube_link: "",
  });

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        id: data.lang_id,           
        order_id: data.order_id,
        title: data.title,
        date: data.date?.slice(0, 10),
        youtube_link: data.youtube_link,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/admin/updateNewsVideo`, formData);

      if (res.data.status === "success") {
        alert("Video updated successfully!");
        onUpdated();  
        onClose();    
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      alert("Error updating video");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="my-5">
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
            <Form.Label>YouTube Link</Form.Label>
            <Form.Control
              type="text"
              name="youtube_link"
              value={formData.youtube_link}
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
