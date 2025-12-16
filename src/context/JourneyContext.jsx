import React, { createContext, useState, useEffect } from "react";
import {
  getAllJourneys,
  updateJourneyById,
  deleteJourneyById,
  addJourneyAPI,
} from "../services/journeyService";

// eslint-disable-next-line react-refresh/only-export-components
export const JourneyContext = createContext();

export const JourneyProvider = ({ children }) => {
  const [journeys, setJourneys] = useState([]);

  const fetchJourneys = async () => {
    try {
      const data = await getAllJourneys();

      const processed = data.journeys.flatMap((j) =>
        Object.entries(j.languages).map(([lang, langData]) => ({
          id: langData.id,          
          order_id: j.order_id,
          language: lang,
          title: langData.title,
          date: langData.date?.slice(0, 10),
          description: langData.description,
          link: langData.link,
          images: langData.images,
        }))
      );

      setJourneys(processed);
    } catch (error) {
      console.error("Fetch journey failed", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJourneys();
  }, []);

  const addJourney = async (formData) => {
    try {
      await addJourneyAPI(formData);
      fetchJourneys();
    } catch (error) {
      console.error("Add Journey failed", error);
    }
  };

  const updateJourney = async (formData) => {
    try {
      const res = await updateJourneyById(formData);
      return res?.data?.message ? true : false;
    } catch (error) {
      console.log("BACKEND ERROR:", error.response?.data);
      return false;
    }
  };

  const deleteJourney = async (id) => {
    try {
      await deleteJourneyById(id);
      fetchJourneys();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <JourneyContext.Provider
      value={{
        journeys,
        addJourney,
        updateJourney,
        deleteJourney,
        refresh: fetchJourneys,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
