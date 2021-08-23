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
window.addEventListener('load', function doLoadComments() {
    console.log('loading comments...')
    const CONTAINER_ELT = document.querySelector("div.comments-container") as HTMLElement;
    const [github_id, repo_issues_url, issue_id] = [
        'data-github-user',
        'data-issues-url',
        'data-issue-id'
    ].map(attr => CONTAINER_ELT.getAttribute(attr)!)
    loadGithubComments(CONTAINER_ELT, github_id, repo_issues_url, issue_id)
})
