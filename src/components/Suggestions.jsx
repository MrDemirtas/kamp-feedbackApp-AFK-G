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
    if (suggestions.length > 0) {
      let sortedSuggestions = [...suggestions];
      switch (sortBy) {
        case 'mostUpvotes':
          sortedSuggestions.sort((a, b) => b.upvotes - a.upvotes);
          break;
        case 'leastUpvotes':
          sortedSuggestions.sort((a, b) => a.upvotes - b.upvotes);
          break;
        case 'mostComments':
          sortedSuggestions.sort((a, b) => b.comments.length - a.comments.length);
          break;
        case 'leastComments':
          sortedSuggestions.sort((a, b) => a.comments.length - b.comments.length);
          break;
        default:
          sortedSuggestions = data.feedbacks;
          break;
      }
      setSuggestions(sortedSuggestions);
    }

  }, [sortBy])


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
        {suggestions.map(x => (
          <div key={x.id} className="feedback-item">
            <h4 onClick={() => location.hash = `/feedback/${x.id}`}>{x.title}</h4>
            <p>{x.description}</p>
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
        ))}
      </div>
    </>
  );
}