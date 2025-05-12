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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { callAPI } from "@/config/api";
import type { FileItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

export default function Homepage() {
  const { id } = useParams();
  const { data, refetch } = useQuery<FileItem>({
    queryKey: ["items", id],
    queryFn: fetchRootFolder,
  });

  function fetchRootFolder() {
    return callAPI<FileItem>({
      url: `http://127.0.0.1:5000/${id ?? ""}`,
      method: "GET",
    });
  }

  return (
    <div className="w-full h-[90%] flex flex-col gap-4">
      <div className="flex w-full h-10 justify-between">
        <Input className="rounded-full w-[50%]" />
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
                <Link to={`/${item.id}`}>
                  <Card className="w-full aspect-[4/3]">
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.extension}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 h-full">
                      <div className="bg-black w-full h-full rounded"></div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </ResponsiveGridWrapper>
      </div>
    </div>
  );
}
