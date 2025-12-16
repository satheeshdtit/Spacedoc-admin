import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Table, Row, Col, Form } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";

export default function Contacts() {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const API = `${BASE}${import.meta.env.VITE_API_CONTACT}`;

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API);

      if (res.data?.status === "success") {
        const formatted = res.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          date: item.date.substring(0, 10),
        }));

        setContacts(formatted);
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to load contacts");
    }
  };

  const filteredData = contacts.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const prevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

 const handleDelete = async (row) => {
  const ask = window.confirm("Are you sure you want to delete?");
  if (!ask) return;

  try {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;

    await axios.delete(
      `${BASE}/admin/contact/${row.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ REMOVE FROM UI AFTER SUCCESS
    setContacts((prev) => prev.filter((c) => c.id !== row.id));

    alert("Contact deleted successfully ✅");
  } catch (err) {
    console.error(
      "DELETE CONTACT ERROR:",
      err?.response?.data || err.message
    );

    alert(
      err?.response?.data?.message ||
        "Failed to delete contact ❌"
    );
  }
};


  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4">
        <h4 className="text-center fw-bold mb-4">CONTACTS</h4>

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
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, index) => (
                <tr key={row.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{row.message}</td>
                  <td>
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
            Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredData.length)} of{" "}
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

            {/* Go To Page */}
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
