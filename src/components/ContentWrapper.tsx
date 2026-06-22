import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

interface ContentWrapperProps extends React.ComponentPropsWithRef<"div"> {
  maxWidth?: string | number;
  contentGap?: string | number;
}

export default function ContentWrapper(props: ContentWrapperProps) {
  const isMobile = useIsMobile();
  return (
    <div className="w-[100%] items-center flex flex-col" {...props}>
      <div
        className="h-[100%] py-32 flex flex-col"
        style={{
          gap: props.contentGap ? props.contentGap : 20,
          width: !isMobile
            ? props.maxWidth
              ? props.maxWidth
              : "1140px"
            : "100%",
          paddingInline: isMobile ? "20px" : "",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
