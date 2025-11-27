import { createContext, useContext, useEffect, useState } from "react";

const GalleryContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGallery = () => useContext(GalleryContext);

export const GalleryProvider = ({ children }) => {
  const [images, setImages] = useState(() => {
    return JSON.parse(localStorage.getItem("galleryImages")) || [];
  });

  const [videos, setVideos] = useState(() => {
    return JSON.parse(localStorage.getItem("galleryVideos")) || [];
  });

  // Sync images
  useEffect(() => {
    localStorage.setItem("galleryImages", JSON.stringify(images));
  }, [images]);

  // Sync videos
  useEffect(() => {
    localStorage.setItem("galleryVideos", JSON.stringify(videos));
  }, [videos]);

  // Add image
  const addImage = (newImage) => {
    setImages((prev) => [...prev, newImage]);
  };

  // Add video
  const addVideo = (newVideo) => {
    setVideos((prev) => [...prev, newVideo]);
  };

  // Delete Image
  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Delete Video
  const deleteVideo = (id) => {
    setVideos((prev) => prev.filter((vid) => vid.id !== id));
  };

  // UPDATE IMAGE
  const updateImage = (id, updatedFields) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, ...updatedFields } : img
      )
    );
  };

  //  THE MISSING FUNCTION — UPDATE VIDEO
  const updateVideo = (id, updatedFields) => {
    setVideos((prev) =>
      prev.map((vid) =>
        vid.id === id ? { ...vid, ...updatedFields } : vid
      )
    );
  };

  return (
    <GalleryContext.Provider
      value={{
        images,
        videos,
        addImage,
        addVideo,
        deleteImage,
        deleteVideo,
        updateImage,
        updateVideo, // ⭐ add to provider
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};
