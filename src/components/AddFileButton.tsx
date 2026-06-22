import type { FileItem } from "@/types";
import { FileIcon, FolderIcon, PlusIcon } from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";
import CreateFolderButton from "./CreateFolderButton";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import UploadFileButton from "./UploadFileButton";

interface AddFileButtonProps extends ComponentPropsWithoutRef<"div"> {
  parentFolderId: string;
  onSubmitFinished?: () => void;
  filesOnTheSameDir: FileItem[];
}

export default function AddFileButton(props: AddFileButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <PlusIcon />
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-0 gap-0 h-24 w-64 ">
        <CreateFolderButton
          parentFolderId={props.parentFolderId}
          onSubmitFinished={() =>
            props.onSubmitFinished ? props.onSubmitFinished() : false
          }
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
          filesOnTheSameDir={props.filesOnTheSameDir}
          onSubmitFinished={() =>
            props.onSubmitFinished ? props.onSubmitFinished() : false
          }
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
