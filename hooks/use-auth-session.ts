import { useSession } from "next-auth/react";

export function useAuthSession() {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    error: session?.error,
  };
}

export default useAuthSession;
