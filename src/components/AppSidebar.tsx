import { API_URL, callAPI } from "@/config/api";
import { deleteAccessToken, getAccessToken } from "@/config/api/accessToken";
import type { FileItem, User } from "@/types";
import { ChevronUp, FileIcon, FolderIcon, HomeIcon, User2 } from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
          to={item.type === "folder" ? `/${item.id}` : `/${item.id}/detail`}
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
          to={
            item.parent_id
              ? item.type === "folder"
                ? `/${item.id}`
                : `/${item.id}/detail`
              : "/"
          }
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
  user: User;
}

export default function AppSidebar(props: AppSidebarProps) {
  const navigate = useNavigate();
  async function handleLogout() {
    await callAPI({
      url: `${API_URL}/auth/logout`,
      method: "POST",
      authToken: getAccessToken() as string,
    });
    deleteAccessToken();
    navigate("/login");
  }
  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center">
        <div
          className="mx-auto w-[50%]  bg-cover bg-center aspect-video"
          style={{ backgroundImage: "url(/logo.png)" }}
        ></div>
      </SidebarHeader>
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
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={props.activeItemId === "shared-files"}
              >
                <Link to="/shared-files">
                  <FolderIcon />
                  <span className="truncate w-full">Shared to you</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {props.user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {props.user.username}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={handleLogout}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
