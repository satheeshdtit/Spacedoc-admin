import React, { useState } from "react";
import {
  Container,
  Card,
  Table,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";

export default function NewsLetter() {
  // STATIC DATA
  const staticSubscribers = [
    { id: 1, email: "test@gmail.com" },
    { id: 2, email: "test1@gmail.com" },
  ];

  const [data, setData] = useState(staticSubscribers);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  // FILTER DATA
  const filteredData = data.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION CALC
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  // DELETE FUNCTION
  const handleDelete = (row) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    setData((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">

        <h5 className="text-center fw-bold mb-4">SUBSCRIBERS</h5>

        {/* TOP BAR */}
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

        {/* TABLE */}
        <div className="table-container">
          <Table className="simple-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, idx) => (
                <tr key={row.id}>
                  <td>{indexOfFirstRow + idx + 1}</td>
                  <td>{row.email}</td>

                  <td className="d-flex gap-2">
                    <button
                      className="delete-icon-btn"
                      onClick={() => handleDelete(row)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="custom-pagination-container mt-4">
          <div className="pagination-info">
            Showing {filteredData.length === 0 ? 0 : indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* PAGE BUTTONS */}
            <div className="custom-pagination">
              <button
                className="page-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-number ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
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

            {/* GO TO PAGE */}
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
      </Card>
    </Container>
  );
}
