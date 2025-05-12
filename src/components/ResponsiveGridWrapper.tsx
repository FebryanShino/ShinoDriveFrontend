import { type ReactNode } from "react";

interface ResponsiveGridWrapperProps {
  children: ReactNode;
  wrapMode?: "auto-fit" | "auto-fill";
  minSize: string;
  gap?: number | string;
}
export default function ResponsiveGridWrapper({
  children,
  wrapMode = "auto-fill",
  minSize,
  gap = ".5rem",
}: ResponsiveGridWrapperProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${wrapMode}, minmax(${minSize}, 1fr))`,
        gridAutoFlow: "dense",
        gridGap: gap,
      }}
    >
      {children}
    </div>
  );
}
