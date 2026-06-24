import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { FileItem } from "@/types";
import { useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ShareFileItemDialogProps {
  trigger: ReactNode;
  onItemUpdate: () => void;
  onDialogClose: () => void;
  item: FileItem;
}

const ROLE_TYPES = [
  { label: "editor", value: "editor" },
  { label: "viewer", value: "viewer" },
];
export default function ShareFileItemDialog(props: ShareFileItemDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_id: props.item.id,
    email: "",
    role: "",
  });
  async function handleShareFileSubmit() {
    try {
      await callAPI({
        url: `${API_URL}/share-item-access`,
        method: "POST",
        data: formData,
        authToken: getAccessToken() as string,
      });
      props.onItemUpdate();
    } catch (e: any) {
      alert(`Cannot find user with ${formData.email} email`);
    }
    setIsDialogOpen(false);
  }
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) props.onDialogClose();

        setIsDialogOpen(open);
      }}
      open={isDialogOpen}
    >
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Share "{props.item.name}
            {props.item.extension}"
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              className="min-w-0"
              onChange={(event) =>
                setFormData((data) => ({
                  ...data,
                  email: event.target.value.trim(),
                }))
              }
            />
            <Select
              onValueChange={(val) => {
                console.log(val);
                setFormData((data) => ({ ...data, role: val }));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ROLE_TYPES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>People who has access</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {props.item.contributors.map((contributor, index) => (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <h6>{contributor.user.username}</h6>
                        <p className="text-xs text-gray-300">
                          {contributor.user.email}
                        </p>
                      </TableCell>
                      <TableCell>{contributor.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Button
            className="self-start"
            disabled={formData.email == "" || formData.role == ""}
            onClick={() => handleShareFileSubmit()}
          >
            Share
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
