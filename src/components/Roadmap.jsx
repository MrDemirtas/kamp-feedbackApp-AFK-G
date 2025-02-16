import "../css/roadmap.css";

import { Data, ScreenSize } from "../App";
import { useContext, useState } from "react";

export default function Roadmap() {
  const screenSize = useContext(ScreenSize);
  return screenSize < 768 ? <RoadmapMobile /> : <RoadmapDesktop />;
}

function RoadmapMobile() {
  const { data } = useContext(Data);
  const [activeTab, setActiveTab] = useState("InProgress");

  return (
    <div className="roadmap-container">
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
            <Card key={feedback.id} feedback={feedback} />
          ))}
      </main>
    </div>
  );
}

function Header() {
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

function Card({ feedback }) {
  const { data, setData } = useContext(Data);
  const handleUpvote = () => {
    if (data.currentUser.myUpvotes.includes(feedback.id)) {
      data.currentUser.myUpvotes = data.currentUser.myUpvotes.filter((x) => x !== feedback.id);
      feedback.upvotes--;
    } else {
      data.currentUser.myUpvotes.push(feedback.id);
      feedback.upvotes++;
    }
    setData({ ...data });
  };

  return (
    <div className={"roadmap-card" + ` ${feedback.status}`}>
      <span className={"roadmap-status" + ` ${feedback.status}`}>{feedback.status}</span>
      <h3 onClick={() => (location.hash = `/feedback/${feedback.id}`)}>{feedback.title}</h3>
      <p>{feedback.description}</p>
      <span className="tag">{feedback.category}</span>
      <div className="interactions">
        <span className={"upvote" + (data.currentUser.myUpvotes.includes(feedback.id) ? " active" : "")} onClick={handleUpvote}>
          <i className="fas fa-chevron-up"></i> {feedback.upvotes}
        </span>
        <span className="comments" onClick={() => (location.hash = `/feedback/${feedback.id}`)}>
          <i className="fas fa-comment"></i> {feedback.comments.length}
        </span>
      </div>
    </div>
  );
}

function RoadmapDesktop() {
  const { data } = useContext(Data);
  const statusesDescriptions = ["Ideas prioritized for research", "Currently being developed", "Currently being developed"];
  return (
    <div className="roadmap-container">
      <Header />
      <div className="roadmap-tablet-grid-group">
        {data.statuses.map((status, i) => (
          <div key={status.name} className="roadmap-tablet-grid">
            <div className="roadmap-tablet-grid-title">
              <h2>
                {status.name} ({status.count})
              </h2>
              <p>{statusesDescriptions[i]}</p>
            </div>
            <div className="roadmap-tablet-card-item">
              {data.feedbacks
                .filter((f) => f.status === status.name)
                .map((feedback) => (
                  <Card key={feedback.id} feedback={feedback} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
