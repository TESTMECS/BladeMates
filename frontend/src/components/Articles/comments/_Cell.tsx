import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  PencilIcon,
  TrashIcon,
  AdjustmentsIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../../../context/userContext";
import { deleteComment, editComment } from "./_var";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
interface CellProps {
  userId: string;
  username: string;
  timestamp: string;
  comment: string;
  commentId: string;
  articleId: string;
  editCommentFromState: (commentId: string, comment: string) => void;
  deleteCommentFromState: (commentId: string) => void;
}
const Cell: React.FC<CellProps> = ({
  userId,
  username,
  timestamp,
  comment,
  commentId,
  articleId,
  editCommentFromState,
  deleteCommentFromState,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const auth = useAuth();
  const currentUser = auth.user;
  const onEditItemClicked = () => {
    setIsOpen(true);
    setIsEditOpen(true);
  };
  const onDeleteItemClicked = () => {
    setIsOpen(true);
    setIsEditOpen(false);
  };
  const editCommentHelper = async (comment: string) => {
    // Update comment
    const check = comment.trim();
    if (check.length === 0) {
      window.alert("Comment cannot be empty");
      return;
    }
    await editComment(articleId, commentId, comment);
    setIsOpen(false);
    editCommentFromState(commentId, comment);
  };
  const deleteCommentHelper = async () => {
    // Delete comment
    await deleteComment(articleId, commentId);
    setIsOpen(false);
    deleteCommentFromState(commentId);
  };
  return (
    <div className="">
      <div className="flex items-center">
        <Link to={`/profile/${userId}`}>
          <strong className="font-medium mr-2 text-black/80 dark:text-white/80">
            {username}
          </strong>
        </Link>
        <p className="text-sm text-black/50 dark:text-white/50 mr-4">
          {new Date(timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {currentUser?.username === username && (
          <Menu>
            <MenuButton>
              <AdjustmentsIcon className="size-6" />
            </MenuButton>
            <MenuItems
              anchor="bottom start"
              className="bg-lightblue text-white dark:bg-black dark:text-white translate-x-[-10px] rounded-lg px-8 py-4 flex flex-col"
            >
              <MenuItem>
                <button
                  onClick={onEditItemClicked}
                  className="flex items-center mb-2 text-sm"
                >
                  <PencilIcon className="size-6" />
                  <span className="ml-2"> Edit</span>
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={onDeleteItemClicked}
                  className="flex items-center text-sm"
                >
                  <TrashIcon className="size-6" />
                  <span className="ml-2">Delete</span>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        )}
      </div>
      <div className="translate-x-2">
        <p className="">{comment}</p>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-10 focus:outline-none"
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/60 ">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl px-4 py-8 bg-white text-black dark:bg-black/90 dark:text-white border flex flex-col items-center"
            >
              <DialogTitle
                as="h3"
                className="text-xl font-bold text-black/60 dark:text-white/60"
              >
                {isEditOpen ? "Edit Comment" : "Delete Comment"}
              </DialogTitle>
              <div className="my-2">
                {isEditOpen ? (
                  <textarea
                    defaultValue={comment}
                    ref={commentRef}
                    className="p-3 bg-transparent border border-gray/50 dark:border-gray/20 rounded-md text-black dark:text-white dark:bg-white/5 min-h-[100px] h-full w-full resize-none outline outline-0 "
                  />
                ) : (
                  <p className="p-6 text-red/75 dark:text-red max-w-[250px] text-center">
                    Are you sure you want to delete this comment?
                  </p>
                )}
              </div>
              <div className="">
                <Button
                  className={
                    "text-black dark:text-white underline underline-offset-2 text-lg font-bold" +
                    (isEditOpen
                      ? ""
                      : " text-red dark:text-red dark:contrast-200")
                  }
                  onClick={() => {
                    if (isEditOpen) {
                      // Update comment
                      editCommentHelper(commentRef.current?.value || "");
                    } else {
                      // Delete comment
                      deleteCommentHelper();
                    }
                  }}
                >
                  {isEditOpen ? "Save" : "Delete"}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Cell;
