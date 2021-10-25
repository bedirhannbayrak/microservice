import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchRegister = async (input) => {
  const { data } = await axios.post(`${BASE_URL}/api/register`, input);
  return data;
};

export const fetchLogin = async (input) => {
  const { data } = await axios.post(`${BASE_URL}/api/login`, input);
  return data;
};

export const createPost = async (input) => {
  const { data } = await axios.post(`${BASE_URL}/api/posts`, input);
  return data;
};

export const getPosts = async (input) => {
  const { data } = await axios.get(`${BASE_URL}/api/posts/`);
  return data;
};
