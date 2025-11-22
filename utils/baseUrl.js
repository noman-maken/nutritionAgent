const baseUrl =
    typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}`
        : process.env.NODE_ENV === "production"
            ? ""
            : "http://localhost:3000";

export default baseUrl;