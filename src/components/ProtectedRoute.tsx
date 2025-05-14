import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  onCheckSuccess,
}: {
  children: React.ReactNode;
  onCheckSuccess: (user: User) => void;
}) {
  const navigate = useNavigate();
  const { data } = useQuery({
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
      onCheckSuccess(response.user);
      return response;
    } catch (error) {
      navigate("/login");
    }
  }

  return <>{data && children}</>;
}
