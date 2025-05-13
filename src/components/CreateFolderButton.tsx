import React, { useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { API_URL, callAPI } from "@/config/api";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CreateFolderButtonProps {
  triggerButton: ReactNode;
  parentFolderId: string;
  onSubmitFinished?: () => void;
}

export default function CreateFolderButton(props: CreateFolderButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [createFolderFormData, setCreateFolderFormData] = useState({
    name: "New folder",
    type: "FOLDER",
  });

  async function handleCreateFolderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await callAPI({
      url: `${API_URL}/create`,
      method: "POST",
      data: { ...createFolderFormData, parent_id: props.parentFolderId },
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
                defaultValue={createFolderFormData.name}
                onChange={(e) =>
                  setCreateFolderFormData({
                    ...createFolderFormData,
                    name: e.target.value,
                  })
                }
              />
              <Button onClick={() => setIsDialogOpen(false)}>Create</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
