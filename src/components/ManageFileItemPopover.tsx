import { PopoverTrigger } from "@radix-ui/react-popover";
import { EllipsisVerticalIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { Button } from "./ui/button";
import { Popover, PopoverContent } from "./ui/popover";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

import type { FileItem } from "@/types";
import UpdateFileModal from "./UpdateFileModal";

export interface ManageFileItemPopoverHandle {
  open: () => void;
}

interface ManageFileItemPopoverProps {
  fileItem: FileItem;
}

const ManageFileItemPopover = forwardRef<
  ManageFileItemPopoverHandle,
  ManageFileItemPopoverProps
>((props, ref) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsPopoverOpen(true);
    },
  }));

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={(open) => setIsPopoverOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            setIsPopoverOpen(!isPopoverOpen);
          }}
        >
          <EllipsisVerticalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col gap-0 w-auto "
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div className="flex">
          <UpdateFileModal fileItem={props.fileItem} />
          {/* <DeleteFIleItemModal fileItem={props.fileItem} /> */}
          {/* <MoveFileItemPopover
            trigger={
              <Button size="icon" className="cursor-pointer" variant="ghost">
                <FolderInputIcon />
              </Button>
            }
            onSuccess={() => ""}
            parentFolder={props.fileItem.parent as FileItem}
            selectedFileItems={[props.fileItem]}
          /> */}
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>:</TableCell>
              <TableCell>{props.fileItem.name}</TableCell>
            </TableRow>
            {props.fileItem.type === "file" && (
              <TableRow>
                <TableCell>Extension</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{props.fileItem.extension}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>:</TableCell>
              <TableCell>{props.fileItem.user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>:</TableCell>
              <TableCell>{props.fileItem.created_at}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Updated At</TableCell>
              <TableCell>:</TableCell>
              <TableCell>{props.fileItem.updated_at}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
});

export default ManageFileItemPopover;
