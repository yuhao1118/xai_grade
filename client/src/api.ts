import axios from 'axios';
import { API_URL } from './const';

const request = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Data statistics (non-ordered)
export const getDataDescription = async () => {
  const response = await request.get('/data');
  return response.data;
};

// Ordered features
export const getDataMeta = async () => {
  const response = await request.get('/data_meta');
  return response.data;
};

export const getPrediction = async (queryInstance: any) => {
  const response = await request.post('/predict', {
    queryInstance,
  });
  return response.data;
};

export const getSHAPExplanation = async (queryInstance: any) => {
  const response = await request.post('/shap_values', {
    queryInstance,
  });
  return response.data;
};

export const getCFExplanation = async (cfReq: any) => {
  const response = await request.post('/counterfactuals', cfReq);
  return response.data;
};
