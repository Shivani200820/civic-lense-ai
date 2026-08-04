const TOKEN_KEY = "civicai_token";
const LANGUAGE_KEY = "civicai_language";

export const storage = {
  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  saveLanguage: (language) => {
    localStorage.setItem(LANGUAGE_KEY, language);
  },

  getLanguage: () => {
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  },

  clear: () => {
    localStorage.clear();
  },
};