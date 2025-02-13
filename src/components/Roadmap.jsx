import { useEffect, useState } from "react";
import "../css/roadmap.css";

const Roadmap = () => {
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

  const handleAddFeedback = () => {
    const newFeedback = {
      id: Date.now(),
      title: "New Feature",
      description: "Description of the new feature.",
      category: "Feature",
      upvotes: 0,
      status: activeTab,
      comments: [],
    };
    setData((prevData) => ({
      ...prevData,
      feedbacks: [...prevData.feedbacks, newFeedback],
    }));
  };

  const handleUpvote = (id) => {
    setData((prevData) => ({
      ...prevData,
      feedbacks: prevData.feedbacks.map((feedback) =>
        feedback.id === id
          ? { ...feedback, upvotes: feedback.upvotes + 1 }
          : feedback
      ),
    }));
  };

  return (
    <div className="container">
      <Header onAddFeedback={handleAddFeedback} />
      <Tabs
        statuses={data.statuses}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main>
        <h2>
          {activeTab} (
          {data.feedbacks.filter((f) => f.status === activeTab).length})
        </h2>
        <p>Features currently being developed</p>
        {data.feedbacks
          .filter((f) => f.status === activeTab)
          .map((feedback) => (
            <Card
              key={feedback.id}
              feedback={feedback}
              onUpvote={handleUpvote}
            />
          ))}
      </main>
    </div>
  );
};

const Header = ({ onAddFeedback }) => (
  <header>
    <a href="#" className="back-btn">
      <i className="fas fa-arrow-left"></i> Go Back
    </a>
    <button className="add-feedback" onClick={onAddFeedback}>
      + Add Feedback
    </button>
  </header>
);

const Tabs = ({ statuses, activeTab, setActiveTab }) => (
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

const Card = ({ feedback, onUpvote }) => (
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

export default Roadmap;
