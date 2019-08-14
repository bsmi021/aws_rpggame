import axios from "axios";
import config from "../config";
export default axios.create({
  baseURL: config.apiGateway.ITEMS_API_URL
});
