import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // change to your backend URL if deployed
});
