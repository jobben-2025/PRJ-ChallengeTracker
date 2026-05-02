export interface LoginModel {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  displayName: string; // Hinzufügen
  email: string; // Hinzufügen
  user?: any; // Kannst du lassen oder entfernen
}
