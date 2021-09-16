import { repositionFootnotes, ElementCollection } from './footnotes';
import { loadGithubComments } from './comments';

// Reposition footnotes onto right side
if (window.innerWidth >= 1024) {
    window.addEventListener('load', function () {
        repositionFootnotes(document.getElementsByClassName("footref") as ElementCollection)
    })
}

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
)

// Fetch & insert comments
if (!isLocalhost) {
    window.addEventListener('load', function doLoadComments() {
        const CONTAINER_ELT = document.querySelector("div.comments-container") as HTMLElement;
        const [github_id, repo_issues_url, issue_id] = [
            'data-github-user',
            'data-issues-url',
            'data-issue-id'
        ].map(attr => CONTAINER_ELT.getAttribute(attr)!)
        loadGithubComments(CONTAINER_ELT, github_id, repo_issues_url, issue_id)
    })
}
