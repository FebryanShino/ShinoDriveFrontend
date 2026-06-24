import AddFileButton from "@/components/AddFileButton";
import AppSidebar from "@/components/AppSidebar";
import Empty from "@/components/Empty";
import FileCard from "@/components/file-item-card/FileCard";
import FolderCard from "@/components/file-item-card/FolderCard";
import MoveFileItemPopover from "@/components/MoveFileItemPopover";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import type { FileItem, User } from "@/types";
import type { sortOptions } from "@/utils/file-item-utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownAZIcon,
  ArrowUpAZIcon,
  FolderIcon,
  FolderInputIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

export default function Homepage({ user }: { user: User }) {
  const [search, setSearch] = useState("");
  const [activeFileItem, setActiveFileItem] = useState<FileItem>();
  const [selectedFileItems, setSelectedFileItems] = useState<FileItem[]>([]);
  const [multipleSelectMode, setMultipleSelectMode] = useState(false);
  const [sortOption, setSortOption] = useState<sortOptions>({
    sortBy: "name",
    sortDirection: "ASC",
  });
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
      url: `${API_URL}/item/${id ?? "root"}?search=${search}&sortBy=${sortOption.sortBy}&sortDirection=${sortOption.sortDirection}`,
      method: "GET",
      authToken: getAccessToken() as string,
    });
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refetch();
  }

  useEffect(() => {
    refetch();
  }, [sortOption]);

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
              trigger={
                <Button>
                  <PlusIcon />
                  Add
                </Button>
              }
              itemsOnTheSameDir={data?.children as FileItem[]}
              parentFolderId={id as string}
              onSubmitFinished={() => {
                refetch();
                refetchParentFiles();
              }}
            />
          </div>

          <div className="flex w-full flex-col h-[7rem] gap-3">
            <div className="flex">
              <Select
                value={sortOption.sortBy}
                onValueChange={(
                  value: "name" | "created_at" | "updated_at",
                ) => {
                  setSortOption({ ...sortOption, sortBy: value });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created_at">Date created</SelectItem>
                  <SelectItem value="updated_at">Date modified</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="link"
                size="icon"
                className="cursor-pointer"
                onClick={() =>
                  setSortOption({
                    ...sortOption,
                    sortDirection:
                      sortOption.sortDirection === "ASC" ? "DESC" : "ASC",
                  })
                }
              >
                {sortOption.sortDirection === "ASC" ? (
                  <ArrowDownAZIcon />
                ) : (
                  <ArrowUpAZIcon />
                )}
              </Button>
            </div>
            <div
              className="w-full h-full bg-[rgba(73,141,185,0.2)] self-center rounded-full flex px-4 items-center justify-between"
              hidden={selectedFileItems.length < 2}
            >
              <div className="flex items-center h-full gap-3">
                <Button
                  className="rounded-full h-[70%]"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedFileItems([]);
                    setActiveFileItem(undefined);
                  }}
                >
                  <XIcon />
                </Button>
                <p>{selectedFileItems.length} files selected</p>
              </div>
              {data && (
                <MoveFileItemPopover
                  onItemUpdate={() => {
                    refetch();
                    refetchParentFiles();
                  }}
                  trigger={
                    <Button className="rounded-full h-[70%]" variant="outline">
                      Move
                      <FolderInputIcon />
                    </Button>
                  }
                  parentFolder={data}
                  selectedFileItems={selectedFileItems}
                  onSuccess={() => {
                    setSelectedFileItems([]);
                    setActiveFileItem(undefined);
                  }}
                />
              )}
            </div>
          </div>
          <div
            className="w-full h-full bg-secondary rounded-2xl p-3 flex flex-col gap-10 overflow-y-auto"
            onClick={() => {
              setActiveFileItem(undefined);
              setSelectedFileItems([]);
            }}
          >
            {data?.children && data.children.length > 0 ? (
              <>
                <ResponsiveGridWrapper minSize="15rem">
                  {data.children
                    .filter((item) => item.type === "folder")
                    .map((item) => (
                      <FolderCard
                        user={user}
                        onItemUpdate={() => {
                          refetch();
                          refetchParentFiles();
                        }}
                        fileItem={item}
                        multipleSelectMode={multipleSelectMode}
                        isActive={activeFileItem?.id === item.id}
                        isSelected={
                          !!selectedFileItems.find(
                            (file) => file.id === item.id,
                          )
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
                          user={user}
                          onItemUpdate={() => {
                            refetch();
                            refetchParentFiles();
                          }}
                          multipleSelectMode={multipleSelectMode}
                          fileItem={item}
                          isActive={activeFileItem?.id === item.id}
                          isSelected={
                            !!selectedFileItems.find(
                              (file) => file.id === item.id,
                            )
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
              </>
            ) : (
              data && (
                <Empty
                  hasUploadButton
                  parentFolderId={data.id}
                  onItemUpdate={() => {
                    refetch();
                    refetchParentFiles();
                  }}
                />
              )
            )}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
