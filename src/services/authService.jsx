import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;
const LOGIN = import.meta.env.VITE_API_LOGIN;

export const loginAPI = async (adminname, admin_password) => {
  try {
    const res = await axios.post(`${BASE}${LOGIN}`, {
      adminname,
      admin_password,
    });

    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Invalid login credentials"
    );
  }
};


// SIGNUP API
const SIGNUP = import.meta.env.VITE_API_SIGNUP;

export const signupAPI = async (adminname, email, crypt_id) => {
  try {
    const res = await axios.post(`${BASE}${SIGNUP}`, {
      adminname,
      email,
      crypt_id,
    });

    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Signup failed"
    );
  }
};
