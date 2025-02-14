import FeedbackDetail from "./components/FeedbackDetail";
import FeedbackForm from "./components/FeedbackForm";
import Roadmap from "./components/Roadmap";
import Suggestions from "./components/Suggestions";

const routers = [
  {
    url: "/",
    component: <Suggestions />,
  },
  {
    url: "/feedback",
    component: <FeedbackDetail />,
  },
  {
    url: "/roadmap",
    component: <Roadmap />,
  },
  {
    url: "/new-feedback",
    component: <FeedbackForm />,
  },
  {
    url: "/edit-feedback",
    component: <FeedbackForm isEdit={true} />,
  },
];

export function getPage(url) {
  return routers.find((router) => router.url === "/" + url.split("/")[1])?.component || <h1>404 Not Found</h1>
}
