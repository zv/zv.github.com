import { reposition_footnotes, ElementCollection } from './footnotes';
import { load_comments } from './comments';

const page_init = () => {
  // // Reposition footnotes onto right side
  if (window.innerWidth >= 1024) {
    window.addEventListener('load', function() {
      let refs = document.getElementsByClassName("footref") as ElementCollection;
      let definitions = document.getElementsByClassName("footdef") as ElementCollection;
      reposition_footnotes(refs, definitions);
    })
  }

  // Fetch & insert comments
  const CONTAINER_ELT = document.querySelector("div.comments-container") as HTMLElement;
  const github_id = CONTAINER_ELT.getAttribute("data-github-user")!;
  const repo_issues_url = CONTAINER_ELT.getAttribute("data-issues-url")!;
  const issue_id = CONTAINER_ELT.getAttribute("data-issue-id")!;
  load_comments(CONTAINER_ELT, github_id, repo_issues_url, issue_id);
}

page_init()
