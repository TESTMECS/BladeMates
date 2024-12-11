import { comments, users } from '../config/mongoCollections';
import { User } from '../types/mongo';
import { StatusError } from '../utils/Error';

import { ObjectId, PullOperator } from 'mongodb';

export async function addComment(
  articleId: string,
  userId: string,
  content: string
) {
  const commentsCollection = await comments();

  const usersCollection = await users();
  const existingUser = await usersCollection.findOne({
    _id: ObjectId.createFromHexString(userId),
  });

  if (existingUser === null) {
    throw new StatusError(500, 'User not found');
  }

  const newComment = {
    articleId,
    userId,

    username: existingUser.username,
    content,
    datePosted: new Date().toISOString(),
  };

  const insertedInfo = await commentsCollection.insertOne(newComment);

  const insertedDocument = await commentsCollection.findOne({
    _id: insertedInfo.insertedId,
  });

  if (insertedDocument === null) {
    throw new StatusError(500, 'Failed to insert comment');
  }

  // append comment to user doc's array of comment ids
  const updatedUser = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(userId) },
    { $push: { comments: insertedDocument._id } }
  );

  if (updatedUser.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to update user');
  }

  insertedDocument._id = insertedDocument._id.toString();
  insertedDocument.articleId = insertedDocument.articleId.toString();
  insertedDocument.userId = insertedDocument.userId.toString();

  return insertedDocument;
}

export async function editComment(
  commentId: string,
  userId: string,
  content: string
) {
  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({
    _id: ObjectId.createFromHexString(commentId),
  });

  if (comment === null) {
    throw new StatusError(404, 'Comment not found');
  }

  if (comment.userId.toString() !== userId) {
    throw new StatusError(403, 'Unauthorized');
  }

  const updatedComment = {
    ...comment,
    content,
  };

  const updatedInfo = await commentsCollection.updateOne(
    { _id: ObjectId.createFromHexString(commentId) },
    { $set: updatedComment }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to update comment');
  }

  updatedComment._id = updatedComment._id.toString();
  updatedComment.articleId = updatedComment.articleId.toString();
  updatedComment.userId = updatedComment.userId.toString();

  return updatedComment;
}

export async function deleteComment(commentId: string, userId: string) {
  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({
    _id: ObjectId.createFromHexString(commentId),
  });

  if (comment === null) {
    throw new StatusError(404, 'Comment not found');
  }

  if (comment.userId.toString() !== userId) {
    throw new StatusError(403, 'Unauthorized');
  }

  const deletedInfo = await commentsCollection.deleteOne({
    _id: ObjectId.createFromHexString(commentId),
  });

  if (deletedInfo.deletedCount === 0) {
    throw new StatusError(500, 'Failed to delete comment');
  }

  const usersCollection = await users();

  const updatedUser = await usersCollection.updateOne(
    { _id: ObjectId.createFromHexString(userId) },
    {
      $pull: {
        comments: ObjectId.createFromHexString(commentId),
      } as unknown as PullOperator<User>,
    }
  );

  if (updatedUser.modifiedCount === 0) {
    throw new StatusError(500, 'Failed to update user');
  }

  return commentId;
}
