import { cn } from "@/lib/utils";
import type { FileItem } from "@/types";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManageFileItemPopover, {
  type ManageFileItemPopoverHandle,
} from "../ManageFileItemPopover";
import { Card, CardHeader, CardTitle } from "../ui/card";

interface FolderCardInterface {
  fileItem: FileItem;
  isActive?: boolean;
  isSelected?: boolean;
  multipleSelectMode: boolean;
  onClick: (isSelected: boolean) => void;
}

export default function FolderCard(props: FolderCardInterface) {
  const navigate = useNavigate();
  const manageFileItemPopoverRef = useRef<ManageFileItemPopoverHandle>(null);
  return (
    <Link to={"/" + props.fileItem.id} key={props.fileItem.id}>
      <Card
        onContextMenu={(e) => {
          e.preventDefault();
          manageFileItemPopoverRef.current?.open();
        }}
        className={cn(
          "w-full",
          props.isSelected
            ? props.isActive
              ? "bg-blue-400"
              : "bg-blue-800"
            : "",
        )}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          props.onClick(props.isSelected as boolean);
          if (props.isActive && props.isSelected && !props.multipleSelectMode)
            navigate("/" + props.fileItem.id);
        }}
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-center h-full w-full">
            <div className="h-full flex items-center w-full">
              <p className=" truncate w-44 h-5">{props.fileItem.name}</p>
            </div>
            <ManageFileItemPopover
              ref={manageFileItemPopoverRef}
              fileItem={props.fileItem}
            />
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
