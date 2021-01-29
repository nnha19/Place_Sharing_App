import React from "react";

import "./EditComment.css";
const EditComment = (props) => {
  let editCommentCls = props.showEditComment
    ? "edit-comment show-edit-comment"
    : "edit-comment";
  return (
    <div className={editCommentCls}>
      <span
        onClick={(id) => props.showEditForm(id)}
        className="edit-comment__item"
      >
        Edit
      </span>
      <span
        onClick={(id) => props.deleteComment(id)}
        className="edit-comment__item"
      >
        Delete
      </span>
    </div>
  );
};

export default EditComment;
