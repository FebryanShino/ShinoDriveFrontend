import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isError } = useQuery({
    queryKey: ["user"],
    queryFn: checkSession,
  });

  async function checkSession() {
    try {
      const response = await callAPI<{ user: User }>({
        url: `${API_URL}/auth/check-session`,
        method: "POST",
        authToken: getAccessToken() as string,
      });

      return response;
    } catch (error) {}
  }

  if (data) return (window.location.href = "/");

  if (isError) return children;
}
