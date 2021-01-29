import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./ShowPlace.css";
import Button from "../../../share/UI/Button/Button";
import Comment from "./Comment/Comment";
import AuthContext from "../../../context/authContext";
import axios from "axios";
import LoadingSpinner from "../../../share/UI/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";
import Model from "../../../share/UI/Model/Model";
import BackDrop from "../../../share/UI/BackDrop/BackDrop";
import EditComment from "./EditComment/EditComment";
import Ratings from "./Rating/Rating";
import moment from "moment";

const ShowPlace = (props) => {
  const authContext = useContext(AuthContext);
  const placeId = useParams().id;
  const history = useHistory();

  const [showPlace, setShowPlace] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [likeIsLoading, setLikeIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resp = await axios.get(`http://localhost:5000/place/${placeId}`);
        const place = resp.data;

        setIsLoading(false);
        setShowPlace(place);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    })();
  }, []);

  const addCommentHandler = async (text) => {
    const placeComments = [
      ...showPlace.comments,
      {
        username: authContext.userData.username,
        author: authContext.userData.userId,
        text,
      },
    ];
    const placeWithComments = { ...showPlace };
    placeWithComments.comments = placeComments;
    const comment = {
      author: authContext.userData.userId,
      username: authContext.userData.username,
      text: text,
      editingComment: false,
    };
    const resp = await axios.post(
      `http://localhost:5000/place/${placeId}/comments`,
      comment,
      {
        headers: {
          Authorization: authContext.token,
        },
      }
    );
    if (authContext.userData.userId !== showPlace.creator.author) {
      const userNotiResp = await axios.post(
        `http://localhost:5000/user/${showPlace.creator.author}/notifications`,
        {
          username: authContext.userData.username,
          action: " commented on your place",
          date: authContext.date,
        },
        {
          headers: {
            Authorization: authContext.token,
          },
        }
      );
      authContext.updateUser(userNotiResp.data, showPlace.creator.author);
    }

    setShowPlace(resp.data);
  };

  const likedHandler = async () => {
    const userId = authContext.userData.userId;
    for (let like of showPlace.likes) {
      if (like.author === userId) {
        setLikeIsLoading(true);
        const resp = await axios.delete(
          `http://localhost:5000/place/${placeId}/likes/${userId}`,
          {
            headers: {
              Authorization: authContext.token,
            },
          }
        );
        const placeWithLikes = {
          ...showPlace,
          likes: resp.data.likes,
        };
        setShowPlace(placeWithLikes);
        setLikeIsLoading(false);
        return null;
      }
    }
    setLikeIsLoading(true);
    const resp = await axios.post(
      `http://localhost:5000/place/${placeId}/likes`,
      {
        username: authContext.userData.username,
        author: userId,
        placeOwnerId: showPlace.creator.author,
      },
      {
        headers: {
          Authorization: authContext.token,
        },
      }
    );
    if (authContext.userData.userId !== showPlace.creator.author) {
      const userNotiResp = await axios.post(
        `http://localhost:5000/user/${showPlace.creator.author}/notifications`,
        {
          username: authContext.userData.username,
          action: " likes the place",
          date: authContext.date,
        },
        {
          headers: {
            Authorization: authContext.token,
          },
        }
      );
      authContext.updateUser(userNotiResp.data, showPlace.creator.author);
    }
    const placeWithLikes = {
      ...showPlace,
      likes: resp.data.placeWithLikes.likes,
    };
    setShowPlace(placeWithLikes);
    setLikeIsLoading(false);
  };

  let likeBtnCls = `like__btn`,
    likeText = "like";
  let comments;

  if (showPlace && showPlace.likes && showPlace.likes.length > 0) {
    showPlace.likes.forEach((like) => {
      if (like.author === authContext.userData.userId) {
        likeBtnCls = `like__btn liked`;
        likeText = "unlike";
      }
    });
  }

  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      const deletePlace = await axios.delete(
        `http://localhost:5000/place/${placeId}`,
        {
          headers: {
            Authorization: authContext.token,
          },
          data: "Hello",
        }
      );
      console.log(deletePlace);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      console.log(err);
    }
    history.push("/");
  };

  const commentManiHandler = (id) => {
    const allComments = [...showPlace.comments];
    const editComment = allComments.find((comment) => {
      return comment._id === id;
    });
    allComments.forEach((c) => {
      editComment.isEditing = true;
      const index = allComments.findIndex((c) => c._id === id);
      allComments[index] = editComment;
      setShowPlace({ ...showPlace, comments: allComments });
    });
  };

  const deleteWarningHandler = () => {
    setDeleteWarning(true);
  };

  const cancelDeleteHandler = () => {
    setDeleteWarning(false);
  };

  const showEditFormHandler = (id) => {
    const showFormFunc = () => {
      const showForm = comments.find((c) => c._id === id);
      showForm.showForm = true;
      const finalState = { ...showForm, isEditing: false };
      comments[comments.findIndex((c) => c._id === id)] = finalState;
      setTimeout(() => {
        setShowPlace({ ...showPlace, comments: comments });
      }, 100);
      setEditCommentValue(showForm.text);
    };

    const showForms = [];
    const comments = [...showPlace.comments];
    comments.forEach((c) => {
      showForms.push(c.showForm);
    });
    if (showForms.every((f) => !f)) {
      showFormFunc();
    } else {
      for (let c of comments) {
        c.showForm = false;
      }
      showFormFunc();
    }
  };

  const commentEditChangeHandler = (e, id) => {
    setEditCommentValue(e.target.value);
  };

  const editedCommentHandler = async (id, type) => {
    let editComment;
    const editCommentFunc = () => {
      const comments = [...showPlace.comments];
      editComment = comments.find((c) => c._id === id);
      editComment.text = editCommentValue;
      editComment.showForm = false;
      setShowPlace({ ...showPlace, comments });
    };
    if (type === "cancel") {
      editCommentFunc();
    } else {
      editCommentFunc();
      const resp = await axios.put(
        `http://localhost:5000/place/${placeId}/comments/${id}`,
        editComment,
        {
          headers: {
            Authorization: authContext.token,
          },
        }
      );
      const editedComment = resp.data;
    }
  };

  const deleteCommentHandler = async (id) => {
    const comments = [...showPlace.comments];
    const deleted = comments.filter((c) => c._id !== id);
    setTimeout(() => {
      setShowPlace({ ...showPlace, comments: deleted });
    }, 100);
    const resp = await axios.delete(
      `http://localhost:5000/place/${placeId}/comments/${id}`,
      {
        headers: {
          Authorization: authContext.token,
        },
      }
    );
    console.log(resp);
  };

  if (showPlace) {
    comments = showPlace.comments.map((c) => {
      return (
        <div className="comment">
          {c.showForm ? (
            <div className="edit-form">
              <input
                onChange={(e) => commentEditChangeHandler(e, c._id)}
                value={editCommentValue}
                className="edit-form__input"
                type="text"
              />
              <Button
                clicked={() => editedCommentHandler(c._id)}
                className="edit-form__comment"
              >
                Comment
              </Button>
              <Button
                clicked={() => editedCommentHandler(c._id, "cancel")}
                className="edit-form__cancel"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="comment__display">
                <span className="comment__author">
                  <strong>{c.username}</strong>
                </span>
                <div
                  onClick={() => commentManiHandler(c._id)}
                  className={
                    authContext.userData.userId === c.author
                      ? "dots-container"
                      : "dots-container hide-comment-dots"
                  }
                >
                  <span className="comment__dots"></span>
                  <EditComment
                    showEditForm={() => showEditFormHandler(c._id)}
                    showEditComment={c.isEditing}
                    deleteComment={() => deleteCommentHandler(c._id)}
                  />
                </div>
                <EditComment
                  cAuthor={c.author}
                  authContext={authContext}
                  cId={c._id}
                  commentManiHandler={() => commentManiHandler()}
                />
              </div>
              <div className="comment__body">
                <span className="comment__text">{c.text}</span>
                <span className="comment__date">
                  {moment(c.date).fromNow()}
                </span>
              </div>
            </>
          )}
        </div>
      );
    });
  }

  const cancelEditingHandler = (e) => {
    if (e.target.closest(".dots-container")) {
    } else {
      const comments = [...showPlace.comments];
      comments.forEach((c) => {
        if (c.isEditing) {
          c.isEditing = false;
        }
        if (!e.target.closest(".edit-form") && c.isEditing) {
          c.showForm = false;
        }
      });
      setShowPlace({ ...showPlace, comments: comments });
    }
  };

  return (
    <>
      <BackDrop
        clicked={() => cancelDeleteHandler()}
        showBackDrop={deleteWarning}
      />
      <Model
        showModel={deleteWarning}
        header="Warning for deletion?"
        content="This action can't be undone.Are you sure you want to delete thisThis action can't be undone.Are you sure you want to delete this?"
        footer={
          <div className="model__btn-container">
            <Button clicked={deleteHandler} className="model__delete">
              Continue
            </Button>
            <Button clicked={cancelDeleteHandler} className="model__cancel">
              Cancel
            </Button>
          </div>
        }
      />
      <LoadingSpinner showSpinner={isLoading} />
      <div onClick={cancelEditingHandler} className="showplace-container">
        <div className="show">
          {showPlace && (
            <>
              <div className="show__place">
                <img
                  className="show__img"
                  src={showPlace.image}
                  alt={showPlace.name}
                />
                <div className="show__btns">
                  {authContext.authenticated &&
                    authContext.userData.userId ===
                      showPlace.creator.author && (
                      <Link to={`/place/${placeId}/update`}>
                        <Button className="show__edit">Edit</Button>
                      </Link>
                    )}
                  {authContext.authenticated &&
                    authContext.userData.userId ===
                      showPlace.creator.author && (
                      <Button
                        clicked={deleteWarningHandler}
                        className="show__delete"
                      >
                        Delete
                      </Button>
                    )}
                  <Ratings
                    placeOwnerId={showPlace.creator.author}
                    placeId={showPlace._id}
                  />
                </div>
                <p className="creator">
                  Uploaded by
                  <em>
                    <Link to={`/place/user/${showPlace.creator.author}`}>
                      <strong>{showPlace.creator.username}</strong>
                    </Link>
                  </em>
                </p>
                <div className="like">
                  <p className="like__counts">
                    {showPlace.likes.length} people like this place
                  </p>
                  {authContext.authenticated && (
                    <Button
                      style={{ position: "relative" }}
                      clicked={likedHandler}
                      className={likeBtnCls}
                    >
                      {likeIsLoading ? (
                        <span className="text-loading"></span>
                      ) : (
                        likeText
                      )}
                    </Button>
                  )}
                  <p className="like__date">
                    {moment(showPlace.date).fromNow()}
                  </p>
                </div>
              </div>
              <div className="show__infos">
                <h4 className="show__title">{showPlace.title}</h4>
                <p className="show__description">{showPlace.description}</p>
              </div>
            </>
          )}
        </div>
        <div className="comments-container">
          {authContext.authenticated ? (
            <Comment
              formCls="add-comment"
              btnCls="comment-btn"
              textareaCls="comment-input"
              addComment={(comment) => addCommentHandler(comment)}
            />
          ) : (
            <p>Sign in to discuss with other users.</p>
          )}
          <div className="show__comments">
            <div className="comments">{comments}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowPlace;
