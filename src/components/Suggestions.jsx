import Header from "./Header";
import { useContext, useEffect, useState } from "react";
import "../css/suggestions.css";
import { Data } from "../App";

export default function Suggestions() {
  const { data, setData } = useContext(Data);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [suggestions, setSuggestions] = useState(data.feedbacks);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    let filteredSuggestions = [...data.feedbacks];
    
    if (selectedCategory !== "All") {
      filteredSuggestions = filteredSuggestions.filter(
        feedback => feedback.category === selectedCategory
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case 'mostUpvotes':
          filteredSuggestions.sort((a, b) => b.upvotes - a.upvotes);
          break;
        case 'leastUpvotes':
          filteredSuggestions.sort((a, b) => a.upvotes - b.upvotes);
          break;
        case 'mostComments':
          filteredSuggestions.sort((a, b) => b.comments.length - a.comments.length);
          break;
        case 'leastComments':
          filteredSuggestions.sort((a, b) => a.comments.length - b.comments.length);
          break;
      }
    }
    
    setSuggestions(filteredSuggestions);
  }, [selectedCategory, sortBy, data.feedbacks]);

  const handleUpvote = (feedbackId) => {
    if (data.currentUser.myUpvotes.includes(feedbackId)) {
      data.currentUser.myUpvotes = data.currentUser.myUpvotes.filter(x => x !== feedbackId)
      data.feedbacks.find(x => x.id === feedbackId).upvotes--;
    } else {
      data.currentUser.myUpvotes.push(feedbackId);
      data.feedbacks.find(x => x.id === feedbackId).upvotes++;
    }
    setData({ ...data });
  };

  return (
    <>
      <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="select-feedback">
        <label htmlFor="sort">Sort by:</label>
        <select name="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="changeSort">Change sort</option>
          <option value="mostUpvotes">Most Upvotes</option>
          <option value="leastUpvotes">Least Upvotes</option>
          <option value="mostComments">Most Comments</option>
          <option value="leastComments">Least Comments</option>
        </select>
        <button onClick={() => location.hash = `/new-feedback`}>+ Add Feedback</button>
      </div>
      <div className="feedbacks-container">
        {suggestions.length > 0 ? suggestions.map(x => (
          <div key={x.id} className="feedback-item">
            <h4 onClick={() => location.hash = `/feedback/${x.id}`}>{x.title}</h4>
            <p onClick={() => location.hash = `/feedback/${x.id}`}>{x.description}</p>
            <p>{x.category}</p>
            <div className="item-upvotes-comment">
              <p className={data.currentUser.myUpvotes.includes(x.id) ? "active" : ""} onClick={() => handleUpvote(x.id)}>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="#4661E6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6L4 2L8 6" strokeWidth="2" />
                </svg>
                {x.upvotes}
              </p>
              <a href={`#/feedback/${x.id}`}>
                <img src="\public\images\comment.svg" alt="" />
                {x.comments.length}
              </a>
            </div>
          </div>
        ))
        :
        (
          <div className="null-page">
            <img src="\public\images\null-page.svg" alt="" />
            <h4>There is no feedback yet.</h4>
            <p>Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
            <button onClick={() => location.hash = `/new-feedback`}>+ Add Feedback</button>
          </div>
        )
        }
      </div>
    </>
  );
}