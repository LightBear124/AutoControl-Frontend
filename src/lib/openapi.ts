import axios from 'axios';
import { Configuration } from '../generated/api';
import { AuthApi } from '../generated/api/api/auth-api';
import { CrossingsApi } from '../generated/api/api/crossings-api';
import { CrossingPassengersApi } from '../generated/api/api/crossing-passengers-api';

export const apiAxios = axios.create({
  baseURL: '',
  withCredentials: true,
});

export const apiConfig = new Configuration({
  basePath: '',
  baseOptions: {
    withCredentials: true,
  },
});

export const authApi = new AuthApi(apiConfig, '', apiAxios);
export const crossingsApi = new CrossingsApi(apiConfig, '', apiAxios);
export const crossingPassengersApi = new CrossingPassengersApi(
  apiConfig,
  '',
  apiAxios,
);