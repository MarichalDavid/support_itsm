
import Keycloak from "keycloak-js";

// Initialize Keycloak instance
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "",
};

const keycloak = new Keycloak(keycloakConfig);

// Initialize Keycloak
export const initKeycloak = () => {
  return keycloak
    .init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      checkLoginIframe: false,
    })
    .catch((error) => {
      console.error("Keycloak init failed:", error);
    });
};

// Login function
export const login = () => {
  keycloak.login();
};

// Logout function
export const logout = () => {
  keycloak.logout();
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!keycloak.authenticated;
};

// Get username
export const getUsername = () => {
  return keycloak.tokenParsed?.preferred_username || "";
};

// Get token
export const getToken = () => {
  return keycloak.token;
};

// Refresh token
export const updateToken = (minValidity = 5) => {
  return new Promise<boolean>((resolve, reject) => {
    keycloak
      .updateToken(minValidity)
      .then((refreshed) => {
        resolve(refreshed);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default keycloak;
