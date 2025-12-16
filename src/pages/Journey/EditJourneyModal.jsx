import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";

const EditJourneyModal = ({ show, handleClose, data, onSave }) => {
  const [form, setForm] = useState({
    order_id: "",
    title: "",
    date: "",
    description: "",
    link: "",
    journey_image: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        order_id: data.order_id,
        title: data.title,
        date: data.date,
        description: data.description,
        link: data.link,
        journey_image: data.images || [],
      });
    }
  }, [data]);

  const handleImageRemove = (img) => {
    setForm({
      ...form,
      journey_image: form.journey_image.filter((i) => i !== img),
    });
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // const handleSubmit = async () => {
  //   const fd = new FormData();

  //   // 👉 Correct ID sent for update
  //   fd.append("id", data.lang_id);

  //   fd.append("title", form.title);
  //   fd.append("order_id", form.order_id);
  //   fd.append("description", form.description);
  //   fd.append("link", form.link);
  //   fd.append("date", form.date);

  //   form.journey_image.forEach((img) => {
  //     fd.append("existing_images", img);
  //   });

  //   newImages.forEach((file) => {
  //     fd.append("journey_image", file);
  //   });

  //   for (let p of fd.entries()) console.log(p[0], p[1]);

  //   const success = await onSave(fd);
  //   if (success) handleClose();
  // };

  const handleSubmit = async () => {
    const fd = new FormData();

    fd.append("id", data.lang_id);

    fd.append("title", form.title);
    fd.append("order_id", form.order_id);
    fd.append("description", form.description);
    fd.append("link", form.link);
    fd.append("date", form.date);

    // 🔥 Backend expects ONE string: "img1,img2,img3"
    fd.append("old_img", form.journey_image.join(","));

    // Add new images
    newImages.forEach((file) => {
      fd.append("journey_image", file);
    });

    console.log("FORMDATA:");
    for (let p of fd.entries()) console.log(p[0], p[1]);

    const success = await onSave(fd);
    if (success) handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="my-5" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Journey</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                value={form.order_id}
                onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mt-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Link</Form.Label>
          <Form.Control
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
        </Form.Group>

        <label className="fw-bold mt-3">Existing Images</label>
        <Row className="mb-3">
          {form.journey_image.map((img, idx) => (
            <Col md={3} key={idx}>
              <Image
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${img}`}
                thumbnail
              />
              <Button
                variant="danger"
                size="sm"
                className="mt-2"
                onClick={() => handleImageRemove(img)}
              >
                Remove
              </Button>
            </Col>
          ))}
        </Row>

        {newImagePreviews.length > 0 && (
          <>
            <label>New Image Preview</label>
            <Row className="mb-3">
              {newImagePreviews.map((preview, idx) => (
                <Col md={3} key={idx}>
                  <Image src={preview} thumbnail />
                </Col>
              ))}
            </Row>
          </>
        )}

        <Form.Group>
          <Form.Label>Add New Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleNewImages} />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditJourneyModal;
