import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { FileItem } from "@/types";
import { FileIcon, FolderIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface DeleteFileItemModalInterface {
  trigger: ReactNode;
  selectedFileItems: FileItem[];
  onItemUpdate: () => void;
}

export default function DeleteFileItemModal(
  props: DeleteFileItemModalInterface,
) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function handleDelete() {
    await callAPI({
      url: `${API_URL}/delete-items`,
      method: "DELETE",
      data: {
        item_ids: props.selectedFileItems.map((item) => item.id),
      },
      authToken: getAccessToken() as string,
    });
    props.onItemUpdate();
    // addLog({
    //   type: "delete",
    //   key: null,
    //   description: null,
    //   author: props.fileItem.user,
    //   past_items: [props.fileItem],
    //   future_items: null,
    //   created_at: new Date(Date.now()).toLocaleString(),
    // }),

    setIsModalOpen(false);
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disclaimer</DialogTitle>
        </DialogHeader>
        <p>Are you sure going to delete:</p>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.selectedFileItems.map((item, index) => (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex justify-center">
                  {item.type === "folder" ? (
                    <FolderIcon size={16} />
                  ) : (
                    <FileIcon size={16} />
                  )}
                </TableCell>
                <TableCell>
                  {item.name}
                  {item.extension}
                </TableCell>
                <TableCell>
                  {item.item_metadata
                    ? (item.item_metadata.size / 1024 / 1024).toFixed(2) + " MB"
                    : ""}
                </TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleString("en-UK")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter>
          <Button
            className="bg-red-800 text-white"
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
