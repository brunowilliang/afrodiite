// import { getRequest } from '@tanstack/react-start/server';
import { authProcedure } from "@/api/http/middlewares";
import { auth } from "@/lib/auth/client";

export const authRoutes = {
  signOut: authProcedure.handler(async () => {
    // const { headers } = getRequest();
    await auth.signOut();
  }),
};
