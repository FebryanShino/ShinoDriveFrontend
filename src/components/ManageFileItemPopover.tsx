import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  EllipsisVerticalIcon,
  FolderInputIcon,
  PenIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";

import { Button } from "./ui/button";
import { Popover, PopoverContent } from "./ui/popover";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

import type { Contribution, FileItem, User } from "@/types";
import DeleteFileItemModal from "./DeleteFileItemModal";
import MoveFileItemPopover from "./MoveFileItemPopover";
import ShareFileItemDialog from "./ShareFileItemDialog";
import UpdateFileModal from "./UpdateFileModal";

export interface ManageFileItemPopoverHandle {
  open: () => void;
}

interface ManageFileItemPopoverProps {
  user: User;
  fileItem: FileItem;
  onItemUpdate: () => void;
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

  function checkUserRole(
    user: User,
    contributors: Contribution[],
    roles: string[],
  ): boolean {
    const userContribution = contributors.find(
      (contribution) => contribution.user.id === user.id,
    );
    if (!userContribution) return false;

    return roles.includes(userContribution.role);
  }

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
          {checkUserRole(props.user, props.fileItem.contributors, [
            "owner",
            "editor",
          ]) && (
            <UpdateFileModal
              trigger={
                <Button size="icon" className="cursor-pointer" variant="ghost">
                  <PenIcon />
                </Button>
              }
              fileItem={props.fileItem}
              onItemUpdate={() => {
                setIsPopoverOpen(false);
                props.onItemUpdate();
              }}
            />
          )}
          {checkUserRole(props.user, props.fileItem.contributors, [
            "owner",
          ]) && (
            <>
              <MoveFileItemPopover
                trigger={
                  <Button
                    size="icon"
                    className="cursor-pointer"
                    variant="ghost"
                  >
                    <FolderInputIcon />
                  </Button>
                }
                onSuccess={() => ""}
                onItemUpdate={() => {
                  setIsPopoverOpen(false);
                  props.onItemUpdate();
                }}
                parentFolder={props.fileItem.parent as FileItem}
                selectedFileItems={[props.fileItem]}
              />
              <DeleteFileItemModal
                trigger={
                  <Button
                    size="icon"
                    className="cursor-pointer"
                    variant="ghost"
                  >
                    <TrashIcon />
                  </Button>
                }
                selectedFileItems={[props.fileItem]}
                onItemUpdate={() => {
                  setIsPopoverOpen(false);
                  props.onItemUpdate();
                }}
              />
              {props.fileItem.type === "file" && (
                <ShareFileItemDialog
                  item={props.fileItem}
                  onDialogClose={() => setIsPopoverOpen(false)}
                  onItemUpdate={() => {
                    setIsPopoverOpen(false);
                    props.onItemUpdate();
                  }}
                  trigger={
                    <Button
                      size="icon"
                      className="cursor-pointer"
                      variant="ghost"
                    >
                      <Share2Icon />
                    </Button>
                  }
                />
              )}
            </>
          )}
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
