const createCommentUrl = (articleId: string) =>
  `http://localhost:3001/api/comment/${articleId}`;

const createCommentsUrl = (articleId: string) =>
  `http://localhost:3001/api/comments/${articleId}`;

export const getComments = async (articleId: string) => {
  const response = await fetch(createCommentsUrl(articleId), {
    method: "GET",
    credentials: "include",
  });
  const obj = await response.json();
  return obj.data;
};

export const createComment = async (articleId: string, comment: string) => {
  const response = await fetch(createCommentUrl(articleId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content: comment }),
  });
  const obj = await response.json();
  return obj.data;
};

export const editComment = async (
  articleId: string,
  commentId: string,
  comment: string,
) => {
  const response = await fetch(createCommentUrl(articleId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ commentId, content: comment }),
  });
  const obj = await response.json();
  return obj.data;
};

export const deleteComment = async (articleId: string, commentId: string) => {
  const response = await fetch(createCommentUrl(articleId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ commentId }),
  });
  const obj = await response.json();
  return obj.commentId;
};

export type CommentType = {
  _id: string;
  articleId: string;
  userId: string;
  username: string;
  content: string;
  datePosted: string;
};
