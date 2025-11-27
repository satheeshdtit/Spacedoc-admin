import React, { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const JourneyContext = createContext();

export const JourneyProvider = ({ children }) => {
  //  Load from localStorage initially
  const [journeys, setJourneys] = useState(() => {
    const stored = localStorage.getItem("journeyData");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever journeys update
  useEffect(() => {
    localStorage.setItem("journeyData", JSON.stringify(journeys));
  }, [journeys]);

  // ADD
  const addJourney = (data) => {
    setJourneys((prev) => [...prev, { id: Date.now(), ...data }]);
  };

  // EDIT
  const updateJourney = (id, updatedData) => {
    setJourneys((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  // DELETE
  const deleteJourney = (id) => {
    setJourneys((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <JourneyContext.Provider
      value={{
        journeys,
        addJourney,
        updateJourney,
        deleteJourney,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
