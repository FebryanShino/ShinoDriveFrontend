import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_URL, callAPI } from "@/config/api";
import { getAccessToken } from "@/config/api/accessToken";
import { IMAGE_TYPES } from "@/constants";
import { cn } from "@/lib/utils";
import type { FileItem } from "@/types";
import { type AspectRatio, getAspectRatio } from "@/utils/file-item-utils";
import { useQuery } from "@tanstack/react-query";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import {
  ArrowLeftIcon,
  DownloadIcon,
  ImageIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useCallback, useState } from "react";
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

export default function FileItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>();

  const { data: file } = useQuery<FileItem>({
    queryKey: ["item", id],
    queryFn: fetchItem,
  });
  function fetchItem() {
    return callAPI<FileItem>({
      url: `${API_URL}/${id}`,
      method: "GET",
      authToken: getAccessToken() as string,
    });
  }

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

  return (
    file && (
      <div className="w-full h-svh flex flex-col">
        <div className="w-full h-20 p-2">
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
            <div className="flex items-center gap-3">
              <ImageIcon size={32} strokeWidth={1} />
              <h4>
                {file.name}
                {file.extension}
              </h4>
            </div>
          </div>
        </div>
        <div className="w-auto h-12 bg-secondary rounded-full self-start px-5 flex items-center ml-2 gap-4">
          <Button variant="link">
            <DownloadIcon />
            Download
          </Button>
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
            // style={{
            //   backgroundImage: `url("${API_URL}/file/${file.id}")`,
            // }}
          >
            <img
              src={`${API_URL}/file/${file.id}`}
              onLoad={handleImageLoad}
              className={` aspect-[${aspectRatio?.ratio}] object-cover shrink-0`}
              style={{
                height: `${zoom}%`,
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
        {/* <Card>
          <CardHeader>File details</CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{file.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Extension</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{file.extension}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{file.created_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Updated At</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{file.updated_at}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Author</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{file.user.username}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent> */}
        {/* </Card> */}
      </div>
    )
  );
}
