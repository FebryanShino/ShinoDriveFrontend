import AddFileButton from "@/components/AddFileButton";
import ResponsiveGridWrapper from "@/components/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { callAPI } from "@/config/api";
import type { FileItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

export default function Homepage() {
  const [search, setSearch] = useState("");
  function hashToRGB(str: string) {
    const rgb = [];
    for (let i = 0; i < (str.length < 4 ? str.length : 3); i++) {
      const color = Math.round(((str.charCodeAt(i) - 97) / 25) * 135 + 120);
      rgb.push(color);
    }
    return rgb;
  }
  const { id } = useParams();
  const { data, refetch } = useQuery<FileItem>({
    queryKey: ["items", id],
    queryFn: fetchRootFolder,
  });

  function fetchRootFolder() {
    return callAPI<FileItem>({
      url: `http://127.0.0.1:5000/${id ?? "root"}?search=${search}`,
      method: "GET",
    });
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refetch();
  }

  return (
    <div className="w-full h-[90%] flex flex-col gap-4">
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
          parentFolderId={id as string}
          onSubmitFinished={() => refetch()}
        />
      </div>
      <div className="flex"></div>
      <div className="w-full h-full bg-gray-100 rounded-2xl p-3 flex flex-col gap-10 overflow-y-auto">
        <ResponsiveGridWrapper minSize="15rem">
          {data?.children &&
            data.children
              .filter((item) => item.type === "folder")
              .map((item) => (
                <Link to={`/${item.id}`}>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
        </ResponsiveGridWrapper>
        <ResponsiveGridWrapper minSize="15rem">
          {data?.children &&
            data.children
              .filter((item) => item.type === "file")
              .map((item) => (
                <Link to={`http://127.0.0.1:5000/file/${item.id}`}>
                  <Card className="w-full aspect-[4/3]">
                    <CardHeader>
                      <CardTitle className="truncate">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 h-full">
                      <div
                        className=" w-full h-full rounded flex justify-center items-center"
                        style={{
                          backgroundColor: `rgb(${hashToRGB(item.extension?.replace(".", "") as string).join(",")})`,
                        }}
                      >
                        <h1 className="text-5xl">{item.extension}</h1>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </ResponsiveGridWrapper>
      </div>
    </div>
  );
}
