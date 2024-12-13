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
          className="p-3 bg-transparent border border-gray/50 rounded-md text-black h-[50px] w-full resize-none outline outline-0 mr-2 md:mr-4 lg:mr-8"
        ></textarea>
        <button
          className="px-8 py-3 bg-darkblue text-white dark:bg-purple dark:text-white border dark:border-purple rounded-md"
          onClick={() => createCommentHelper(ref.current?.value || '')}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewComment;
