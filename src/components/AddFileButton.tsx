import type { FileItem } from "@/types";
import { FileIcon, FolderIcon, PlusIcon } from "lucide-react";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import CreateFolderButton from "./CreateFolderButton";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import UploadFileButton from "./UploadFileButton";

interface AddFileButtonProps extends ComponentPropsWithoutRef<"div"> {
  trigger: ReactNode;
  parentFolderId: string;
  onSubmitFinished: () => void;
  itemsOnTheSameDir: FileItem[];
}

export default function AddFileButton(props: AddFileButtonProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={(open) => setIsPopoverOpen(open)}
    >
      <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
      <PopoverContent className="flex flex-col p-0 gap-0 h-24 w-64 ">
        <CreateFolderButton
          itemsOnTheSameDir={props.itemsOnTheSameDir}
          parentFolderId={props.parentFolderId}
          onSubmitFinished={() => {
            setIsPopoverOpen(false);
            props.onSubmitFinished();
          }}
          triggerButton={
            <Button
              className="w-full h-[50%] rounded-none flex justify-start items-center cursor-pointer"
              variant="outline"
            >
              <FolderIcon />
              Folder
              <PlusIcon className="ml-auto" />
            </Button>
          }
        />
        <UploadFileButton
          itemsOnTheSameDir={props.itemsOnTheSameDir}
          onSubmitFinished={() => {
            setIsPopoverOpen(false);
            props.onSubmitFinished();
          }}
          triggerButton={
            <Button
              className="w-full h-[50%] rounded-none flex justify-start items-center cursor-pointer"
              variant="outline"
            >
              <FileIcon />
              File
              <PlusIcon className="ml-auto" />
            </Button>
          }
          parentFolderId={props.parentFolderId}
        />
      </PopoverContent>
    </Popover>
  );
}
