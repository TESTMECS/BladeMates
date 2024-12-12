import { comments } from '../config/mongoCollections';
import { StatusError } from '../utils/Error';

export async function getComments(articleId: string) {
  const commentsCollection = await comments();
  const commentsArray = await commentsCollection.find({ articleId }).toArray();

  if (commentsArray === null) {
    throw new StatusError(404, 'No comments found');
  }

  return commentsArray.map((comment) => {
    comment._id = comment._id.toString();
    comment.articleId = comment.articleId;
    comment.userId = comment.userId.toString();

    return comment;
  });
}
