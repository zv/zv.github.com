import reposition_footnotes from './footnotes';
import load_comments        from './comments';

const CONTAINER_ELT = document.querySelector("div.comments-container");
let github_id       = CONTAINER_ELT.getAttribute("data-github-user")
let repo_issues_url = CONTAINER_ELT.getAttribute("data-issues-url")
let issue_id        = CONTAINER_ELT.getAttribute("data-issue-id")
load_comments(CONTAINER_ELT, github_id, repo_issues_url, issue_id)

if (window.innerWidth >= 1024) {
    reposition_footnotes("footref", "footdef");
}
