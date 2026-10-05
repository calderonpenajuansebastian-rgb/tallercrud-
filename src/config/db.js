requiere("dotenv").config();

const { prismapg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = prismapg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;