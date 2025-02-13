import "../css/feedbackForm.css";

import { Data, Route } from "../App";
import { useContext, useEffect, useRef, useState } from "react";

export default function FeedbackForm({ isEdit = false }) {
  const { data, setData } = useContext(Data);
  const route = useContext(Route);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const dialogRef = useRef(null);
  const [edittingFeedback, setEdittingFeedback] = useState(isEdit ? data.feedbacks.find((feedback) => feedback.id === route.split("/").at(-1)) : null);
  const [formCategory, setFormCategory] = useState({
    show: false,
    value: isEdit && edittingFeedback ? edittingFeedback.category : data.categories[0],
  });
  const [formStatus, setFormStatus] = useState({
    show: false,
    value: isEdit && edittingFeedback ? edittingFeedback.status : "Planned",
  });

  useEffect(() => {
    if (isEdit) {
      setEdittingFeedback(isEdit ? data.feedbacks.find((feedback) => feedback.id === route.split("/").at(-1)) : null);
    }else{
      location.hash = "/new-feedback";
    }
    setFormCategory({
      show: false,
      value: isEdit && edittingFeedback ? edittingFeedback.category : data.categories[0],
    });
    setFormStatus({
      show: false,
      value: isEdit && edittingFeedback ? edittingFeedback.status : "Planned",
    });
  }, [route]);

  useEffect(() => {
    if (isEdit && edittingFeedback) {
      titleRef.current.value = edittingFeedback.title;
      descriptionRef.current.value = edittingFeedback.description;
    } else if (!isEdit) {
      titleRef.current.value = "";
      descriptionRef.current.value = "";
    }
  }, [edittingFeedback, isEdit]);

  if (!edittingFeedback && isEdit) {
    location.hash = "/404";
    return;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    if (isEdit) {
      edittingFeedback.title = formObj.title;
      edittingFeedback.category = formCategory.value;
      edittingFeedback.status = formStatus.value;
      edittingFeedback.description = formObj.description;
    } else {
      const newFeedbackObj = {
        id: crypto.randomUUID(),
        title: formObj.title,
        description: formObj.description,
        category: formCategory.value,
        upvotes: 0,
        status: "Planned",
        comments: [],
      };

      data.feedbacks.push(newFeedbackObj);
      data.statuses.find((x) => x.name === "Planned").count++;
    }
    setData({ ...data });
  }

  function handleDelete() {
    dialogRef.current.close();
    data.feedbacks = data.feedbacks.filter((feedback) => feedback.id !== edittingFeedback.id);
    setData({ ...data });
    location.hash = "/";
  }

  return (
    <div className="feedback-form-container">
      <button className="go-back-button" onClick={() => (location.hash = "/")}>
        <img src="/images/right-arrow.svg" />
        Go Back
      </button>
      <form onSubmit={handleSubmit} className="feedback-form">
        <figure>
          <img src={isEdit ? "/images/pen.svg" : "/images/plus.svg"} />
        </figure>
        <div className="feedback-form-contents">
          <h1>{isEdit ? `Editing ‘${edittingFeedback.title}’` : "Create New Feedback"}</h1>
          <section>
            <div className="feedback-form-input-text">
              <h4>Feedback Title</h4>
              <p>Add a short, descriptive headline</p>
            </div>
            <input ref={titleRef} required type="text" name="title" defaultValue={isEdit ? edittingFeedback.title : ""} />
          </section>
          <section>
            <div className="feedback-form-input-text">
              <h4>Category</h4>
              <p>Choose a category for your feedback</p>
            </div>
            <button type="button" onClick={() => setFormCategory({ ...formCategory, show: !formCategory.show })}>
              {formCategory.value}
              <img src={`/images/${formCategory.show ? "upper" : "bottom"}-arrow.svg`} />
            </button>
            {formCategory.show && (
              <div className="form-dropdown">
                {data.categories.map((category) => (
                  <button onClick={() => setFormCategory({ show: false, value: category })} key={category}>
                    {category}
                    {formCategory.value === category && <img src="/images/dropdown-tick.svg" />}
                  </button>
                ))}
              </div>
            )}
          </section>
          {isEdit && (
            <section>
              <div className="feedback-form-input-text">
                <h4>Update Status</h4>
                <p>Change feature state</p>
              </div>
              <button type="button" onClick={() => setFormStatus({ ...formStatus, show: !formStatus.show })}>
                {formStatus.value}
                <img src={`/images/${formStatus.show ? "upper" : "bottom"}-arrow.svg`} />
              </button>
              {formStatus.show && (
                <div className="form-dropdown">
                  {data.statuses.map((status) => (
                    <button onClick={() => setFormStatus({ show: false, value: status.name })} key={status.name}>
                      {status.name}
                      {formStatus.value === status.name && <img src="/images/dropdown-tick.svg" />}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
          <section>
            <div className="feedback-form-input-text">
              <h4>Feedback Detail</h4>
              <p>Include any specific comments on what should be improved, added, etc.</p>
            </div>
            <textarea ref={descriptionRef} required name="description" rows={5} defaultValue={isEdit ? edittingFeedback.description : ""}></textarea>
          </section>
          <div className="feedback-form-btn-group">
            <button className="feedback-form-btn-submit" type="submit">
              {isEdit ? "Save Changes" : "Add Feedback"}
            </button>
            <button className="feedback-form-btn-cancel" onClick={() => location.hash = isEdit ? `/feedback/${edittingFeedback.id}` : "/"} type="button">
              Cancel
            </button>
            {isEdit && (
              <button onClick={() => dialogRef.current.showModal()} className="feedback-form-btn-delete" type="button">
                Delete
              </button>
            )}
          </div>
        </div>
      </form>
      <DeleteDialog dialogRef={dialogRef} handleDelete={handleDelete} />
    </div>
  );
}

function DeleteDialog({ dialogRef, handleDelete }) {
  return (
    <dialog ref={dialogRef} className="delete-dialog">
      <div className="dialog-container">
        <h3>Delete this feedback?</h3>
        <p>
          Are you sure you want to delete this feedback? This action cannot be undone and you will lose all of its data.
        </p>
        <button className="delete-dialog-btn" onClick={handleDelete}>
          Confirm & Delete
        </button>
        <button className="cancel-dialog-btn" onClick={() => dialogRef.current.close()}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}