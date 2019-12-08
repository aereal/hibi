const { readFileSync } = require("fs");
const { join } = require("path");

const readConfigFile = () => {
  try {
    const configPath = join(__dirname, "firebase-config.json");
    const config = readFileSync(configPath);
    return JSON.parse(config.toString("utf8"));
  } catch (_) {
    return undefined;
  }
};

module.exports = () => {
  let firebaseConfig = readConfigFile();
  if (firebaseConfig === undefined) {
    firebaseConfig = {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    };
  }
  if (
    firebaseConfig !== undefined &&
    firebaseConfig.FIREBASE_PROJECT_ID === undefined
  ) {
    firebaseConfig.FIREBASE_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
  }

  return {
    webpack(config) {
      config.resolve.extensions.push(".graphql", ".gql");
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader",
      });
      return config;
    },
    env: {
      ...firebaseConfig,
    },
    typescript: {
      ignoreDevErrors: true,
    },
  };
};
