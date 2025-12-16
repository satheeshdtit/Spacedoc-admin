import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import EditNewsVideoModal from "./EditNewsVideoModal";

export default function NewsVideosPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [videoRows, setVideoRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");

  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchVideoNews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getAllVideoNews`);
      const news = res.data.news || [];

      const flat = [];

      news.forEach((item) => {
        Object.entries(item.languages || {}).forEach(([lang, langData]) => {
          flat.push({
            lang_id: langData.id,
            language_code: lang,
            order_id: item.order_id,
            title: langData.title,
            description: langData.description,
            date: langData.date,
            youtube_link: item.youtube_link,
          });
        });
      });

      setVideoRows(flat);
    } catch (err) {
      console.error("GET VIDEO NEWS ERROR:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVideoNews();
  }, []);


  const deleteVideo = async (langId) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Do you want to delete this video entry?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/admin/deleteNews/${langId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        alert("Deleted successfully");
        fetchVideoNews(); 
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("DELETE VIDEO ERROR:", err);
      alert("Delete error");
    }
  };

  const filtered = videoRows.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, "...", totalPages];
    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4 mt-5">
        <h5 className="text-center fw-bold mb-3">NEWS VIDEOS</h5>

        <Row className="mb-3">
          <Col xs={6} md={3}>
            <Form.Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>Show 5</option>
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
            </Form.Select>
          </Col>

          <Col xs={6} md={3} className="ms-auto">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
        </Row>

        <div className="table-container">
          <Table  className="simple-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Order Id</th>
                <th>Language</th>
                <th>Title</th>
                <th>Date</th>
                <th>YouTube</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, index) => (
                <tr key={row.lang_id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{row.order_id}</td>
                  <td>{row.language_code}</td>
                  <td>{row.title}</td>
                  <td>{row.date ? row.date.slice(0, 10) : "—"}</td>

                  <td>
                    <a href={row.youtube_link} target="_blank" rel="noreferrer">
                      Open Video
                    </a>
                  </td>

                  <td className="d-flex gap-2">
                    <button
                      className="edit-icon-btn"
                      onClick={() => {
                        setEditItem(row);
                        setShowEditModal(true);
                        window.dispatchEvent(new Event("modal-open"));
                      }}
                    >
                      <FiEdit size={16} />
                    </button>

                    <button
                      className="delete-icon-btn"
                      onClick={() => deleteVideo(row.lang_id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="custom-pagination-container mt-4">
          <div className="pagination-info">
            Showing {filtered.length === 0 ? 0 : indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filtered.length)} of {filtered.length}{" "}
            entries
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="custom-pagination">
              <button
                className="page-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              {getPageNumbers().map((p, i) => (
                <button
                  key={i}
                  className={`page-number ${p === currentPage ? "active" : ""}`}
                  onClick={() => p !== "..." && setCurrentPage(p)}
                  disabled={p === "..."}
                >
                  {p}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </div>

            <div className="go-to-page d-flex align-items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                className="go-input"
                placeholder="Go to..."
              />
              <button
                className="go-btn"
                onClick={() => {
                  const page = Number(goToPage);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                    setGoToPage("");
                  }
                }}
              >
                Go
              </button>
            </div>
          </div>
        </div>

        <EditNewsVideoModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editItem}
          onUpdated={fetchVideoNews} 
        />
      </Card>
    </Container>
  );
}
