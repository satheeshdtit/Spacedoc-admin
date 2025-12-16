import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { FiEdit, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { JourneyContext } from "../../context/JourneyContext";
import EditJourneyModal from "./EditJourneyModal"; 

const Journey = () => {
  const { journeys, deleteJourney, refresh, updateJourney } = useContext(JourneyContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // const [loadingRefresh, setLoadingRefresh] = useState(false);

const openEditModal = (row) => {
  setSelectedRow({
    lang_id: row.id,  
    title: row.title,
    date: row.date,
    description: row.description,
    link: row.link,
    order_id: row.order_id,
    images: row.images
  });

  setShowModal(true);
   window.dispatchEvent(new Event("modal-open"));
};




  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleUpdate = async (idOrForm, maybeForm) => {
    let id = null;
    let formData = null;

    if (maybeForm) {
      id = idOrForm;
      formData = maybeForm;
    } else {
      formData = idOrForm;
      id = selectedRow?.id ?? null;
    }

    try {
      if (!(formData instanceof FormData)) {
        console.error("update: expected FormData");
        throw new Error("Invalid data format");
      }

      if (id) {
        formData.append("id", id);
      }

      const res = await updateJourney(formData); 
      const msg = res?.data?.message ?? "Journey updated successfully";
      alert(msg);
      await refresh();
      return res;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Update failed";
      alert(message);
      console.error("Update failed:", err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Missing id to delete");
      return;
    }
    const ok = window.confirm("Are you sure you want to delete this journey?");
    if (!ok) return;

    try {
      await deleteJourney(id);
      await refresh();
      alert("Deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err);
      alert("Delete failed. Check console.");
    }
  };

  // const handleRefresh = async () => {
  //   try {
  //     setLoadingRefresh(true);
  //     await refresh();
  //   } catch (err) {
  //     console.error("Refresh failed", err);
  //     alert("Refresh failed");
  //   } finally {
  //     setLoadingRefresh(false);
  //   }
  // };

  const filteredData = journeys.filter((item) => {
    const s = (search || "").toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(s) ||
      (item.date || "").includes(s) ||
      String(item.order_id || "").toLowerCase().includes(s) ||
      (item.language || "").toLowerCase().includes(s)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const indexOfFirstRow = indexOfFirst;
  const indexOfLastRow = Math.min(indexOfLast, filteredData.length);
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const getPageNumbers = () => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);

    if (currentPage <= 2) return [1, 2, "...", totalPages];

    if (currentPage >= totalPages - 1) return [1, "...", totalPages - 1, totalPages];

    return [1, "...", currentPage, "...", totalPages];
  };

  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, filteredData.length, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  return (
    <Container>
      <Card className="shadow-sm p-4 mt-5">
        <Row className="mb-3 align-items-center">
          <Col>
            <h4 className="fw-bold mb-0 text-center">JOURNEY</h4>
          </Col>

          <Col xs="auto">
            {/* <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              title="Refresh"
            >
              {loadingRefresh ? (
                <Spinner as="span" size="sm" animation="border" role="status" aria-hidden />
              ) : (
                <FiRefreshCw />
              )}
            </Button> */}
          </Col>
        </Row>

        <Row className="mb-3 align-items-center">
          <Col xs={12} md={4}>
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

          <Col xs={12} md={4} className="ms-auto">
            <Form.Control
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </Col>
        </Row>

        <div className="table-container">
          <Table className="simple-table"  bordered hover>
            <thead>
              <tr>
                <th style={{ width: 60 }}>S.No</th>
                <th>Title</th>
                <th style={{ width: 120 }}>Language</th>
                <th style={{ width: 140 }}>Date</th>
                <th style={{ width: 110 }}>Order Id</th>
                <th style={{ width: 110 }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    {journeys.length === 0 ? "Loading or no records available." : "No records match your search."}
                  </td>
                </tr>
              ) : (
                currentRows.map((row, idx) => (
                  <tr key={row.id ?? `${row.order_id}-${row.language}-${idx}`}>
                    <td>{indexOfFirst + idx + 1}</td>
                    <td>{row.title}</td>
                    <td>{row.language}</td>
                    <td>{row.date}</td>
                    <td>{row.order_id}</td>
                    <td className="d-flex gap-2">
                      <button
                        type="button"
                        className="edit-icon-btn"
                        onClick={() => openEditModal(row)}
                        title="Edit"
                      >
                        <FiEdit />
                      </button>

                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={() => handleDelete(row.id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div className="custom-pagination-container mt-4 d-flex justify-content-between align-items-center flex-wrap">

          <div className="pagination-info">
            {filteredData.length === 0 ? (
              <>Showing 0 to 0 of 0 entries</>
            ) : (
              <>
                Showing {indexOfFirstRow + 1} to{" "}
                {indexOfLastRow} of {filteredData.length} entries
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
                    p !== "..." && typeof p === "number" ? setCurrentPage(p) : null
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

      </Card>

      {showModal && selectedRow && (
        <EditJourneyModal
          show={showModal}
          data={selectedRow}
          handleClose={closeModal}
          onSave={handleUpdate}
        />
      )}
    </Container>
  );
};

export default Journey;
