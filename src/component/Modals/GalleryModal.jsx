import React from "react";
import { Modal, Table, Button } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { useGallery } from "../../context/GalleryContext";

export default function GalleryModal({ show, handleClose, category }) {
  const { images, videos, deleteVideo, deleteImage } = useGallery();

  const items = [
    ...images
      .filter((item) => item.category === category)
      .map((item) => ({ ...item, type: "image" })),
    ...videos
      .filter((item) => item.category === category)
      .map((item) => ({ ...item, type: "video" })),
  ];

  const handleDelete = (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    if (item.type === "video") deleteVideo(item.id);
    else deleteImage(item.id);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="responsive-gallery-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{category} - Items</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table bordered hover responsive className="text-center align-middle">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>S.No</th>
              <th>Preview</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.type === "video" ? (
                      <video src={item.url} controls className="gallery-preview" />
                    ) : (
                      <img src={item.url} alt="img" className="gallery-preview" />
                    )}
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item)}>
                      <FiTrash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-3">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
