import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Table } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNews } from "../../context/NewsContext";
import EditNewsVideoModal from "../../component/Modals/EditNewsVideoModal";


export default function NewsVideosPage() {
  const { newsVideos, deleteNewsVideo } = useNews();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredData = newsVideos.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  const prevPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

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
          <Table className="simple-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Order Id</th>
                <th>Title</th>
                <th>Date</th>
                <th>YouTube Link</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, index) => (
                <tr key={row.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{row.order_id}</td>
                  <td>{row.title}</td>
                  <td>{row.date}</td>
                  <td>
                    <a href={row.link} target="_blank" rel="noreferrer">
                      Open Video
                    </a>
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="edit-icon-btn"
                      onClick={() => {
                        setEditItem(row);
                        setShowEditModal(true);
                      }}
                    >
                      <FiEdit size={16} />
                    </button>

                    <button
                      className="delete-icon-btn"
                      onClick={() => deleteNewsVideo(row.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="custom-pagination-container mt-4">
          <div className="pagination-info">
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="custom-pagination">
              <button className="page-btn" onClick={prevPage} disabled={currentPage === 1}>
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

              <button className="page-btn" onClick={nextPage} disabled={currentPage === totalPages}>
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
        />
      </Card>
    </Container>
  );
}















