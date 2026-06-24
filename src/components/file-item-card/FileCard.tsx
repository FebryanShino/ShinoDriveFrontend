import { API_URL } from "@/config/api";
import { IMAGE_TYPES } from "@/constants";
import { cn } from "@/lib/utils";
import type { FileItem, User } from "@/types";
import { hashToRGB } from "@/utils/misc";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ManageFileItemPopoverHandle } from "../ManageFileItemPopover";
import ManageFileItemPopover from "../ManageFileItemPopover";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FileCardInterface {
  user: User;
  fileItem: FileItem;
  isActive?: boolean;
  isSelected?: boolean;
  multipleSelectMode: boolean;
  onClick: (isSelected: boolean) => void;
  onItemUpdate: () => void;
}

export default function FileCard(props: FileCardInterface) {
  const navigate = useNavigate();

  const manageFileItemPopoverRef = useRef<ManageFileItemPopoverHandle>(null);
  return (
    <Card
      onContextMenu={(e) => {
        e.preventDefault();
        manageFileItemPopoverRef.current?.open();
      }}
      className={cn(
        "w-full aspect-[4/3] cursor-pointer",
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
        if (props.isActive && props.isSelected && !props.multipleSelectMode) {
          return navigate(`/${props.fileItem.id}/detail`);
        }
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center h-full w-full">
          <div className="h-full flex items-center w-full">
            <p className=" truncate w-44 h-5">
              {props.fileItem.name + props.fileItem.extension}
            </p>
          </div>
          <ManageFileItemPopover
            user={props.user}
            ref={manageFileItemPopoverRef}
            fileItem={props.fileItem}
            onItemUpdate={props.onItemUpdate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 h-full">
        <div
          className=" w-full h-full rounded flex justify-center items-center bg-full bg-cover bg-top"
          style={{
            backgroundColor: `rgb(${hashToRGB(props.fileItem.extension?.replace(".", "") as string).join(",")})`,
            backgroundImage: `url("${API_URL}/file/${props.fileItem.id}")`,
          }}
        >
          <h1 className="text-5xl">
            {!IMAGE_TYPES.includes(String(props.fileItem.extension)) &&
              props.fileItem.extension}
          </h1>
        </div>
      </CardContent>
    </Card>
  );
}
