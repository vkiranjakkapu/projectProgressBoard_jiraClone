export const AppConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    IDENTITY_AUTH_URL: "/identity/api/v1/auth",
    IDENTITY_PROFILE_URL: "/identity/api/v1/users",

    PROJECTS_SERVICE_URL: "/projects/api/v1",

    LOCAL_AUTH_KEY: "progressboard",
    PUBLIC_ENDPOINTS: ["/auth", "/register"],
} as const;
