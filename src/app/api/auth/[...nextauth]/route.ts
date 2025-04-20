import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = 'edge';
export default NextAuth(authOptions);