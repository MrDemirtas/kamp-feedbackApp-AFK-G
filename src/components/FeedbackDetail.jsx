import "../css/feedbackdetail.css";

import { Data, Route, ScreenSize } from "../App";
import { Fragment, useContext, useEffect, useState } from "react";

export default function FeedbackDetail() {
  const { data, setData } = useContext(Data);
  const screenSize = useContext(ScreenSize);
  const route = useContext(Route);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState(data.feedbacks.find((feedback) => feedback.id === location.hash.substring(1).split("/").at(-1)));

  useEffect(() => {
    setCurrentFeedback(data.feedbacks.find((feedback) => feedback.id === location.hash.substring(1).split("/").at(-1)));
  }, [route]);

  if (!currentFeedback) {
    location.hash = "/404";
    return;
  }

  useEffect(() => {
    setReplyContent("");
  }, [reply]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    const userComment = {
      id: crypto.randomUUID(),
      name: data.currentUser.name,
      username: data.currentUser.username,
      content: newComment,
      image: data.currentUser.image,
      replies: [],
    };
    currentFeedback.comments.push(userComment);
    setData({ ...data });
    setNewComment("");
  }

  function handleReplySubmit(e, replyToComment = false, replyUserName = "") {
    e.preventDefault();
    if (!replyContent.trim()) return;
    const userReply = {
      id: crypto.randomUUID(),
      name: data.currentUser.name,
      username: data.currentUser.username,
      content: `${replyUserName} ` + replyContent,
      image: data.currentUser.image,
    };
    currentFeedback.comments.find((comment) => comment.id === replyToComment).replies.push(userReply);
    setData({ ...data });
    setReply("");
    setReplyContent("");
  }

  return (
    <div className="feedback-detail-container">
      <div className="feedback-detail-header">
        <a href="#/">
          Go back <img src="/images/right-arrow.svg" />
        </a>
        <a href={`#/edit-feedback/${currentFeedback.id}`}>Edit Feedback</a>
      </div>
      <div className="card-info">
        <div className="card-content">
          <div className="card-header">
            {screenSize >= 768 && (
              <span>
                {currentFeedback.upvotes} <img src="/images/up-arrow.svg" />
              </span>
            )}
            <div>
              <h4>{currentFeedback.title}</h4>
              <p>{currentFeedback.description}</p>
              <button>{currentFeedback.category}</button>
            </div>
          </div>
          <div className="card-footer">
            {screenSize < 768 && (
              <span>
                {currentFeedback.upvotes} <img src="/images/up-arrow.svg" />
              </span>
            )}
            <span className="bg">
              {currentFeedback.comments?.length} <img src="/images/comment.svg" />
            </span>
          </div>
        </div>
      </div>
      <div className="feedback-comments">
        <h3>{currentFeedback.comments?.length} Comments</h3>
        {currentFeedback.comments?.map((comment) => (
          <div key={comment.id}>
            <div className="comments-area">
              <div className="comment">
                <div className="comment-header">
                  <img src={comment.image || `https://ui-avatars.com/api/?name=${comment.author.replace(" ", "+") || comment.name}`} alt="" />
                  <div>
                    <h4>{comment.author || comment.name}</h4>
                    <span>{comment.username}</span>
                  </div>
                </div>
                <button onClick={() => setReply(comment.id)}>Reply</button>
              </div>
              <p>{comment.content}</p>
            </div>

            {reply === comment.id && (
              <form onSubmit={(e) => handleReplySubmit(e, comment.id, comment.username)} autoComplete="off" className="reply-form">
                <textarea name="userReply" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} className="text-area"></textarea>
                <button>Send</button>
              </form>
            )}
            {comment.replies.length > 0 && (
              <div className="replies-section">
                {comment.replies.map((x) => (
                  <Fragment key={x.id}>
                    <div className="reply">
                      <div className="comment-header">
                        <div className="reply-header">
                          <img src={x.image} alt="" />
                          <div>
                            <h4>{x.author || x.name}</h4>
                            <span>{x.username}</span>
                          </div>
                        </div>
                        <button onClick={() => setReply(x.id)}>Reply</button>
                      </div>
                      <p>{x.content}</p>
                    </div>
                    {reply === x.id && (
                      <form onSubmit={(e) => handleReplySubmit(e, comment.id, x.username)} autoComplete="off" className="reply-form">
                        <textarea name="userReply" id="" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} className="text-area"></textarea>
                        <button>Send</button>
                      </form>
                    )}
                  </Fragment>
                ))}
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
      <div className="add-comment">
        <h4>Add Comment</h4>
        <form onSubmit={handleSubmit} autoComplete="off">
          <textarea name="userComment" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="type your comment here" maxLength={250}></textarea>
          <div className="add-comment-footer">
            <span>{250 - newComment.length} Characters left</span>
            <button>Post Comment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
