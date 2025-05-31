import axios from 'axios';
import { ENV } from './config';

const apiServer = axios.create({
  baseURL: ENV.BACKEND_URL,
  withCredentials: true,
});

export default apiServer;