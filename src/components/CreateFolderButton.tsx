import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import { cn } from "@/lib/utils";
import type { FileItem } from "@/types";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CreateFolderButtonProps {
  itemsOnTheSameDir: FileItem[];
  triggerButton: ReactNode;
  parentFolderId: string;
  onSubmitFinished?: () => void;
}

function checkIfDuplicate(input: string, items: FileItem[]): boolean {
  if (!items) return false;

  return (
    items.find((item) => item.name === input && item.type === "folder") !==
    undefined
  );
}

export default function CreateFolderButton(props: CreateFolderButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [createFolderFormData, setCreateFolderFormData] = useState({
    name: "New folder",
    type: "FOLDER",
  });

  async function handleCreateFolderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await callAPI({
      url: `${API_URL}/create`,
      method: "POST",
      data: { ...createFolderFormData, parent_id: props.parentFolderId },
      authToken: getAccessToken() as string,
    });
    if (props.onSubmitFinished) props.onSubmitFinished();
  }
  return (
    <Dialog onOpenChange={(open) => setIsDialogOpen(open)} open={isDialogOpen}>
      <DialogTrigger asChild>{props.triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">Create new folder</DialogTitle>

          <form
            onSubmit={handleCreateFolderSubmit}
            className="flex flex-col gap-2"
          >
            <Label>Folder name</Label>
            <div className="flex gap-2">
              <Input
                className={cn(
                  checkIfDuplicate(
                    createFolderFormData.name,
                    props.itemsOnTheSameDir,
                  )
                    ? "border-red-500"
                    : "",
                )}
                defaultValue={createFolderFormData.name}
                onChange={(e) =>
                  setCreateFolderFormData({
                    ...createFolderFormData,
                    name: e.target.value,
                  })
                }
              />
              <Button
                onClick={() => setIsDialogOpen(false)}
                disabled={checkIfDuplicate(
                  createFolderFormData.name,
                  props.itemsOnTheSameDir,
                )}
              >
                Create
              </Button>
            </div>
            <Label className="mt-2 text-xs h-4">
              {checkIfDuplicate(
                createFolderFormData.name,
                props.itemsOnTheSameDir,
              )
                ? "*Folder already exists"
                : ""}
            </Label>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
