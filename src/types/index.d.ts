import type { UUID } from "crypto";

export interface FileItem {
  id: UUID;
  name: string;
  extension: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  type: "folder" | "file";
  children?: this[];
  parent?: this;
  item_metadata?: ItemMetadata;
}

export interface User {
  id: UUID;
  username: string;
  email: string;
}

export interface ItemMetadata {
  image_url: string | null;
  content: string;
}

export interface ActivityLog {
  type: "create" | "update" | "delete" | "move";
  key: string | null;
  past_items: FileItem[] | null;
  future_items: FileItem[] | null;
  description: string | null;
  author: User;
  created_at: string;
}
