import axios from "axios";

const client = axios.create({
  baseURL: "http://back_route/api",
  withCredentials: true,
});

export default client;
