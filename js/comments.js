"use strict";

/*
 * This function loads a list of comments sourced from Github issues into a
 * blogpost ("page") by enumerating our github issues, finding which corresponds
 * to our current page, and then fetch & insert those comments.
 *
 * @property {string} github_id
 *    Your github username
 * @property {string} repo_issues_url
 *    The URL of the github issues page for the repository you'd like to use for comments
 *    "https://github.com/github/metadata-example/issues",
 * @property {string} issue_id
 *  The "id" (github issue title) you'd like to fetch the comments of
 */
function load_comments(github_id, repo_issues_url, issue_id) {
    var COMMENT_CONTAINER = "div.comments-container";
    var COMMENT_HOWTO = "a#comment-howto-link";

    function build_comment_html(issue) {
        return `<div class="comment">
        <div class="comment-photo">
            <img src="${issue.user.avatar_url}" />
        </div>
        <div class="comment-right">
            <div class="comment-header">
                <strong>${issue.user.login}</strong>
            </div>
            <hr />
            <div class="body"> ${issue.body_html} </div>
        </div>
    </div>`;
    }

    // Issues must be referenced by their numeric Github ID, `find_comments_url`
    // resolves a local blogpost/page name to that numeric ID.
    function find_comments_url() {
        // we append 'created' to ensure only we can create comment threads
        return window.fetch(`${repo_issues_url}?created=${github_id}`, {
            headers: { "Accept": "application/vnd.github.v3.html+json" }})
            .then(response => response.json())
            .then(json => {
                var issues = json.filter(issue => issue.title === issue_id);
                if (issues.length === 1) return issues;
                else throw new Error(`Incorrect number of issues: ${issues.length}`);
            });
    }

    // Fetch (and insert) our comments
    function fetch_comments(html_issues_url, api_issues_url) {
        return window.fetch(api_issues_url, {
            headers: { "Accept": "application/vnd.github.v3.html+json" }})
            .then(response => response.json())
            .then(comments => [comments, html_issues_url]);
    }

    // Insert posts comments into current page
    function insert_comments(comments, issues_url) {
        var howto = document.querySelector(COMMENT_HOWTO);
        var container = document.querySelector(COMMENT_CONTAINER);
        comments.forEach(comment => {
            var elt = document.createElement('div');
            elt.innerHTML = build_comment_html(comment);
            if (!container.appendChild(elt)) {
                console.error("ERROR: could not append element: ", elt);
            }
        })
        container.style.display = 'block';
        if (issues_url) {
            howto.href = issues_url;
        } else {
            console.error("insert_comments: issues_url blank")
        }
    }

    find_comments_url()
        .then(issue =>                    fetch_comments(issue[0].html_url, issue[0].comments_url))
        .then(([comments, issues_url]) => insert_comments(comments, issues_url))
        .catch(err => console.error("An error occurred while loading comments: ", err));
}
