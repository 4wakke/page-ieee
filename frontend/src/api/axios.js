const backRoute = import.meta.env.REACT_APP_BACK_ROUTE;
import axios from "axios";

const client = axios.create({
  baseURL: `${backRoute}/api`,
  withCredentials: true,
});

export default client;