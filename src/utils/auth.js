import axios from 'axios';

const TOKEN_KEY = 'tf_token';

export function setToken(token){
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(){
  return localStorage.getItem(TOKEN_KEY);
}

export function setRole(role){
  localStorage.setItem('tf_role', role);
}

export function getRole(){
  return localStorage.getItem('tf_role');
}

export function setUserName(name){
  localStorage.setItem('tf_name', name);
}

export function getUserName(){
  return localStorage.getItem('tf_name');
}

export function logout(){
  localStorage.removeItem('tf_token');
  localStorage.removeItem('tf_role');
  localStorage.removeItem('tf_name');
  window.location.href = '/';
}

export function authHeader(){
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// set axios default header when token exists
const token = getToken();
if(token){
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
