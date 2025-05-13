import type { ComponentPropsWithoutRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import type { FileItem } from "@/types";
import { Link } from "react-router-dom";
import { FileIcon, FolderIcon, HomeIcon } from "lucide-react";
import { API_URL } from "@/config/api";
import AddFileButton from "./AddFileButton";

function RenderSidebarSubItem({
  item,
  isActive,
}: {
  item: FileItem;
  isActive: boolean;
}) {
  return (
    <SidebarMenuSubItem key={item.id}>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link
          to={(item.type === "folder" ? "/" : `${API_URL}/file/`) + item.id}
        >
          {item.type === "folder" ? <FolderIcon /> : <FileIcon />}
          <span className="truncate w-full">
            {item.name}
            {item.extension}
          </span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function RenderSidebarItem({
  item,
  activeId,
}: {
  item: FileItem;
  activeId: string;
}) {
  return (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton asChild isActive={item.id === activeId}>
        <Link
          to={(item.type === "folder" ? "/" : `${API_URL}/file/`) + item.id}
        >
          {item.type === "folder" ? <FolderIcon /> : <FileIcon />}
          <span className="truncate w-full">
            {item.name}
            {item.extension}
          </span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuSub>
        {item.children
          ?.filter((child) => child.type === "folder")
          .map((child) => (
            <RenderSidebarSubItem
              item={child}
              key={child.id}
              isActive={child.id === activeId}
            />
          ))}
        {item.children
          ?.filter((child) => child.type === "file")
          .map((child) => (
            <RenderSidebarSubItem
              item={child}
              key={child.id}
              isActive={child.id === activeId}
            />
          ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

interface AppSidebarProps extends ComponentPropsWithoutRef<"div"> {
  items?: FileItem[];
  activeItemId: string;
}

export default function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Drive</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={"/"}>
                    <HomeIcon />
                    <span className="truncate w-full">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {props.items &&
                props.items
                  .filter((item) => item.type === "folder")
                  .map((item) => (
                    <RenderSidebarItem
                      item={item}
                      key={item.id}
                      activeId={props.activeItemId}
                    />
                  ))}
              {props.items &&
                props.items
                  .filter((item) => item.type === "file")
                  .map((item) => (
                    <RenderSidebarItem
                      item={item}
                      key={item.id}
                      activeId={props.activeItemId}
                    />
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
