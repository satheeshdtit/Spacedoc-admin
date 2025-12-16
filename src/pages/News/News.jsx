import React, { useState, useEffect } from "react";
import { Container, Card, Form, Table, Row, Col } from "react-bootstrap";
import axios from "axios";
import EditNewsModal from "./EditNewsModal";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TableSection = ({ title }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE_URL || "";

  const [goToPage, setGoToPage] = useState("");
  const [newsRows, setNewsRows] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const getImageUrl = (url) => {
    if (!url) {
      return "https://dummyimage.com/100x50/cccccc/000000&text=No+Image";
    }

    const safeUrl = encodeURI(url);

    if (!safeUrl.startsWith("http")) {
      return `${IMAGE_BASE.replace(/\/$/, "")}/${safeUrl.replace(/^\//, "")}`;
    }

    return safeUrl;
  };

  const isVideoItem = (item) => {
    // Check top-level keys that indicate video content
    if (!item) return false;
    if (item.youtube_link) return true;
    if (item.video_url) return true;
    if (item.type && typeof item.type === "string" && item.type.toLowerCase().includes("video")) return true;
    // some backends may use videos array
    if (Array.isArray(item.videos) && item.videos.length > 0) return true;
    return false;
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getAllNews`);
      const news = res.data.news || [];

      const flatData = [];

      news.forEach((item) => {
        // If top-level indicates a video resource, skip the whole item
        if (isVideoItem(item)) return;

        // If there's no image at top-level, skip (we only want image entries)
        if (!item.image_url) return;

        Object.entries(item.languages || {}).forEach(([lang, langData]) => {
          // Skip entries where the language key itself is a youtube/video key
          if (lang === "youtube_link" || lang === "video" || lang === "videos") return;

          // Skip if langData indicates video content
          if (!langData) return;
          if (langData.youtube_link) return;
          if (langData.video_url) return;
          if (langData.type && typeof langData.type === "string" && langData.type.toLowerCase().includes("video")) return;

          // Now this row looks like an image-language row — push it
          flatData.push({
            ...langData,
            lang_id: langData?.id ?? `${item.order_id || "o"}-${lang}`,
            language_code: lang,
            order_id: item.order_id,
            image_url: item.image_url,
          });
        });
      });

      setNewsRows(flatData);
    } catch (error) {
      console.error("GET NEWS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchNews();
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteNews = async (langId) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/admin/deleteNews/${langId}`);

      if (res.data.status === "success") {
        alert("Deleted successfully");
        const nextFiltered = newsRows.filter((r) => r.lang_id !== langId);
        const nextTotalPages = Math.max(1, Math.ceil(nextFiltered.length / rowsPerPage));
        if (currentPage > nextTotalPages) setCurrentPage(nextTotalPages);
        // refetch to be safe and consistent with backend
        fetchNews();
      } else {
        // backend didn't return success
        alert("Delete failed");
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Delete failed");
    }
  };

  const filteredData = newsRows.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
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
  // Show all pages if small count
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near the start
  if (currentPage <= 2) {
    return [1, 2, 3, "...", totalPages];
  }

  // Near the end
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // Middle pages
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};


  // Keep current page within bounds when rowsPerPage or filteredData changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, filteredData.length]);

  return (
    <Card className="shadow-sm p-4 mt-3">
      <h5 className="text-center fw-bold mb-2">{title}</h5>

      <Row className="mb-2">
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
          <th>Order</th>
          <th>Language</th>
          <th>Title</th>
          <th>Date</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {currentRows.map((row, idx) => (
          <tr key={row.lang_id || idx}>
            <td>{indexOfFirst + idx + 1}</td>
            <td>{row.order_id}</td>
            <td>{row.language_code}</td>
            <td>{row.title}</td>
            <td>{row.date ? (typeof row.date === "string" ? row.date.slice(0, 10) : new Date(row.date).toISOString().slice(0, 10)) : "—"}</td>

            <td>
              <img
                src={getImageUrl(row.image_url)}
                alt="news"
                style={{
                  width: 100,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            </td>

            <td className="d-flex gap-2">
              <button className="edit-icon-btn" onClick={() => { setEditItem(row); setShowEditModal(true);
                 window.dispatchEvent(new Event("modal-open"));
               }}>
                <FiEdit size={16} />
              </button>

              <button className="delete-icon-btn" onClick={() => deleteNews(row.lang_id)}>
                <FiTrash2 size={16} />
              </button>
            </td>
          </tr>
        ))}

        {currentRows.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center py-3">
              No Records Found.
            </td>
          </tr>
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

      <EditNewsModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={editItem}
        onUpdated={fetchNews}
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
