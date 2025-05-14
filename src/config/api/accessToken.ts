export function setAccessToken(token: string) {
  document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
}
export function getAccessToken() {
  const match = document.cookie.match(new RegExp("(^| )access_token=([^;]+)"));
  return match ? match[2] : null;
}

export function deleteAccessToken() {
  document.cookie = `access_token=; path=/; max-age=0; secure; samesite=strict`;
}
