// import { createContext, useContext, useState } from "react";

// const GalleryContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useGallery = () => useContext(GalleryContext);

// export const GalleryProvider = ({ children }) => {
//   const [images, setImages] = useState([]);
//   const [videos, setVideos] = useState([]);

//   const loadImages = (apiImages) => {
//     setImages(apiImages || []);
//   };

//   const loadVideos = (apiVideos) => {
//     setVideos(apiVideos || []);
//   };

//   const deleteImage = (id) => {
//     setImages((prev) => prev.filter((img) => img.id !== id));
//   };

//   const deleteVideo = (id) => {
//     setVideos((prev) => prev.filter((vid) => vid.id !== id));
//   };

//   const updateVideo = (id, updatedFields) => {
//     setVideos((prev) =>
//       prev.map((vid) =>
//         vid.id === id ? { ...vid, ...updatedFields } : vid
//       )
//     );
//   };

//   const updateImage = (id, updatedFields) => {
//     setImages((prev) =>
//       prev.map((img) =>
//         img.id === id ? { ...img, ...updatedFields } : img
//       )
//     );
//   };

//   return (
//     <GalleryContext.Provider
//       value={{
//         images,
//         videos,
//         loadImages,
//         loadVideos,
//         deleteImage,
//         deleteVideo,
//         updateImage,
//         updateVideo,
//       }}
//     >
//       {children}
//     </GalleryContext.Provider>
//   );
// };
