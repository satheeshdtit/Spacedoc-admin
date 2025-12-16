import React, { useMemo, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import GalleryTable from "./Gallerytable";
import GalleryModal from "./GalleryModal";
import axios from "axios";

const GalleryImages = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

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

 const fetchGallery = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}${import.meta.env.VITE_API_GET_ALL_GALLERY}?limit=10000&page=1`
    );

    const apiImages = res.data?.data || [];

    const parsed = apiImages.map((item) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      date: item.date,
      order_id: item.order_id,
      image_url: item.image_url,
    }));

    setImages(parsed);
  } catch (err) {
    console.error("Gallery Load Error:", err);
    alert("Failed to load gallery images.");
  }
};


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGallery();
  }, []);

  const groupedImages = useMemo(() => {
    const groups = {};

    images.forEach((img) => {
      const cat = img.category || "Uncategorized";
      if (!groups[cat]) {
        groups[cat] = { count: 0, order_id: img.order_id };
      }
      groups[cat].count++;
    });

    return Object.entries(groups).map(([category, val], i) => ({
      id: i + 1,
      category,
      total_images: val.count,
      order_id: val.order_id,
    }));
  }, [images]);

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    window.dispatchEvent(new Event("modal-open"));
  };

  const handleDelete = async (row) => {
    const ok = window.confirm(
      `Delete all images under category "${row.category}"?`
    );
    if (!ok) return;

    const token = getToken();
    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/admin/deleteGalleryCategory`,
        { category: row.category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        alert("Category deleted successfully!");
        fetchGallery();
      } else {
        alert(
          "Failed to delete category: " + (res.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);

      if (err.response) {
        alert(
          `Failed: ${
            err.response.data.message || `Error ${err.response.status}`
          }`
        );
      } else {
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleEdit = async (row, newOrderId) => {
    const token = getToken();
    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/admin/imageOrder`,
        {
          category: row.category,
          order_id: newOrderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        alert("Order updated successfully!");
        fetchGallery();
      } else {
        alert("Order update failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("ORDER UPDATE ERROR:", err);

      if (err.response) {
        alert(
          `Failed: ${
            err.response.data.message || `Error ${err.response.status}`
          }`
        );
      } else {
        alert("Failed to update order.");
      }
    }
  };

  return (
    <Container className="my-5">
      <GalleryTable
        title="GALLERY IMAGES"
        data={groupedImages}
        columns={[
          { header: "Category", accessor: "category" },
          { header: "Total Images", accessor: "total_images" },
          { header: "Order Id", accessor: "order_id" },
        ]}
        onCategoryClick={handleOpenModal}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <GalleryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        category={selectedCategory}
        images={images}
        onDeleteSuccess={fetchGallery} 
      />
    </Container>
  );
};

export default GalleryImages;
