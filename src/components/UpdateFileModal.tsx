import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { FileItem } from "@/types";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface UpdateFileModalHandle {
  openDialog: () => void;
}

interface UpdateFileModalProps {
  fileItem: FileItem;
  trigger?: ReactNode;
  onItemUpdate: () => void;
}

const UpdateFileModal = forwardRef<UpdateFileModalHandle, UpdateFileModalProps>(
  (props: UpdateFileModalProps, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState(props.fileItem.name);

    useImperativeHandle(ref, () => ({
      openDialog: () => setIsModalOpen(true),
    }));

    async function handleUpdateFileSubmit() {
      await callAPI({
        url: `${API_URL}/update/${props.fileItem.id}`,
        method: "PUT",
        data: { name: newName },
        authToken: getAccessToken() as string,
      });
      setNewName("");
      props.onItemUpdate();
      setIsModalOpen(false);
    }
    return (
      <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <DialogTrigger
          asChild
          onClick={() => {
            setIsModalOpen(!isModalOpen);
          }}
        >
          {props.trigger}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            Update{" "}
            <span className="text-red-200">
              {props.fileItem.name}
              {props.fileItem.extension}
            </span>{" "}
            {props.fileItem.type}
          </DialogTitle>
          <form>
            <div className="flex flex-col grow-0 gap-2 w-full">
              <Label>Replace name</Label>
              <Input
                onChange={(event) => setNewName(event.target.value)}
                value={newName}
              />
            </div>
            <Button
              className="mt-3"
              onClick={() => handleUpdateFileSubmit().then()}
            >
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);

export default UpdateFileModal;
