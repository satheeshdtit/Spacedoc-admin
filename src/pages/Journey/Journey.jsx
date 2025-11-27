import React, { useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form
} from "react-bootstrap";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { JourneyContext } from "../../context/JourneyContext";

const Journey = () => {
  const { journeys, updateJourney, deleteJourney } = useContext(JourneyContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // FILTER DATA
  const filteredData = journeys.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(s) ||
      item.date.includes(s) ||
      item.order_id.toLowerCase().includes(s) ||
      item.language.toLowerCase().includes(s)
    );
  });

  // PAGINATION SETUP
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);

    if (currentPage <= 2) return [1, 2, "...", totalPages];

    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];

    return [1, "...", currentPage, "...", totalPages];
  };

  // START EDIT
  const startEdit = (row) => {
    setEditingId(row.id);
    setEditForm(row);
  };

  // SAVE EDIT
  const saveEdit = () => {
    updateJourney(editingId, editForm);
    setEditingId(null);
  };

  return (
    <Container>
      

      <Card className="shadow-sm p-4 mt-5">
        <h5 className="text-center fw-bold mb-3">Journey</h5>
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
              <option value={1}>Show 1</option>
              <option value={10}>Show 10</option>
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
                <th>Title</th>
                <th>Date</th>
                <th>Order Id</th>
                <th>Language</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row, idx) => (
                <tr key={row.id}>
                  <td>{indexOfFirst + idx + 1}</td>

                  {/* TITLE */}
                  <td>
                    {editingId === row.id ? (
                      <Form.Control
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />
                    ) : (
                      row.title
                    )}
                  </td>

                  {/* DATE */}
                  <td>
                    {editingId === row.id ? (
                      <Form.Control
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                      />
                    ) : (
                      row.date
                    )}
                  </td>

                  {/* ORDER ID */}
                  <td>
                    {editingId === row.id ? (
                      <Form.Control
                        value={editForm.order_id}
                        onChange={(e) =>
                          setEditForm({ ...editForm, order_id: e.target.value })
                        }
                      />
                    ) : (
                      row.order_id
                    )}
                  </td>

                  {/* LANGUAGE */}
                  <td>
                    {editingId === row.id ? (
                      <Form.Control
                        value={editForm.language}
                        onChange={(e) =>
                          setEditForm({ ...editForm, language: e.target.value })
                        }
                      />
                    ) : (
                      row.language
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="d-flex gap-2">
                    {editingId === row.id ? (
                      <>
                        <button className="edit-icon-btn" onClick={saveEdit}>
                          <FiSave size={16} />
                        </button>
                        <button
                          className="delete-icon-btn"
                          onClick={() => setEditingId(null)}
                        >
                          <FiX size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-icon-btn"
                          onClick={() => startEdit(row)}
                        >
                          <FiEdit size={16} />
                        </button>

                        <button
                          className="delete-icon-btn"
                          onClick={() => deleteJourney(row.id)}
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
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="custom-pagination">
              <button
                className="page-btn"
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>

              {getPageNumbers().map((page, i) => (
                <button
                  key={i}
                  className={`page-number ${page === currentPage ? "active" : ""}`}
                  onClick={() => page !== "..." && setCurrentPage(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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
};

export default Journey;
