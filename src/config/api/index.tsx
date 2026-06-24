interface CallAPIProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  authToken?: string;
}

export async function callAPI<T>({
  url,
  method,
  data,
  authToken,
}: CallAPIProps): Promise<T> {
  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (authToken) headers = { ...headers, Authorization: `Bearer ${authToken}` };

  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: headers,
  });

  if (!response.ok) {
    throw {
      status: response.status,
      body: response,
    };
  }

  try {
    const result: T = await response.json();
    return result;
  } catch (error) {
    throw {
      status: response.status,
      message: "Failed to parse JSON response",
      error,
    };
  }
}

export const API_URL = import.meta.env.VITE_API_URL;
