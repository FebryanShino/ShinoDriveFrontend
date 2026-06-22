import type { FileItem } from "@/types";

export interface sortOptions {
  sortBy: "name" | "created_at" | "updated_at";
  sortDirection: "ASC" | "DESC";
}

export class FileItemUtils {
  static sortItems(files: FileItem[], options: sortOptions) {
    return files.slice().sort((a, b) => {
      if (options.sortBy === "name")
        return options.sortDirection === "ASC"
          ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          : b.name.toLowerCase().localeCompare(a.name.toLowerCase());

      return options.sortDirection === "ASC"
        ? new Date(a[options.sortBy]).getTime() -
            new Date(b[options.sortBy]).getTime()
        : new Date(b[options.sortBy]).getTime() -
            new Date(a[options.sortBy]).getTime();
    });
  }
}

export interface AspectRatio {
  width: number;
  height: number;
  ratio: string;
  decimal: number;
}

export function getAspectRatio(width: number, height: number): AspectRatio {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return {
    width,
    height,
    ratio: `${width / divisor}:${height / divisor}`,
    decimal: width / height,
  };
}
