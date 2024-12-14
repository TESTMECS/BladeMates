import { useRef } from 'react';
import { CommentType, createComment } from './_var';

interface NewCommentProps {
  articleId: string;
  addCommentToState: (comment: CommentType) => void;
}

const NewComment: React.FC<NewCommentProps> = ({
  articleId,
  addCommentToState,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const createCommentHelper = async (comment: string) => {
    // Add comment
    const check = comment.trim();

    if (check.length === 0) {
      window.alert('Comment cannot be empty');
      return;
    }

    const commentObj = await createComment(articleId, comment);
    addCommentToState(commentObj);
  };

  return (
    <div>
      <h3 hidden={true}>Add a comment</h3>
      <div className="flex justify-center items-center m-2">
        <textarea
          placeholder="Add a comment"
          ref={ref}
          className="h-[50px] w-full resize-none outline outline-0 flex-grow p-2 text-white border border-lightblue rounded-l-lg focus:outline-none focus:ring-2 focus:ring-lightblue bg-gray dark:bg-darkgray pr-6"
        ></textarea>
        <button
          className="p-2 text-2xl rounded-r-lg bg-lightpink hover:bg-lightblue dark:bg-purple dark:hover:bg-green w-60"
          onClick={() => createCommentHelper(ref.current?.value || '')}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewComment;
