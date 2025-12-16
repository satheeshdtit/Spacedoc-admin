// src/component/Modals/GalleryModal.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Modal, Table, Button, Form, Spinner } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import PropTypes from "prop-types";

/**
 * GalleryModal
 *
 * Props:
 * - show (bool)
 * - handleClose (func)
 * - category (string)
 * - images (array)  // each: { id, category, image_url, ... }
 * - videos (array)  // each: { id, category, video_url, ... }
 * - baseUrl (string) optional override for API base (defaults to env)
 * - onDeleteSuccess / onDelete / onImageDeleted / onVideoDeleted (func) optional callback for parent refresh
 */

export default function GalleryModal({
  show,
  handleClose,
  category,
  images: propImages = [],
  videos: propVideos = [],
  baseUrl,
  onDeleteSuccess,
  onDelete,
  onImageDeleted,
  onVideoDeleted,
}) {
  const BASE_URL = baseUrl || import.meta.env.VITE_API_BASE_URL || "";

  // Local fallback — put a file at public/fallback.png
  const LOCAL_FALLBACK = "/fallback.png";

  // Utility: normalize category string for flexible matching
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .trim();

  const matchCategory = (itemCategory, activeCategory) => {
    const c1 = normalize(itemCategory);
    const c2 = normalize(activeCategory);
    if (!c1 || !c2) return false;
    return c1 === c2 || c1.includes(c2) || c2.includes(c1);
  };

  // Track optimistic deletion in modal
  const [removedIds, setRemovedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Build items (images + videos) filtered by category
  const items = useMemo(() => {
    const imgs = Array.isArray(propImages)
      ? propImages
          .filter((x) => x && matchCategory(x.category, category))
          .map((x) => ({ id: x.id, type: "image", url: x.image_url, raw: x }))
      : [];

    const vids = Array.isArray(propVideos)
      ? propVideos
          .filter((x) => x && matchCategory(x.category, category))
          .map((x) => ({ id: x.id, type: "video", url: x.video_url, raw: x }))
      : [];

    return [...imgs, ...vids].filter((it) => !removedIds.includes(it.id));
  }, [propImages, propVideos, category, removedIds]);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = items.slice(indexOfFirst, indexOfLast);

  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  // API calls
  const deleteImageAPI = (id) =>
    axios.delete(
      `${BASE_URL.replace(/\/$/, "")}/admin/deleteGalleryImage/${id}`
    );

  const deleteVideoAPI = (id) =>
    axios.delete(`${BASE_URL.replace(/\/$/, "")}/admin/deleteVideo/${id}`);

  // Helper to call any parent refresh callback if provided
  const callParentRefresh = () => {
    try {
      if (typeof onDeleteSuccess === "function") onDeleteSuccess();
      if (typeof onDelete === "function") onDelete();
      if (typeof onImageDeleted === "function") onImageDeleted();
      if (typeof onVideoDeleted === "function") onVideoDeleted();
    } catch (e) {
      // do not crash if parent callback throws
      console.warn("parent refresh callback error", e);
    }
  };

  // Delete handler (works for both image & video items)
  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    setDeletingId(item.id);

    try {
      if (item.type === "video") {
        await deleteVideoAPI(item.id);
      } else {
        await deleteImageAPI(item.id);
      }

      // optimistic UI remove
      setRemovedIds((prev) => [...prev, item.id]);

      // notify parent to refresh
      callParentRefresh();

      // dispatch global event
      try {
        window.dispatchEvent(
          new CustomEvent("gallery:deleted", {
            detail: { id: item.id, type: item.type },
          })
        );
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // fallback for older browsers
        const evt = document.createEvent("Event");
        evt.initEvent("gallery:deleted", true, true);
        window.dispatchEvent(evt);
      }

      alert(`${item.type.toUpperCase()} deleted successfully!`);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Failed to delete. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Reset modal state when opened/closed or category changes
  useEffect(() => {
    if (show) {
      setCurrentPage(1);
      setGoToPage("");
      setRemovedIds([]);
    }
  }, [show, category]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="mt-5">
      <Modal.Header closeButton>
        <Modal.Title>{category || "Gallery"} – Items</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Pagination Header */}
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <Form.Select
            style={{ width: 140 }}
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value || 6));
              setCurrentPage(1);
            }}
          >
            <option value={3}>Show 3</option>
            <option value={6}>Show 6</option>
            <option value={12}>Show 12</option>
          </Form.Select>

          <div>
            Showing {items.length === 0 ? 0 : indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, items.length)} of {items.length}
          </div>
        </div>

        {/* Table */}
        <Table bordered hover responsive className="text-center">
          <thead>
            <tr>
              <th style={{ width: 70 }}>S.No</th>
              <th>Preview</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((item, i) => {
                const key = `${item.type}-${item.id}`;
                return (
                  <tr key={key}>
                    <td>{indexOfFirst + i + 1}</td>

                    <td style={{ verticalAlign: "middle" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "100px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden",
                          background: "#f9f9f9",
                          borderRadius: "6px",
                        }}
                      >
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            controls
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={`preview-${item.id}`}
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = LOCAL_FALLBACK;
                            }}
                          />
                        )}
                      </div>
                    </td>

                    <td className="align-middle">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        disabled={deletingId !== null}
                        title={`Delete ${item.type}`}
                      >
                        {deletingId === item.id ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-1"
                            />
                            Deleting
                          </>
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="py-3">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination Footer */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="custom-pagination d-flex gap-1 align-items-center">
            <button
              className="page-btn btn btn-outline-secondary btn-sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`page-number btn btn-sm ${
                  currentPage === idx + 1
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="page-btn btn btn-outline-secondary btn-sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: 90 }}
              placeholder="Go to..."
            />
            <Button
              size="sm"
              onClick={() => {
                const p = Number(goToPage);
                if (p >= 1 && p <= totalPages) {
                  setCurrentPage(p);
                  setGoToPage("");
                }
              }}
            >
              Go
            </Button>
          </div>
        </div>
      </Modal.Body>

      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}

GalleryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  category: PropTypes.string,
  images: PropTypes.array,
  videos: PropTypes.array,
  baseUrl: PropTypes.string,
  onDeleteSuccess: PropTypes.func,
  onDelete: PropTypes.func,
  onImageDeleted: PropTypes.func,
  onVideoDeleted: PropTypes.func,
};
