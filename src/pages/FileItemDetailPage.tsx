import DocumentSummaryViewer from "@/components/DocumentSummaryViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateFileModal, {
  type UpdateFileModalHandle,
} from "@/components/UpdateFileModal";
import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import { IMAGE_TYPES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Contribution, FileItem, User } from "@/types";
import {
  type AspectRatio,
  getAspectRatio,
  isImageFile,
} from "@/utils/file-item-utils";
import { useQuery } from "@tanstack/react-query";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import {
  ArrowLeftIcon,
  DownloadIcon,
  ImageIcon,
  InfoIcon,
  MinusIcon,
  PenIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Link, useNavigate, useParams } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
  wasmUrl: "/wasm/",
};

const maxWidth = 10000;

export default function FileItemDetailPage({ user }: { user: User }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>();
  const [openPropertyTab, setOpenPropertyTab] = useState(false);

  const updateFileModalRef = useRef<UpdateFileModalHandle>(null);

  const {
    data: file,
    refetch,
    isError,
  } = useQuery<FileItem>({
    queryKey: ["item", id],
    queryFn: fetchItem,
  });

  function fetchItem() {
    return callAPI<FileItem>({
      url: `${API_URL}/item/${id}/detail`,
      method: "GET",
      authToken: getAccessToken() as string,
    });
  }

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError]);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, {}, onResize);
  const [zoom, setZoom] = useState(60);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    setAspectRatio(getAspectRatio(naturalWidth, naturalHeight));
  }

  function checkUserRole(
    user: User,
    contributors: Contribution[],
    roles: string[],
  ): boolean {
    if (!contributors) return false;
    if (contributors.length === 0) return false;

    const userContribution = contributors.find(
      (contribution) => contribution.user.id === user.id,
    );
    if (!userContribution) return false;

    return roles.includes(userContribution.role);
  }

  useEffect(() => {
    if (!file) return;

    const isPdfWithSummary = file.extension === ".pdf" && Boolean(file.summary);

    const isImageWithContent =
      isImageFile(file.extension ?? "") &&
      Boolean(file.item_metadata?.content?.trim());

    if (isPdfWithSummary) return;
    if (isImageWithContent) return;

    const poll = setInterval(async () => {
      const data = await fetch(`${API_URL}/check-item-status/${file.id}`).then(
        (r) => r.json(),
      );
      if (data.status === "success" || data.status === "failed") {
        refetch();
        clearInterval(poll);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [file]);

  return (
    file && (
      <div className="w-full h-svh flex relative px-2 pt-2 gap-2">
        <UpdateFileModal
          ref={updateFileModalRef}
          fileItem={file}
          onItemUpdate={() => refetch()}
        />
        <div className="min-w-0 flex-1 h-full flex flex-col">
          {file.extension === ".pdf" && (
            <DocumentSummaryViewer
              item={file}
              itemStatusIsSuccess={file.status === "success"}
            />
          )}
          <div className="w-full h-16">
            <div className="flex bg-secondary w-full h-full p-2 gap-5 rounded-xl">
              <Link
                to={file.parent?.name === "root" ? "/" : "/" + file.parent_id}
              >
                <Button
                  className="h-full w-auto aspect-square cursor-pointer flex items-center justify-center"
                  size="icon"
                  variant="outline"
                >
                  <ArrowLeftIcon size={32} />
                </Button>
              </Link>
              <ImageIcon size={32} strokeWidth={1} className="self-center" />
              <div className="flex flex-col h-full">
                <h4 className="ml-3">
                  {file.name}
                  {file.extension}
                </h4>
                <Menubar
                  className="bg-transparent border-none"
                  style={{ height: "1.7rem" }}
                >
                  <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem
                        disabled={
                          !checkUserRole(user, file.contributors, [
                            "owner",
                            "editor",
                          ])
                        }
                        onClick={() => updateFileModalRef.current?.openDialog()}
                      >
                        <PenIcon />
                        Rename
                      </MenubarItem>

                      <MenubarSeparator />
                      <MenubarItem onClick={() => setOpenPropertyTab(true)}>
                        <InfoIcon />
                        Properties
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger>More</MenubarTrigger>
                    <MenubarContent>
                      <MenubarGroup>
                        <MenubarItem>
                          {/* <SettingsIcon /> */}
                          Settings
                        </MenubarItem>
                        <MenubarItem>
                          {/* <HelpCircleIcon /> */}
                          Help
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem variant="destructive">
                          {/* <TrashIcon /> */}
                          Delete
                        </MenubarItem>
                      </MenubarGroup>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
          </div>
          <div className="w-auto h-12 bg-secondary rounded-full mt-2 self-start px-5 flex items-center ml-2 gap-4">
            <Link to={`${API_URL}/file/${file.id}`}>
              <Button variant="link">
                <DownloadIcon />
                Download
              </Button>
            </Link>
            <Separator orientation="vertical" />
            <div className="flex h-full self-start items-center">
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setZoom((value) => (value > 10 ? value - 10 : value))
                }
              >
                <MinusIcon />
              </Button>
              <div className="h-full w-16 flex items-center justify-center">
                {zoom}%
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setZoom((value) =>
                    value < (file?.extension === ".pdf" ? 100 : 300)
                      ? value + 10
                      : value,
                  )
                }
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          {IMAGE_TYPES.includes(String(file.extension)) ? (
            <div
              className={cn(
                "w-full min-h-0 flex-1 bg-cover bg-center flex justify-center overflow-x-scroll",
                zoom > 100 ? "overflow-y-scroll items-start" : "items-center",
              )}
            >
              <img
                src={`${API_URL}/file/${file.id}`}
                onLoad={handleImageLoad}
                className={` aspect-[${aspectRatio?.ratio}] object-cover shrink-0`}
                style={{
                  height: `${zoom}%`,
                  transition: "height 0.3s ease",
                }}
              />
            </div>
          ) : (
            <div className="w-full min-h-0 flex-1 bg-cover bg-center flex justify-center overflow-y-auto">
              <div ref={setContainerRef} style={{ width: `${zoom}%` }}>
                <Document
                  file={`${API_URL}/file/${file.id}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                >
                  <div className="flex flex-col gap-3">
                    {Array.from(new Array(numPages), (_el, index) => (
                      <Page
                        pageNumber={index + 1}
                        width={
                          containerWidth
                            ? Math.min(containerWidth, maxWidth)
                            : maxWidth
                        }
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    ))}
                  </div>
                </Document>
              </div>
            </div>
          )}
        </div>
        <div
          className={cn(
            openPropertyTab ? "w-70" : "w-0",
            "overflow-x-hidden",
            "flex flex-col gap-5 py-4",
          )}
          style={{ transition: "width 0.3s ease" }}
        >
          <div className="w-full h-auto flex justify-between items-center px-4">
            <h2 className="text-lg">Properties</h2>
            <button
              onClick={() => setOpenPropertyTab(false)}
              className="aspect-square self-end bg-transparent h-full text-white"
            >
              <XIcon size={28} strokeWidth={1} />
            </button>
          </div>
          {file.contributors && (
            <>
              <Separator />
              <Card className="bg-transparent border-none w-full">
                <CardHeader className="px-3 font-semibold text-lg">
                  Contributors
                </CardHeader>
                <CardContent className="px-3 flex gap-8 flex-col">
                  <div className="leading-5">
                    <h4 className="font-bold text-xs mb-2">OWNER</h4>
                    <div className="leading-4">
                      <p className="font-light">
                        {
                          file.contributors.find(
                            (item) => item.role === "owner",
                          )?.user.username
                        }
                      </p>
                      <span className="text-xs">
                        {
                          file.contributors.find(
                            (item) => item.role === "owner",
                          )?.user.email
                        }
                      </span>
                    </div>
                  </div>
                  {file.contributors.filter((item) => item.role !== "owner")
                    .length > 0 && (
                    <div>
                      <h4 className="font-bold text-xs">OTHERS</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {file.contributors
                            .filter((item) => item.role !== "owner")
                            .map((contributor) => (
                              <TableRow>
                                <TableCell>
                                  <h6>{contributor.user.username}</h6>
                                  <p className="text-xs text-gray-300">
                                    {contributor.user.email}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  {contributor.role.toUpperCase()}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          {file.item_metadata &&
            file.item_metadata.content != "" &&
            file.item_metadata.content != null &&
            isImageFile(file.extension as string) && (
              <>
                <Separator />
                <Card className="bg-transparent border-none">
                  <CardHeader className="px-3 font-semibold text-lg">
                    Image tags
                  </CardHeader>
                  <CardContent className="px-3 flex flex-wrap gap-2">
                    {file.item_metadata.content.split(", ").map((tag) => (
                      <Button variant="outline" size="sm">
                        {tag}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          <Separator />
          <Card className="bg-transparent border-none">
            <CardHeader className="px-3 font-semibold text-lg">
              File details
            </CardHeader>
            <CardContent className="px-3 gap-6 flex flex-col">
              <div className="leading-5">
                <h4 className="font-bold text-xs">Name</h4>
                <p className="font-light">{file.name}</p>
              </div>
              {file.item_metadata && (
                <div className="leading-5">
                  <h4 className="font-bold text-xs">Size</h4>
                  <p className="font-light">
                    {(file.item_metadata.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              <div className="leading-5">
                <h4 className="font-bold text-xs">Owner</h4>
                <p className="font-light">
                  {file.user.username}{" "}
                  {checkUserRole(user, file.contributors, ["owner", "editor"])
                    ? "(You)"
                    : ""}
                </p>
              </div>
              <div className="leading-5">
                <h4 className="font-bold text-xs">Modified</h4>
                <p className="font-light">
                  {new Date(file.updated_at).toLocaleString("en-UK")}
                </p>
              </div>
              <div className="leading-5">
                <h4 className="font-bold text-xs">Created</h4>
                <p className="font-light">
                  {new Date(file.created_at).toLocaleString("en-UK")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  );
}
