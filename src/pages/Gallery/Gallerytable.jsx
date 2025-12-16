// src/pages/Gallery/GalleryTable.jsx
import React, { useState } from "react";
import { Table, Form, Row, Col, Card } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function GalleryTable({
  title,
  data,
  columns,
  onCategoryClick,
  onDelete,
  onEdit,
}) {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ► FILTER TABLE DATA
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ► PAGINATION LOGIC
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  const prevPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  // PAGE BUTTON DISPLAY LOGIC
  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, "...", totalPages];
    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  // ► SAVE ORDER ID CHANGE
  const handleSave = (row) => {
    if (!onEdit) return;
    onEdit(row, editValue);
    setEditingRowId(null);
  };

  return (
    <Card className="shadow-sm p-4 mt-4 table-card">
      <h5 className="text-center fw-bold mb-3">{title}</h5>

      {/* TOP CONTROLS */}
      <Row className="mb-3">
        <Col xs={6} md={3}>
          <Form.Select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={4}>Show 4</option>
            <option value={5}>Show 5</option>
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

              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <tr key={row.id}>
                  <td>{indexOfFirst + index + 1}</td>

                  {/* LOOP THROUGH COLUMNS */}
                  {columns.map((col, idx2) => {
                    // SELECT VALUE (supports total_images + total_videos)
                    const value =
                      row[col.accessor] ??
                      row.total_images ??
                      row.total_videos ??
                      "";

                    // If editing order_id
                    if (
                      col.accessor === "order_id" &&
                      editingRowId === row.id
                    ) {
                      return (
                        <td key={idx2}>
                          <input
                            className="form-control"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        </td>
                      );
                    }

                    // Category clickable
                    return (
                      <td
                        key={idx2}
                        onClick={
                          col.accessor === "category"
                            ? () => onCategoryClick(row[col.accessor])
                            
                            : undefined
                            
                        }
                        
                        style={
                          col.accessor === "category"
                            ? {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                                
                              }
                            : {}
                            
                        }
                        
                      >
                        {value}
                        
                      </td>
                    );
                  })}

                  {/* ACTION BUTTONS */}
                  <td className="d-flex gap-2">
                    {editingRowId === row.id ? (
                      <>
                        <button
                          className="edit-icon-btn"
                          onClick={() => handleSave(row)}
                        >
                          Save
                        </button>

                        <button
                          className="delete-icon-btn"
                          onClick={() => setEditingRowId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-icon-btn"
                          onClick={() => {
                            setEditingRowId(row.id);
                            setEditValue(row.order_id);
                            
                          }}
                        >
                          <FiEdit size={16} />
                        </button>

                        <button
                          className="delete-icon-btn"
                          onClick={() => onDelete(row)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="text-center py-3">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="custom-pagination-container mt-4 d-flex justify-content-between align-items-center flex-wrap">
        <div className="pagination-info">
          {filteredData.length === 0 ? (
            <>Showing 0 to 0 of 0 entries</>
          ) : (
            <>
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredData.length)} of{" "}
              {filteredData.length} entries
            </>
          )}
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
                    : undefined
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
  );
}
