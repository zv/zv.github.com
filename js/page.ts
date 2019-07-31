import { repositionFootnotes, ElementCollection } from './footnotes';
import { loadGithubComments } from './comments';

// Reposition footnotes onto right side
if (window.innerWidth >= 1024) {
  window.addEventListener('load', function () {
    console.log('repositioning footnotes...')
    repositionFootnotes(document.getElementsByClassName("footref") as ElementCollection)
  })
}

// Fetch & insert comments
document.addEventListener('scroll', function doLoadComments() {
  // if they are more than halfway done with the article, load our comments.
  if (((window.innerHeight + window.scrollY)) >= (document.body.offsetHeight >> 1)) {
    console.log('loading comments...')
    const CONTAINER_ELT = document.querySelector("div.comments-container") as HTMLElement;
    const [github_id, repo_issues_url, issue_id] = [
      'data-github-user',
      'data-issues-url',
      'data-issue-id'
    ].map(attr => CONTAINER_ELT.getAttribute(attr)!)
    loadGithubComments(CONTAINER_ELT, github_id, repo_issues_url, issue_id)
    document.removeEventListener('scroll', doLoadComments)
  }
})
