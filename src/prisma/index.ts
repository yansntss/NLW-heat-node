import { PrismaClient } from "@prisma/client";


//conexao com o DB
const prismaClient = new PrismaClient();

export default prismaClient;