import "../css/suggestions.css";

import { Data, ScreenSize } from "../App";
import { useContext, useEffect, useState } from "react";

import Header from "./Header";

export default function Suggestions() {
  const { data, setData } = useContext(Data);
  const screenSize = useContext(ScreenSize);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState(data.feedbacks);
  const [sortBy, setSortBy] = useState("Most Upvotes");
  const [sortDropdownMenu, setSortDropdownMenu] = useState(false);

  useEffect(() => {
    if (suggestions.length > 0) {
      let sortedSuggestions = [...suggestions];
      switch (sortBy) {
        case "Most Upvotes":
          sortedSuggestions.sort((a, b) => b.upvotes - a.upvotes);
          break;
        case "Least Upvotes":
          sortedSuggestions.sort((a, b) => a.upvotes - b.upvotes);
          break;
        case "Most Comments":
          sortedSuggestions.sort((a, b) => b.comments.length - a.comments.length);
          break;
        case "Least Comments":
          sortedSuggestions.sort((a, b) => a.comments.length - b.comments.length);
          break;
        default:
          sortedSuggestions = data.feedbacks;
          break;
      }
      setSuggestions(sortedSuggestions);
    }
  }, [sortBy]);

  const handleUpvote = (feedbackId) => {
    if (data.currentUser.myUpvotes.includes(feedbackId)) {
      data.currentUser.myUpvotes = data.currentUser.myUpvotes.filter((x) => x !== feedbackId);
      data.feedbacks.find((x) => x.id === feedbackId).upvotes--;
    } else {
      data.currentUser.myUpvotes.push(feedbackId);
      data.feedbacks.find((x) => x.id === feedbackId).upvotes++;
    }
    setData({ ...data });
  };

  useEffect(() => {
    setSortDropdownMenu(false);
  }, [sortBy]);
  
  return (
    <div className="suggestions-container">
      <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="suggestions-contents">
        <div className="select-feedback">
          {screenSize >= 768 && (
            <div className="suggestions-length">
              <img src="/images/light.svg" />
              <span>{suggestions.filter((x) => x.category.includes(selectedCategory)).length} Suggestions</span>
            </div>
          )}
          <label className="sort-by">
            Sort by:
            <button onClick={() => setSortDropdownMenu(!sortDropdownMenu)}>
              {sortBy}
              <svg width="10" height="7" viewBox="0 0 10 7" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" strokeWidth="2" />
              </svg>
            </button>
            {sortDropdownMenu && (
              <div className="sort-dropdownMenu">
                <button onClick={() => setSortBy("Most Upvotes")}>
                  Most Upvotes
                  {sortBy === "Most Upvotes" ? <img src="/images/dropdown-tick.svg" /> : ""}
                </button>
                <button onClick={() => setSortBy("Least Upvotes")}>
                  Least Upvotes
                  {sortBy === "Least Upvotes" ? <img src="/images/dropdown-tick.svg" /> : ""}
                </button>
                <button onClick={() => setSortBy("Most Comments")}>
                  Most Comments
                  {sortBy === "Most Comments" ? <img src="/images/dropdown-tick.svg" /> : ""}
                </button>
                <button onClick={() => setSortBy("Least Comments")}>
                  Least Comments
                  {sortBy === "Least Comments" ? <img src="/images/dropdown-tick.svg" /> : ""}
                </button>
              </div>
            )}
          </label>
          <button onClick={() => (location.hash = `/new-feedback`)}>+ Add Feedback</button>
        </div>
        <div className="feedbacks-container">
          {suggestions
            .filter((x) => x.category.includes(selectedCategory))
            .map((x) => (
              <div key={x.id} className="feedback-item">
                <h4 onClick={() => (location.hash = `/feedback/${x.id}`)}>{x.title}</h4>
                <p>{x.description}</p>
                <p>{x.category}</p>
                {/* <div className="item-upvotes-comment"> */}
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
                {/* </div> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
