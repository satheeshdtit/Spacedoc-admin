import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Table,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNews } from "../../context/NewsContext";
import EditNewsModal from "../../component/Modals/EditNewsModal";

const TableSection = ({ title }) => {
  const { news, deleteNews } = useNews();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");

  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // 🔍 FILTER
  const filteredData = news.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // 📄 PAGINATION CALC
  const totalPages =
    Math.ceil(filteredData.length / rowsPerPage) || 1; // avoid 0
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);

    if (currentPage <= 2) return [1, 2, "...", totalPages];

    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];

    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <Card className="shadow-sm p-4 mt-5">
      <h5 className="text-center fw-bold mb-3">{title}</h5>

      {/* 🔼 Top Controls (Rows per page + Search) */}
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

      {/* 📊 Table */}
      <div className="table-container">
        <Table className="simple-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Order Id</th>
              <th>Title</th>
              <th>Date</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, idx) => (
              <tr key={row.id}>
                <td>{indexOfFirst + idx + 1}</td>
                <td>{row.order_id}</td>
                <td>{row.title}</td>
                <td>{row.date}</td>
                <td>
                  <img
                    src={row.image || "https://via.placeholder.com/40"}
                    alt="news"
                    width="100"
                    height="50"
                    style={{ borderRadius: "6px", objectFit: "cover" }}
                  />
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
                    onClick={() => deleteNews(row.id)}
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

      {/* 📌 Pagination */}
      <div className="custom-pagination-container mt-4">
        <div className="pagination-info">
          Showing{" "}
          {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          {/* Page Buttons */}
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

          {/* Go to page */}
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

      {/* ✏ Edit Modal */}
      <EditNewsModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={editItem}
      />
    </Card>
  );
};

export default function NewsPage() {
  return (
    <Container className="my-5">
      <TableSection title="NEWS" />
    </Container>
  );
}

