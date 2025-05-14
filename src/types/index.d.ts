import type { UUID } from "crypto";

export interface FileItem {
  id: UUID;
  name: string;
  extension: string | null;
  parent_id: string;
  created_at: Date;
  type: "folder" | "file";
  children?: this[];
  parent?: this;
}

export interface User {
  id: UUID;
  username: string;
  email: string;
}
