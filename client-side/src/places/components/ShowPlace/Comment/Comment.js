import React, { useState } from "react";
import Button from "../../../../share/UI/Button/Button";
const Comment = (props) => {
  const [comment, setComment] = useState({ author: "username", text: "" });

  const addCommentHandler = (e) => {
    e.preventDefault();
    if (comment.length > 0) {
      props.addComment(comment);
      setComment({ username: "", text: "" });
    }
  };

  const changeHandler = (e) => {
    setComment(e.target.value);
  };

  return (
    <form onSubmit={addCommentHandler} className={props.formCls}>
      <input
        placeholder="Add Comment"
        rows="1"
        onChange={changeHandler}
        className={props.textareaCls}
        type="text"
        value={comment.text}
      />
      <Button className={props.btnCls}>
        {props.addCommentLoading ? "Loading..." : "Add"}
      </Button>
    </form>
  );
};

export default Comment;
