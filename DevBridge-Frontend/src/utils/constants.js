const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// "/api" works with local Vite proxy or reverse-proxy setups.
// Use full backend URL in production when frontend/backend are on different domains.
export const BASE_URL = apiBaseUrl || "/api";
