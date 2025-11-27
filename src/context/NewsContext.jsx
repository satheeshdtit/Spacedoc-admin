import { createContext, useContext, useEffect, useState } from "react";

const NewsContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
  // ---------------- NORMAL NEWS ----------------
  const [news, setNews] = useState(() => {
    return JSON.parse(localStorage.getItem("newsData")) || [];
  });

  useEffect(() => {
    localStorage.setItem("newsData", JSON.stringify(news));
  }, [news]);

  const addNews = (item) => {
    setNews((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const deleteNews = (id) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNews = (updatedItem) => {
    setNews((prev) =>
      prev.map((n) => (n.id === updatedItem.id ? updatedItem : n))
    );
  };

  // ---------------- NEWS VIDEOS ----------------
  const [newsVideos, setNewsVideos] = useState(() => {
    return JSON.parse(localStorage.getItem("newsVideosData")) || [];
  });

  useEffect(() => {
    localStorage.setItem("newsVideosData", JSON.stringify(newsVideos));
  }, [newsVideos]);

  const addNewsVideo = (video) => {
    setNewsVideos((prev) => [...prev, { ...video, id: Date.now() }]);
  };

  const deleteNewsVideo = (id) => {
    setNewsVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const updateNewsVideo = (updatedVideo) => {
    setNewsVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
    );
  };

  return (
    <NewsContext.Provider
      value={{
        // normal news
        news,
        addNews,
        deleteNews,
        updateNews,

        // news videos
        newsVideos,
        addNewsVideo,
        deleteNewsVideo,
        updateNewsVideo,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
