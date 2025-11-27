import React, { useState } from "react";
import {
  Container,
  Card,
  Table,
  Row,
  Col,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { FiMaximize2, FiTrash2 } from "react-icons/fi";

export default function Sponsors() {
  // STATIC DATA
  const staticData = [
    {
      id: 1,
      name: "test",
      email: "test@gmail.com",
      phone: "9940847108",
      organizationName: "Madras University",
    },
    {
      id: 2,
      name: "test 2",
      email: "tst@gmail.com",
      phone: "9940847701",
      organizationName: "Anna University",
    },
  ];

  // Columns for dynamic table
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Organization Name", accessor: "organizationName" },
  ];

  // States
  const [data, setData] = useState(staticData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState("");

  // View Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleView = (row) => {
    setSelectedRow(row);
    setShowViewModal(true);
  };

  // FILTER
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, "...", totalPages];
    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  // DELETE ROW
  const handleDelete = (row) => {
    setData(data.filter((item) => item.id !== row.id));
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4 mt-4">
        <h4 className="text-center fw-bold mb-4">REQUEST FOR SPONSORS</h4>

        {/* Row count + Search */}
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

                {columns.map((col, index) => (
                  <th key={index}>{col.header}</th>
                ))}

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, idx) => (
                <tr key={row.id}>
                  <td>{indexOfFirstRow + idx + 1}</td>

                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>{row[col.accessor]}</td>
                  ))}

                  <td className="d-flex gap-2">
                    {/* VIEW BUTTON */}
                    <button
                      className="edit-icon-btn"
                      onClick={() => handleView(row)}
                    >
                      <FiMaximize2 size={16} />
                    </button>

                    {/* DELETE BUTTON */}
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
                  <td colSpan={columns.length + 2} className="text-center py-3">
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
            Showing{" "}
            {filteredData.length === 0 ? 0 : indexOfFirstRow + 1} to{" "}
            {Math.min(indexOfLastRow, filteredData.length)} of{" "}
            {filteredData.length} entries
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
                  className={`page-number ${
                    p === currentPage ? "active" : ""
                  }`}
                  onClick={() =>
                    p !== "..." && typeof p === "number"
                      ? setCurrentPage(p)
                      : null
                  }
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
              <Button
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
              </Button>
            </div>
          </div>
        </div>

        {/* VIEW MODAL */}
        <Modal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedRow && (
              <div>
                <p><strong>Name:</strong> {selectedRow.name}</p>
                <p><strong>Email:</strong> {selectedRow.email}</p>
                <p><strong>Phone:</strong> {selectedRow.phone}</p>
                <p>
                  <strong>Organization:</strong>{" "}
                  {selectedRow.organizationName}
                </p>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </Container>
  );
}
