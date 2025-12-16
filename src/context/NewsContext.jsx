// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const NewsContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useNews = () => useContext(NewsContext);

// export const NewsProvider = ({ children }) => {
//   // const BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const BASE = import.meta.env.VITE_API_BASE_URL;
//   const API = `${BASE}${import.meta.env.VITE_API_NEWS}`;
//   const [news, setNews] = useState([]);

//   // Get all news
//   const getAllNews = async () => {
//     try {
//       const res = await axios.get(API);
//       setNews(res.data.news || []);
//     } catch (error) {
//       console.error("GET NEWS ERROR:", error);
//     }
//   };

//   // Add news
//   const addNews = async (formData) => {
//     try {
//       await axios.post(API,formData)
//       alert("News added successfully!");
//       getAllNews();
//     } catch (error) {
//       console.error("ADD NEWS ERROR:", error);
//       alert("Failed to add news");
//     }
//   };

//   // // Delete news (API to be added later)
//   // const deleteNews = async (id) => {
//   //   alert("Delete API integration will be added later.");
//   // };

//   // // Update news (API to be added later)
//   // const updateNews = async (item) => {
//   //   alert("Update API integration will be added later.");
//   // };

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     getAllNews();
//   }, []);


//   const [newsVideos, setNewsVideos] = useState(() => {
//     return JSON.parse(localStorage.getItem("newsVideosData")) || [];
//   });

//   useEffect(() => {
//     localStorage.setItem("newsVideosData", JSON.stringify(newsVideos));
//   }, [newsVideos]);

//   const addNewsVideo = (video) => {
//     setNewsVideos((prev) => [...prev, { ...video, id: Date.now() }]);
//   };

//   const deleteNewsVideo = (id) => {
//     setNewsVideos((prev) => prev.filter((v) => v.id !== id));
//   };

//   const updateNewsVideo = (updatedVideo) => {
//     setNewsVideos((prev) =>
//       prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
//     );
//   };

//   return (
//     <NewsContext.Provider
//       value={{
//         news,
//         addNews,
//         // deleteNews,
//         // updateNews,
//         getAllNews,

//         newsVideos,
//         addNewsVideo,
//         deleteNewsVideo,
//         updateNewsVideo,
//       }}
//     >
//       {children}
//     </NewsContext.Provider>
//   );
// };
