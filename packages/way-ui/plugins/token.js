import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

const ExpiresInKey = 'Admin-Expires-In';

export default {
  get() {
    return Cookies.get(TokenKey);
  },
  set(token) {
    return Cookies.set(TokenKey, token);
  },
  remove() {
    return Cookies.remove(TokenKey);
  },
  getExpiresIn() {
    return Cookies.get(ExpiresInKey) || -1;
  },
  setExpiresIn(time) {
    return Cookies.set(ExpiresInKey, time);
  },
  removeExpiresIn() {
    return Cookies.remove(ExpiresInKey);
  },
};
