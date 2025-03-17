import { PrismaClient } from '@prisma/client'

console.log(process.env)
export const db = new PrismaClient()
