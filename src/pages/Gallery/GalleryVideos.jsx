import React, { useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import GalleryTable from "./Gallerytable";
import GalleryModal from "./GalleryModal";
import axios from "axios";

const GalleryVideos = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API = `${BASE_URL}/admin/getAllVideos`;

  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------------------
  // GET TOKEN HELPER
  // --------------------------------------------------------------
  const getToken = () => {
    try {
      const authUserStr = localStorage.getItem("authUser");
      if (!authUserStr) {
        console.error("No authUser found in localStorage");
        return null;
      }

      const authUser = JSON.parse(authUserStr);
      return authUser?.token || null;
    } catch (error) {
      console.error("Error parsing authUser:", error);
      return null;
    }
  };

  // --------------------------------------------------------------
  // FETCH VIDEOS
  // --------------------------------------------------------------
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      console.log("VIDEOS API RESPONSE:", res.data);
      setVideos(res.data.data || []);
    } catch (err) {
      console.error("Video API Error:", err);
      alert("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // --------------------------------------------------------------
  // GROUP VIDEOS BY CATEGORY
  // --------------------------------------------------------------
  const groupedVideos = useMemo(() => {
    const grouped = {};
    videos.forEach((v) => {
      const cat = v.category || "Uncategorized";
      if (!grouped[cat]) {
        grouped[cat] = {
          videos: [],
          order_id: v.order_id || 0,
          firstVideoId: v.id, // Store first video ID for reference
        };
      }
      grouped[cat].videos.push(v);
    });

    return Object.entries(grouped).map(([category, data], index) => ({
      id: index + 1,
      category,
      total_videos: data.videos.length,
      order_id: data.order_id,
      firstVideoId: data.firstVideoId, // For API reference
    }));
  }, [videos]);

  const handleDelete = async (row) => {
    const ok = window.confirm(
      `Delete all videos under category "${row.category}"?`
    );
    if (!ok) return;

    const token = getToken();
    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/admin/deleteVideoCategory`,
        { category: row.category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        alert("Video category deleted successfully!");
        fetchVideos(); // 🔥 AUTO REFRESH SAME AS IMAGES
      } else {
        alert(
          "Failed to delete video category: " +
            (res.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("DELETE VIDEO CATEGORY ERROR:", err);

      if (err.response) {
        alert(
          `Failed: ${
            err.response.data.message || `Error ${err.response.status}`
          }`
        );
      } else {
        alert("Failed to delete video category. Please try again.");
      }
    }
  };

  // --------------------------------------------------------------
  // UPDATE VIDEO ORDER API
  // --------------------------------------------------------------
  const handleEdit = async (row, newOrderId) => {
    const token = getToken();
    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      console.log("Updating video order:", row.category, "to:", newOrderId);

      // Use POST method with FormData as per your API
      const formData = new FormData();
      formData.append("category", row.category);
      formData.append("order_id", newOrderId);

      const res = await axios.put(`${BASE_URL}/admin/videoOrder`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update order response:", res.data);

      if (res.data.status === "success") {
        alert("Video order updated successfully!");
        // Refresh the videos list
        fetchVideos();
      } else {
        alert(`Failed to update order: ${res.data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("UPDATE ORDER ERROR:", err);

      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          alert("Session expired. Please login again.");
        } else if (status === 403) {
          alert("You don't have permission to update order.");
        } else {
          alert(
            `Update failed (${status}): ${data.message || "Unknown error"}`
          );
        }
      } else if (err.request) {
        alert("No response from server. Check your network connection.");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    window.dispatchEvent(new Event("modal-open")); // CLOSE SIDEBAR
  };

  return (
    <Container className="mt-5">
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading videos...</p>
        </div>
      )}

      <GalleryTable
        title="GALLERY VIDEOS"
        data={groupedVideos}
        columns={[
          { header: "Category", accessor: "category" },
          { header: "Total Videos", accessor: "total_videos" },
          { header: "Order Id", accessor: "order_id" },
        ]}
        onCategoryClick={handleOpenModal}
        onDelete={handleDelete}
        onEdit={handleEdit}
        disabled={loading}
      />

      <GalleryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        category={selectedCategory}
        videos={videos}
        onVideoDeleted={fetchVideos} // Pass refresh function as prop
      />
    </Container>
  );
};

export default GalleryVideos;
