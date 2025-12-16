import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;

const GET_ALL = import.meta.env.VITE_API_GET_ALL_JOURNEYS;
const ADD = import.meta.env.VITE_API_ADD_JOURNEY;
const UPDATE = import.meta.env.VITE_API_UPDATE_JOURNEY;
const DELETE = import.meta.env.VITE_API_DELETE_JOURNEY;

export const getAllJourneys = async () => {
  return axios.get(`${BASE}${GET_ALL}`).then((res) => res.data);
};

export const addJourneyAPI = async (formData) => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  return axios.post(`${BASE}${ADD}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateJourneyById = async (formData) => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  return axios.post(`${BASE}${UPDATE}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteJourneyById = async (id) => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  return axios.delete(`${BASE}${DELETE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
