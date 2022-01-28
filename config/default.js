require("dotenv/config");

const { DB_NAME, API_KEY, DB_PORT, TOKEN_SECRET } = process.env;

module.exports = {
  App: {
    port: 3000,
    database: {
      uri: `mongodb://localhost:${DB_PORT}/${DB_NAME}`,
    },
    auth: {
      secret: `${TOKEN_SECRET}`,
    },
    resources: {
      StormGlass: {
        endpoint: "https://api.stormglass.io/v2",
        apiKey: `${API_KEY}`,
      },
    },
  },
};
