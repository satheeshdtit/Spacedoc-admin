import React, { useState } from "react";
import {
  Container,
  Card,
  Table,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function InviteForSpeaker() {
  const speakerRequests = [
    {
      id: 1,
      name: "test",
      email: "test@gmail.com",
      phone: "7855675478",
      date: "27/11/2025",
      organization: "TEST",
      status: "Pending",
    },
  ];

  const [data, setData] = useState(speakerRequests);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  // ⭐ Inline Edit States
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // FILTER
  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
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

  // ⭐ DELETE
  const handleDelete = (row) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      setData((prev) => prev.filter((item) => item.id !== row.id));
    }
  };

  // ⭐ START EDIT
  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditValue(row.status);
  };

  // ⭐ SAVE EDIT
  const handleSave = (row) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, status: editValue } : item
      )
    );
    setEditingRowId(null);
  };

  const handleCancel = () => {
    setEditingRowId(null);
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h5 className="text-center fw-bold mb-4">INVITE FOR SPEAKER</h5>

        {/* CONTROL BAR */}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Organization Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((item, idx) => (
                <tr key={item.id}>
                  <td>{indexOfFirstRow + idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.date}</td>
                  <td>{item.organization}</td>

                  {/* ⭐ DROPDOWN FOR STATUS */}
                  <td>
                    {editingRowId === item.id ? (
                      <Form.Select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </Form.Select>
                    ) : (
                      item.status
                    )}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="d-flex gap-2">
                    {editingRowId === item.id ? (
                      <>
                        <button
                          className="edit-icon-btn"
                          onClick={() => handleSave(item)}
                        >
                          Save
                        </button>

                        <button
                          className="delete-icon-btn"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-icon-btn"
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit size={16} />
                        </button>

                        <button
                          className="delete-icon-btn"
                          onClick={() => handleDelete(item)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="custom-pagination-container mt-4">
          <div className="pagination-info">
            Showing {indexOfFirstRow + 1} to{" "}
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
