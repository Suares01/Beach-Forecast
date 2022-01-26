require("dotenv/config");

const { DB_USER, DB_PASS, DB_NAME, DB_PORT, API_KEY, TOKEN_SECRET } =
  process.env;

module.exports = {
  App: {
    port: 3000,
    database: {
      uri: `mongodb://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}?authSource=admin`,
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
