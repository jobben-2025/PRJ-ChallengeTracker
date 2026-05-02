import {
  type LoginModel,
  type RegisterModel,
  type AuthResponse,
} from "../types/Auth";

const API_BASE_URL = "http://localhost:5039/auth";

/**
 * Registriert einen neuen Benutzer
 */
export const registerAction = async (
  userData: RegisterModel,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    // Versuche den Fehler vom Server zu lesen (da steht oft, welches Feld fehlt)
    const errorData = await response.json().catch(() => ({}));
    console.error("Server Error Detail:", errorData);
    throw new Error(errorData.title || "Registrierung fehlgeschlagen");
  }

  return await handleResponse(response);
};

/**
 * Loggt einen Benutzer ein und speichert den Token
 */
export const loginAction = async (
  credentials: LoginModel,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

/**
 * Loggt den Benutzer lokal aus
 */
export const logoutAction = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/**
 * Hilfsfunktion zur einheitlichen Antwort-Verarbeitung
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Anfrage fehlgeschlagen (Status: ${response.status})`,
    );
  }
  return response.json();
}

/**
 * Bonus: Ein "authentifizierter Fetch", den du für Challenges nutzen kannst,
 * damit der Token immer im Header mitfliegt.
 */
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  return fetch(url, authOptions);
};
