import { cn } from "@/lib/utils";
import type { FileItem } from "@/types";
import { LoaderCircle, NotebookPenIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";

interface DocumentSummaryViewerProps {
  item: FileItem;
  itemStatusIsSuccess: boolean;
}

export default function DocumentSummaryViewer(
  props: DocumentSummaryViewerProps,
) {
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  return (
    <div className="w-auto absolute z-50 right-10 bottom-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onMouseEnter={() => setOnMouseEnter(true)}
            onMouseLeave={() => setOnMouseEnter(false)}
            className={cn(
              onMouseEnter
                ? props.itemStatusIsSuccess
                  ? "w-40"
                  : "w-50"
                : "w-14",
              "h-14 overflow-hidden flex justify-start items-center",
              props.itemStatusIsSuccess ? "bg-primary" : "bg-amber-200",
            )}
            style={{
              transition: "width 0.3s ease",
            }}
          >
            {props.itemStatusIsSuccess ? (
              <NotebookPenIcon className="ml-1.5" />
            ) : (
              <LoaderCircle className="ml-2 animate-spin" />
            )}
            <span
              style={{
                opacity: onMouseEnter ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {props.itemStatusIsSuccess
                ? "View Summary"
                : "Generating Summary..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Summary</PopoverTitle>
            <PopoverDescription>
              {props.itemStatusIsSuccess
                ? props.item.summary
                : "Currently generating summary..."}
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  );
}
