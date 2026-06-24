import { BrushCleaningIcon, PlusIcon } from "lucide-react";
import AddFileButton from "./AddFileButton";
import { Button } from "./ui/button";

interface EmptyProps {
  onItemUpdate: () => void;
  parentFolderId: string;
  hasUploadButton?: boolean;
}

export default function Empty(props: EmptyProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <BrushCleaningIcon size={100} strokeWidth={0.7} />
      <h1 className="font-semibold text-xl mb-5">Folder is empty :(</h1>
      {props.hasUploadButton && (
        <AddFileButton
          trigger={
            <Button variant="outline">
              <PlusIcon />
              Add file or folder
            </Button>
          }
          itemsOnTheSameDir={[]}
          onSubmitFinished={() => props.onItemUpdate()}
          parentFolderId={props.parentFolderId}
        />
      )}
    </div>
  );
}
