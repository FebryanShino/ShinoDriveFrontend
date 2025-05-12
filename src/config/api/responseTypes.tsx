export interface GameResponseType {
  uniqueId: string;
  name: string;
  author: string;
  gameEngine: string;
  description: string;
  gameLogoUrl: string;
  backgroundUrl: string;
  playUrl: string;
  downloadUrl: string;
  repositoryUrl: string;
  disclaimer: string | boolean;
}

export interface BlenderRenderResponseType {
  uniqueId: string;
  name: string;
  renderEngine: 'CYCLES' | 'EEVEE';
  compressedImageUrl: string;
  originalImageUrl: string;
  createdAt: string;
}

interface BlenderRenderDetailVariationType {
  compressedImageUrl: string;
  originalImageUrl: string;
}

export interface BlenderRenderDetailResponseType {
  uniqueId: string;
  variations: BlenderRenderDetailVariationType[];
  instagramUrl?: string;
  twitterUrl?: string;
}

export interface GithubProfileResposeType {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: unknown;
  blog: string;
  location: string;
  email: unknown;
  hireable: unknown;
  bio: string;
  twitter_username: unknown;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
