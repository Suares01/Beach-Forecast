module.exports = {
  apps: [
    {
      name: "surfApi",
      script: "./dist/index.js",
      watch: "./dist",
      instance_var: "INSTANCE_ID",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      node_args: "-r dotenv/config",
      ignore_watch: ["node_modules"],
      args: "--no-daemon --watch",
      wait_ready: true,
      max_memory_restart: "400M",
    },
  ],
};
