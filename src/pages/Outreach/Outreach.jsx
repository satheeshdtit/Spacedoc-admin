import React, { useState, useEffect } from "react";
import axios from "axios";
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

export default function CollaborateTablePage() {
  // API URL
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const API = `${BASE}${import.meta.env.VITE_API_COLLABORATE}`;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState("");

  // View Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch API Data on load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCollaborateData();
  }, []);

  const fetchCollaborateData = async () => {
    try {
      const res = await axios.get(API);

      if (res.data?.status === "success") {
        // Map API fields into table format
        const formatted = res.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          organizationName: item.org_name, // Map org_name → organizationName
          fullData: item, // Store full object for modal
        }));

        setData(formatted);
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      alert("Failed to fetch Collaborate data");
    }
  };

  const handleView = (row) => {
    setSelectedRow(row.fullData);
    setShowViewModal(true);
    window.dispatchEvent(new Event("modal-open"));
  };

  // FILTER
  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, "...", totalPages];
    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

 const handleDelete = async (row) => {
  const ok = window.confirm("Are you sure you want to delete this record?");
  if (!ok) return;

  try {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;

    await axios.delete(
      `${BASE}/admin/collaborate/${row.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ REMOVE FROM UI AFTER SUCCESS
    setData((prev) => prev.filter((item) => item.id !== row.id));

    alert("Collaboration request deleted successfully ✅");
  } catch (err) {
    console.error(
      "DELETE COLLABORATE ERROR:",
      err?.response?.data || err.message
    );

    alert(
      err?.response?.data?.message ||
      "Failed to delete collaboration request ❌"
    );
  }
};


  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4 mt-4">
        <h4 className="text-center fw-bold mb-4">REQUEST FOR COLLABORATE</h4>

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

        <div className="table-container">
          <Table className="simple-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Organization Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, idx) => (
                <tr key={row.id}>
                  <td>{indexOfFirstRow + idx + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{row.organizationName}</td>

                  <td className="d-flex gap-2">
                    <button
                      className="edit-icon-btn"
                      onClick={() => handleView(row)}
                    >
                      <FiMaximize2 size={16} />
                    </button>

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
            Showing {filteredData.length === 0 ? 0 : indexOfFirstRow + 1} to{" "}
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
                  className={`page-number ${p === currentPage ? "active" : ""}`}
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

        <Modal
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Collaboration Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedRow && (
              <>
                <p>
                  <strong>Name:</strong> {selectedRow.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRow.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRow.phone}
                </p>
                <p>
                  <strong>Organization:</strong> {selectedRow.org_name}
                </p>
                <p>
                  <strong>Project Name:</strong> {selectedRow.proj_name}
                </p>
                <p>
                  <strong>Message:</strong> {selectedRow.message}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedRow.date).toLocaleString()}
                </p>
              </>
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
