//  const ACCESS_TOKEN_KEY = 'accessToken';

let acto = '';

export const getAccessToken = () => {
  return acto;
  //  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (accessToken) => {
  acto = accessToken;
  //  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const removeAccessToken = () => {
  //  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
