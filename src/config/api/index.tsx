interface CallAPIProps {
  url: string;
  method: "GET" | "POST";
  data?: any;
}

export async function callAPI<T>({
  url,
  method,
  data,
}: CallAPIProps): Promise<T> {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const API_URL = import.meta.env.VITE_API_URL;
