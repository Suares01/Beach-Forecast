require("dotenv/config");

const { DB_NAME, API_KEY, DB_PORT, TOKEN_SECRET, CACHE_PASS } = process.env;

module.exports = {
  App: {
    port: 3000,
    database: {
      url: `mongodb://localhost:${DB_PORT}/${DB_NAME}`,
    },
    auth: {
      secret: `${TOKEN_SECRET}`,
    },
    cache: {
      url: "",
      pass: CACHE_PASS,
    },
    resources: {
      StormGlass: {
        endpoint: "https://api.stormglass.io/v2",
        apiKey: `${API_KEY}`,
        cacheTtl: 3600,
      },
    },
    logger: {
      enabled: true,
      level: "info",
    },
  },
};
