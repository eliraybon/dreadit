import axios from 'axios';

//this will be updated later to take in a subDreddit id
export const fetchPosts = () => {
  return axios.get('/api/posts');
};

export const createPost = data => {
  return axios.post('/api/posts', data)
};

