import AddFileButton from "@/components/AddFileButton";
import AppSidebar from "@/components/AppSidebar";
import FileCard from "@/components/file-item-card/FileCard";
import FolderCard from "@/components/file-item-card/FolderCard";
import ResponsiveGridWrapper from "@/components/ResponsiveGridWrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { FileItem, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FolderIcon, HomeIcon, SearchIcon } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

export default function Homepage({ user }: { user: User }) {
  const [search, setSearch] = useState("");
  const [activeFileItem, setActiveFileItem] = useState<FileItem>();
  const [selectedFileItems, setSelectedFileItems] = useState<FileItem[]>([]);
  const [multipleSelectMode, setMultipleSelectMode] = useState(false);
  const { id } = useParams();
  const { data, refetch } = useQuery<FileItem>({
    queryKey: ["items", id],
    queryFn: fetchFolder,
  });

  const { data: parentFiles, refetch: refetchParentFiles } = useQuery<{
    items: FileItem[];
  }>({
    queryKey: ["parents", data?.parent_id],
    queryFn: fetchParentFolder,
  });

  function fetchParentFolder() {
    return callAPI<{ items: FileItem[] }>({
      url: `${API_URL}/parent/${data?.parent_id ?? "root"}`,
      method: "GET",
      authToken: getAccessToken() as string,
    });
  }

  function fetchFolder() {
    return callAPI<FileItem>({
      url: `${API_URL}/${id ?? "root"}?search=${search}`,
      method: "GET",
      authToken: getAccessToken() as string,
    });
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(data);
    refetch();
  }

  useEffect(() => {
    setActiveFileItem(undefined);
    setSelectedFileItems([]);
  }, [data]);

  useEffect(() => {
    function keyDownHandler(event: KeyboardEvent) {
      if (event.ctrlKey) setMultipleSelectMode(true);
    }
    function keyUpHandler(event: KeyboardEvent) {
      if (event.key === "Control") setMultipleSelectMode(false);
    }
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  return (
    <SidebarProvider className="w-full h-[100svh]">
      <AppSidebar
        user={user}
        items={parentFiles?.items}
        activeItemId={data?.id as string}
      />
      <main className="w-full h-[100dvh] p-3">
        <div className="py-4">
          <SidebarTrigger size="lg" />
        </div>
        <div className="w-full h-[90%] flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="flex items-center gap-2">
                  <Link to="/">
                    <HomeIcon size={16} />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {data?.parent && data?.parent.parent_id && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink>...</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="flex items-center gap-2">
                      <Link to={"/" + data.parent.id}>
                        <FolderIcon size={16} />
                        {data?.parent?.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-2">
                  <FolderIcon size={16} />
                  {data?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex w-full h-10 justify-between">
            <form onSubmit={handleSearchSubmit} className="flex w-full gap-2">
              <Input
                className="rounded-full w-[50%]"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button size="icon" className="rounded-full">
                <SearchIcon />
              </Button>
            </form>
            <AddFileButton
              filesOnTheSameDir={data?.children as FileItem[]}
              parentFolderId={id as string}
              onSubmitFinished={() => {
                refetch();
                refetchParentFiles();
              }}
            />
          </div>
          <div className="flex"></div>
          <div
            className="w-full h-full bg-secondary rounded-2xl p-3 flex flex-col gap-10 overflow-y-auto"
            onClick={() => {
              setActiveFileItem(undefined);
              setSelectedFileItems([]);
            }}
          >
            <ResponsiveGridWrapper minSize="15rem">
              {data?.children &&
                data.children
                  .filter((item) => item.type === "folder")
                  .map((item) => (
                    <FolderCard
                      fileItem={item}
                      multipleSelectMode={multipleSelectMode}
                      isActive={activeFileItem?.id === item.id}
                      isSelected={
                        !!selectedFileItems.find((file) => file.id === item.id)
                      }
                      onClick={(isSelected) => {
                        const newSelectedFileItems = [
                          ...selectedFileItems.filter(
                            (element) => element.id !== item.id,
                          ),
                        ];
                        if (!isSelected && multipleSelectMode) {
                          newSelectedFileItems.push(item);
                        }
                        setSelectedFileItems(newSelectedFileItems);

                        if (!multipleSelectMode) {
                          setSelectedFileItems([item]);
                        }
                        setActiveFileItem(item);
                      }}
                    />
                  ))}
            </ResponsiveGridWrapper>
            <ResponsiveGridWrapper minSize="15rem">
              {data?.children &&
                data.children
                  .filter((item) => item.type === "file")
                  .map((item) => (
                    <FileCard
                      multipleSelectMode={multipleSelectMode}
                      fileItem={item}
                      isActive={activeFileItem?.id === item.id}
                      isSelected={
                        !!selectedFileItems.find((file) => file.id === item.id)
                      }
                      onClick={(isSelected) => {
                        const newSelectedFileItems = [
                          ...selectedFileItems.filter(
                            (element) => element.id !== item.id,
                          ),
                        ];
                        if (!isSelected && multipleSelectMode) {
                          newSelectedFileItems.push(item);
                        }
                        setSelectedFileItems(newSelectedFileItems);

                        if (!multipleSelectMode) {
                          setSelectedFileItems([item]);
                        }
                        setActiveFileItem(item);
                      }}
                    />
                  ))}
            </ResponsiveGridWrapper>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
