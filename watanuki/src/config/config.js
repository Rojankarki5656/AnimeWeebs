const config = {
  serverUrl: import.meta.env.VITE_APP_SERVERURL,
  localUrl: import.meta.env.VITE_APP_LOCALURL || "http://localhost:3030/api/v1",
  proxyUrl: import.meta.env.VITE_APP_PROXYURL,
};

export default config;
