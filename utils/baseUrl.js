const baseUrl =
    typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}`
        : process.env.NODE_ENV === "production"
            ? "https://nutrition-agent-alpha.vercel.app"
            : "http://localhost:3000";

export default baseUrl;