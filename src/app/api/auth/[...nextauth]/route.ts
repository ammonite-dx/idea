export const runtime = "edge";

import NextAuth from "next-auth";
import { authOptions } from "@/auth"

export default NextAuth(authOptions);