import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { FileItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Folder, FolderIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import ResponsiveGridWrapper from "./ResponsiveGridWrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface MoveFileItemPopoverProps {
  trigger: ReactNode;
  selectedFileItems: FileItem[];
  parentFolder: FileItem;
  onSuccess: () => void;
  onItemUpdate: () => void;
}

export default function MoveFileItemPopover(props: MoveFileItemPopoverProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderId, setFolderId] = useState(props.parentFolder.id);
  const [filteredFolderChildren, setFilteredFolderChildren] =
    useState<FileItem[]>();

  const { data: folder, refetch } = useQuery<FileItem>({
    queryKey: ["parent", folderId],
    queryFn: fetchItem,
  });
  function fetchItem() {
    return callAPI<FileItem>({
      url: `${API_URL}/item/${folderId}`,
      method: "GET",
      authToken: getAccessToken() as string,
    });
  }

  useEffect(() => {
    setFilteredFolderChildren(
      folder?.children?.filter(
        (item) =>
          !props.selectedFileItems
            .map((element) => element.id)
            .includes(item.id) && item.parent_id === folder.id,
      ),
    );
  }, [folder, isDialogOpen]);

  async function handleMoveFileSubmit() {
    await callAPI({
      url: `${API_URL}/move-items`,
      method: "PUT",
      data: {
        item_ids: props.selectedFileItems.map((item) => item.id),
        folder_id: folder?.id,
      },
      authToken: getAccessToken() as string,
    });
    props.onItemUpdate();
    setIsDialogOpen(false);
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        setFolderId(props.parentFolder.id);
        refetch();
      }}
      open={isDialogOpen}
    >
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="">
        <DialogTitle className="mb-4">
          Moving {props.selectedFileItems.length}{" "}
          {props.selectedFileItems.length > 1 ? "Files" : "File"}
        </DialogTitle>
        <Breadcrumb>
          <BreadcrumbList>
            {folder && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="flex items-center gap-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        if (folder.parent_id) {
                          setFolderId(folder.parent_id);
                        }
                      }}
                    >
                      <ArrowLeftIcon size={16} />
                      Back
                    </div>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <FolderIcon size={16} />
                {folder?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="bg-secondary flex flex-col h-[50dvh] overflow-y-auto rounded-2xl p-3">
          <ResponsiveGridWrapper minSize="10rem">
            {filteredFolderChildren &&
              filteredFolderChildren
                .filter((item) => item.type === "folder")
                .map((item) => (
                  <Card
                    onClick={() => setFolderId(item.id)}
                    className="w-full cursor-pointer aspect-[5] h-auto"
                  >
                    <CardTitle className="flex px-5 items-center gap-3">
                      <Folder />
                      <p className="w-full">{item.name}</p>
                    </CardTitle>
                  </Card>
                ))}
          </ResponsiveGridWrapper>
        </div>
        <DialogFooter>
          <Button
            disabled={folder?.id === props.parentFolder.id}
            onClick={() => handleMoveFileSubmit().then()}
          >
            Move to {folder?.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
