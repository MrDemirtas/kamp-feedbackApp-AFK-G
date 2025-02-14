import "../css/roadmap.css";

import { useContext, useEffect, useState } from "react";

import { Data } from "../App";

function Roadmap() {
  const { data, setData } = useContext(Data);
  const [activeTab, setActiveTab] = useState("InProgress");

  function handleUpvote(id) {
    setData((prevData) => ({
      ...prevData,
      feedbacks: prevData.feedbacks.map((feedback) => (feedback.id === id ? { ...feedback, upvotes: feedback.upvotes + 1 } : feedback)),
    }));
  }

  return (
    <div className="container">
      <Header />
      <Tabs statuses={data.statuses} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="selected-tab">
        <h2>
          {activeTab} ({data.feedbacks.filter((f) => f.status === activeTab).length})
        </h2>
        <p>Features currently being developed</p>
      </div>
      <main>
        {data.feedbacks
          .filter((f) => f.status === activeTab)
          .map((feedback) => (
            <Card key={feedback.id} feedback={feedback} onUpvote={handleUpvote} />
          ))}
      </main>
    </div>
  );
}

function Header({ onAddFeedback }) {
  return (
    <div className="roadmap-header">
      <div className="header-left">
        <a href="#/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Go Back
        </a>
        <h1>Roadmap</h1>
      </div>
      <button className="add-feedback" onClick={() => (location.hash = "/new-feedback")}>
        + Add Feedback
      </button>
    </div>
  );
}

function Tabs({ statuses, activeTab, setActiveTab }) {
  return (
    <nav className="tabs">
      {statuses.map((status) => (
        <span key={status.name} className={activeTab === status.name ? "active" : ""} onClick={() => setActiveTab(status.name)}>
          {status.name} ({status.count})
        </span>
      ))}
    </nav>
  );
}

function Card({ feedback, onUpvote }) {
  return (
    <div className="card">
      <span className="status">🔴 {feedback.status}</span>
      <h3 onClick={() => location.hash = `/feedback/${feedback.id}`}>{feedback.title}</h3>
      <p>{feedback.description}</p>
      <div className="tags">
        <span className="tag">{feedback.category}</span>
      </div>
      <div className="interactions">
        <span className="upvote" onClick={() => onUpvote(feedback.id)}>
          <i className="fas fa-chevron-up"></i> {feedback.upvotes}
        </span>
        <span className="comments" onClick={() => location.hash = `/feedback/${feedback.id}`}>
          <i className="fas fa-comment"></i> {feedback.comments.length}
        </span>
      </div>
    </div>
  );
}

export default Roadmap;
