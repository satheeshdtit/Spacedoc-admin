import React, { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import GalleryTable from "./GalleryTable";
import GalleryModal from "../../component/Modals/GalleryModal";
import { useGallery } from "../../context/GalleryContext";

const GalleryVideos = () => {
  const { videos, deleteVideo, updateVideo } = useGallery();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Group videos by category
  const mergedVideos = useMemo(() => {
    const grouped = {};
    videos.forEach((v) => {
      const cat = v.category || "Uncategorized";
      if (!grouped[cat]) {
        grouped[cat] = { count: 0, order_id: v.order_id };
      }
      grouped[cat].count++;
    });

    return Object.entries(grouped).map(([category, val], index) => ({
      id: index + 1,
      category,
      total_videos: val.count,
      order_id: val.order_id,
    }));
  }, [videos]);

  const handleEdit = (row, newOrderId) => {
    videos
      .filter((v) => v.category === row.category)
      .forEach((v) => updateVideo(v.id, { order_id: newOrderId }));
  };

  const handleDelete = (row) => {
    if (!window.confirm(`Delete all videos in "${row.category}"?`)) return;

    videos
      .filter((v) => v.category === row.category)
      .forEach((v) => deleteVideo(v.id));
  };

  return (
    <Container className="mt-5">
      <GalleryTable
        title="Gallery Videos"
        data={mergedVideos}
        columns={[
          { header: "Category", accessor: "category" },
          { header: "Total Videos", accessor: "total_videos" },
          { header: "Order Id", accessor: "order_id" },
        ]}
        onCategoryClick={(cat) => {
          setSelectedCategory(cat);
          setShowModal(true);
        }}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <GalleryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        category={selectedCategory}
      />
    </Container>
  );
};

export default GalleryVideos;
