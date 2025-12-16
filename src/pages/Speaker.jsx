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
} from "react-bootstrap";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";

export default function InviteForSpeaker() {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const API = `${BASE}${import.meta.env.VITE_API_SPEAKER}`;

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ✅ FETCH SPEAKERS
  useEffect(() => {
    fetchSpeakers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSpeakers = async () => {
    try {
      const res = await axios.get(API);

      if (res.data?.status === "success") {
        const formatted = res.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          date: item.date?.substring(0, 10),
          organization: item.org_name,
          address: item.org_address,
          message: item.message,
          status: item.status,
          fullData: item,
        }));

        setData(formatted);
      }
    } catch (err) {
      console.error("Speaker API Error:", err);
      alert("Failed to fetch speaker data");
    }
  };

  // ✅ FILTER
  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  // ✅ ✅ DELETE SPEAKER (API)
  const handleDelete = async (row) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmDelete) return;

    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;

      await axios.delete(`${BASE}/admin/speaker/${row.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ REMOVE FROM UI
      setData((prev) => prev.filter((item) => item.id !== row.id));

      alert("Speaker deleted successfully ✅");
    } catch (err) {
      console.error(
        "DELETE SPEAKER ERROR:",
        err?.response?.data || err.message
      );

      alert(err?.response?.data?.message || "Failed to delete speaker ❌");
    }
  };

  // ✅ EDIT STATUS
  const handleEdit = (row) => {
    setEditingRowId(row.id);
    setEditValue(row.status);
  };

  // ✅ ✅ UPDATE STATUS (API)
  const handleSave = async (row) => {
    try {
      const token = JSON.parse(localStorage.getItem("authUser"))?.token;

      const formData = new FormData();
      formData.append("id", row.id);
      formData.append("status", editValue);

      const res = await axios.post(`${BASE}/admin/updateSpeaker`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data?.message || "Status updated successfully ✅");

      // ✅ UPDATE UI
      setData((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: editValue } : item
        )
      );

      setEditingRowId(null);
    } catch (err) {
      console.error(
        "UPDATE SPEAKER STATUS ERROR:",
        err?.response?.data || err.message
      );

      alert(err?.response?.data?.message || "Failed to update status ❌");
    }
  };

  const handleCancel = () => setEditingRowId(null);

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h5 className="text-center fw-bold mb-4">INVITE FOR SPEAKER</h5>

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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Organization</th>
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

                  <td className="d-flex gap-2">
                    {editingRowId === item.id ? (
                      <>
                        <button
                          className="edit-icon-btn"
                          title="Save"
                          onClick={() => handleSave(item)}
                        >
                          <FiCheck size={18} />
                        </button>

                        <button
                          className="delete-icon-btn"
                          title="Cancel"
                          onClick={handleCancel}
                        >
                          <FiX size={18} />
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

              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* ✅ PAGINATION FOOTER */}
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
