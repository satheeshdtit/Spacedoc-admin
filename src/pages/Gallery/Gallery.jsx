import React, { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import GalleryTable from "../../pages/Gallery/GalleryTable"; 
import GalleryModal from "../../component/Modals/GalleryModal";
import { useGallery } from "../../context/GalleryContext";

const GalleryImages = () => {
  const { images, deleteImage, updateImage } = useGallery();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Group images by category & count dynamically
  const groupedImages = useMemo(() => {
    const result = {};
    images.forEach((img) => {
      // ensure category exists (fallback)
      const cat = img.category ?? "Uncategorized";
      if (!result[cat]) {
        result[cat] = { count: 0, order_id: img.order_id };
      }
      result[cat].count++;
    });

    return Object.entries(result).map(([category, values], index) => ({
      id: index + 1,
      category,
      total_images: values.count,
      order_id: values.order_id,
    }));
  }, [images]);

  // OPEN MODAL
  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // DELETE category row → delete all images in that category
  const handleDelete = (row) => {
    const confirmDelete = window.confirm(
      `Delete all images under category "${row.category}"?`
    );
    if (!confirmDelete) return;

    images
      .filter((img) => (img.category ?? "Uncategorized") === row.category)
      .forEach((img) => deleteImage(img.id));
  };

  // ON EDIT: update all images in category with new order_id
  const handleEdit = (row, newOrderId) => {
    images
      .filter((img) => (img.category ?? "Uncategorized") === row.category)
      .forEach((img) => updateImage(img.id, { order_id: newOrderId }));
  };

  return (
    <Container className="mt-5">
      <GalleryTable
        title="Gallery Images"
        data={groupedImages}
        columns={[
          { header: "Category", accessor: "category" },
          { header: "Total Images", accessor: "total_images" },
          { header: "Order Id", accessor: "order_id" },
        ]}
        onCategoryClick={handleOpenModal}
        onDelete={handleDelete}
        onEdit={handleEdit} // crucial — persist via context
      />

      <GalleryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        category={selectedCategory}
      />
    </Container>
  );
};

export default GalleryImages;





















