import { useEffect, useState } from "react";
import "../css/roadmap.css";

function Roadmap() {
  const initialData = {
    currentUser: {
      id: 1,
      name: "Alex",
      username: "@alex",
      image: "images/user-images/user-alex.jpg",
    },
    feedbacks: [
      {
        id: 7,
        title: "One-click portfolio generation",
        description:
          "Add ability to create professional looking portfolio from profile.",
        category: "Feature",
        upvotes: 62,
        status: "InProgress",
        comments: [],
      },
    ],
    statuses: [
      { name: "Planned", count: 3 },
      { name: "InProgress", count: 6 },
      { name: "Live", count: 1 },
    ],
  };

  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("InProgress");

  useEffect(() => {
    fetch("/data/feedback-data.json")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

  function handleAddFeedback() {
    const newFeedback = {
      id: Date.now(),
      title: "New Feature",
      description: "Description of the new feature.",
      category: "Feature",
      upvotes: 0,
      status: activeTab,
      comments: [],
    };
    setData((prevData) => {
      const updatedStatuses = prevData.statuses.map((status) =>
        status.name === activeTab ? { ...status, count: status.count + 1 } : status
      );
      return {
        ...prevData,
        feedbacks: [...prevData.feedbacks, newFeedback],
        statuses: updatedStatuses,
      };
    });
  }

  function handleUpvote(id) {
    setData((prevData) => ({
      ...prevData,
      feedbacks: prevData.feedbacks.map((feedback) =>
        feedback.id === id
          ? { ...feedback, upvotes: feedback.upvotes + 1 }
          : feedback
      ),
    }));
  }

  return (
    <div className="container">
      <Header onAddFeedback={handleAddFeedback} />
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
      <a href="#" className="back-btn">
        <i className="fas fa-arrow-left"></i> Go Back
      </a>
      <h1>Roadmap</h1>
      </div>
      <button className="add-feedback" onClick={onAddFeedback}>
        + Add Feedback
      </button>
    </div>
  );
}

function Tabs({ statuses, activeTab, setActiveTab }) {
  return (
    <nav className="tabs">
      {statuses.map((status) => (
        <span
          key={status.name}
          className={activeTab === status.name ? "active" : ""}
          onClick={() => setActiveTab(status.name)}
        >
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
      <h3>{feedback.title}</h3>
      <p>{feedback.description}</p>
      <div className="tags">
        <span className="tag">{feedback.category}</span>
      </div>
      <div className="interactions">
        <span className="upvote" onClick={() => onUpvote(feedback.id)}>
          <i className="fas fa-chevron-up"></i> {feedback.upvotes}
        </span>
        <span className="comments">
          <i className="fas fa-comment"></i> {feedback.comments.length}
        </span>
      </div>
    </div>
  );
}

export default Roadmap;
