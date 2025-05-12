import {
  FileIcon,
  FolderArchiveIcon,
  FolderIcon,
  PlusIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState, type ComponentPropsWithoutRef, type FormEvent } from "react";
import { callAPI } from "@/config/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

interface AddFileButtonProps extends ComponentPropsWithoutRef<"div"> {
  parentFolderId: string;
  onSubmitFinished?: () => void;
}

export default function AddFileButton(props: AddFileButtonProps) {
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);
  const [createFolderFormData, setCreateFolderFormData] = useState({
    name: "New folder",
    extension: "",
    type: "FOLDER",
  });
  const [createFileFormData, setCreateFileFormData] = useState({
    name: "",
    extension: "",
    type: "FILE",
  });

  async function handleCreateFolderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await callAPI({
      url: "http://127.0.0.1:5000/create",
      method: "POST",
      data: { ...createFolderFormData, parent_id: props.parentFolderId },
    });
    if (props.onSubmitFinished) props.onSubmitFinished();
  }
  async function handleCreateFileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await callAPI({
      url: "http://127.0.0.1:5000/create",
      method: "POST",
      data: { ...createFileFormData, parent_id: props.parentFolderId },
    });
    if (props.onSubmitFinished) props.onSubmitFinished();
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button>
          <PlusIcon />
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-0 gap-0 h-24 w-64 overflow-hidden">
        <Dialog
          onOpenChange={(open) => setIsCreateFolderDialogOpen(open)}
          open={isCreateFolderDialogOpen}
        >
          <DialogTrigger className="h-full">
            <Button
              className="w-full h-full rounded-none flex justify-start items-center cursor-pointer"
              variant="outline"
            >
              <FolderIcon />
              Folder
              <PlusIcon className="ml-auto" />
            </Button>
          </DialogTrigger>
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
                  <Button onClick={() => setIsCreateFolderDialogOpen(false)}>
                    Create
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog
          onOpenChange={(open) => setIsCreateFileDialogOpen(open)}
          open={isCreateFileDialogOpen}
        >
          <DialogTrigger className="h-full">
            <Button
              className="w-full h-full rounded-none flex justify-start items-center cursor-pointer"
              variant="outline"
            >
              <FileIcon />
              File
              <PlusIcon className="ml-auto" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3">Upload file</DialogTitle>

              <form
                onSubmit={handleCreateFileSubmit}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    defaultValue={createFileFormData.name}
                    onChange={(e) =>
                      setCreateFileFormData({
                        ...createFileFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setCreateFileFormData({
                      ...createFileFormData,
                      extension: e.target.value,
                    })
                  }
                />
                <Button onClick={() => setIsCreateFileDialogOpen(false)}>
                  Create
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
}
