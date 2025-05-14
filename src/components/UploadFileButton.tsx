import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { API_URL, callAPI } from "@/config/api";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "./ui/table";
import type { FileItem } from "@/types";
import { cn } from "@/lib/utils";
import { getAccessToken } from "@/config/api/accessToken";

interface UploadFileButtonProps {
  triggerButton: ReactNode;
  parentFolderId: string;
  filesOnTheSameDir: FileItem[];
  onSubmitFinished?: () => void;
}

export default function UploadFileButton(props: UploadFileButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState<File | null>(null);
  const [createFileFormData, setCreateFileFormData] = useState({
    name: "",
    extension: "",
    type: "FILE",
    base64: "",
    file_size: 0,
  });

  async function handleCreateFileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await callAPI({
      url: `${API_URL}/create`,
      method: "POST",
      data: { ...createFileFormData, parent_id: props.parentFolderId },
      authToken: getAccessToken() as string,
    });
    setCreateFileFormData({
      name: "",
      extension: "",
      type: "FILE",
      base64: "",
      file_size: 0,
    });
    setFileInfo(null);
    if (props.onSubmitFinished) props.onSubmitFinished();
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files as FileList)[0];
    if (file) {
      const nameOnly =
        file.name.substring(0, file.name.lastIndexOf(".")) ?? file.name;
      const extension = "." + file.name?.split(".").pop()?.toLowerCase();
      setFileInfo(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateFileFormData({
          ...createFileFormData,
          name: nameOnly,
          extension: extension as string,
          base64: reader.result as string,
          file_size: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Dialog onOpenChange={(open) => setIsDialogOpen(open)} open={isDialogOpen}>
      <DialogTrigger asChild>{props.triggerButton}</DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader className="w-full">
          <DialogTitle className="mb-3 w-full">Upload file</DialogTitle>

          <form
            onSubmit={handleCreateFileSubmit}
            className="flex flex-col gap-6 max-w-116"
          >
            <div className="flex flex-col gap-2">
              <Label>Select File</Label>
              <Input type="file" onChange={handleFileChange} />
            </div>
            {fileInfo && (
              <>
                <Card>
                  <CardContent>
                    <Table>
                      <TableCaption>File information</TableCaption>
                      <TableBody className="w-16">
                        <TableRow className="w-full">
                          <TableCell className="font-medium" width="10">
                            Original name
                          </TableCell>
                          <TableCell width="10">:</TableCell>
                          <TableCell className="truncate" width="0">
                            {fileInfo.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium" width="10">
                            File Extension
                          </TableCell>
                          <TableCell width="10">:</TableCell>
                          <TableCell>{createFileFormData.extension}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium" width="10">
                            File mimetype
                          </TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>{fileInfo.type}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium" width="10">
                            File size
                          </TableCell>
                          <TableCell>:</TableCell>
                          <TableCell>
                            {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="flex flex-col gap-2">
                  <Label>Change Name</Label>
                  <Input
                    className={cn(
                      props.filesOnTheSameDir?.find(
                        (item) => item.name === createFileFormData.name
                      )
                        ? "border-red-500"
                        : ""
                    )}
                    value={createFileFormData.name}
                    onChange={(e) =>
                      setCreateFileFormData({
                        ...createFileFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}

            <div>
              <Button
                size="lg"
                onClick={() => setIsDialogOpen(false)}
                disabled={
                  !!props.filesOnTheSameDir.find(
                    (item) => item.name === createFileFormData.name
                  )
                }
              >
                Create
              </Button>
              <Label className="mt-2 text-xs h-4">
                {props.filesOnTheSameDir.find(
                  (item) => item.name === createFileFormData.name
                )
                  ? "*File already exists"
                  : ""}
              </Label>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
