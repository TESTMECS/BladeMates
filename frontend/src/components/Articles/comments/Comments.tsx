import React, { useEffect, useState } from 'react';
import { CommentType, getComments } from './_var';
import Cell from './_Cell';
import NewComment from './_NewComment';

interface CommentsProps {
  articleId: string;
}

const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);

  const editCommentFromState = (commentId: string, comment: string) => {
    const newComments = comments.map((c) => {
      if (c._id === commentId) {
        return { ...c, content: comment };
      }
      return c;
    });
    setComments(newComments);
  };

  const deleteCommentFromState = (commentId: string) => {
    const newComments = comments.filter((c) => c._id !== commentId);
    setComments(newComments);
  };

  const addCommentToState = (comment: CommentType) => {
    setComments([...comments, comment]);
  };

  useEffect(() => {
    (async () => {
      const comments = await getComments(articleId);
      setComments(comments);
    })();
  }, []);

  return (
    <div>
      <h3 className="text-2xl text-black/50 dark:text-white/50">Comments</h3>
      <NewComment articleId={articleId} addCommentToState={addCommentToState} />
      <ul className="mx-2">
        {comments
          .map((comment, i, arr) => {
            return (
              <li
                key={comment._id}
                className={
                  i == 0
                    ? 'mt-0 mb-4'
                    : i == arr.length - 1
                    ? 'mt-4 mb-0'
                    : 'my-4'
                }
              >
                <Cell
                  username={comment.username}
                  timestamp={comment.datePosted}
                  comment={comment.content}
                  commentId={comment._id}
                  articleId={articleId}
                  editCommentFromState={editCommentFromState}
                  deleteCommentFromState={deleteCommentFromState}
                />
              </li>
            );
          })
          .reverse()}
      </ul>
    </div>
  );
};

export default Comments;
