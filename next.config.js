/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodbDatabase: "Auth_Users",
    mongodbCollection: "auth_users",
    mongodbUsername: "Tester",
    mongodbPassword: "testerpassword",
    mongodbCluster: "cluster0",
  }
};

module.exports = nextConfig;
