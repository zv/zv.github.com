import reposition_footnotes from './footnotes';
import load_comments        from './comments';

(function page_init() {
    // Reposition footnotes onto right side
    if (window.innerWidth >= 1024) {
        window.addEventListener('load', function() {
            let refs  = document.getElementsByClassName("footref");
            let definitions = document.getElementsByClassName("footdef");
            reposition_footnotes(refs, definitions);
        })
    }

    // Fetch & insert comments
    const CONTAINER_ELT = document.querySelector("div.comments-container");
    let github_id       = CONTAINER_ELT.getAttribute("data-github-user");
    let repo_issues_url = CONTAINER_ELT.getAttribute("data-issues-url");
    let issue_id        = CONTAINER_ELT.getAttribute("data-issue-id");
    load_comments(CONTAINER_ELT, github_id, repo_issues_url, issue_id);
})();
