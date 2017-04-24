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
    </div>`
    }

    function find_comments_url(callback) {
        // we append 'created' to ensure only we can create comment threads
        fetch(`${repo_issues_url}?created=${github_id}`, {
            headers:  {
                "Accept": "application/vnd.github.v3.html+json"
            }})
            .then(response => response.json())
            .then(json => {
                console.log(json);
                var issues = json.filter(issue => issue.title === issue_id)
                if (issues.length === 1)
                    // now that we've found the URL of the page hosting our
                    // current page's comments, let fetch them.
                    callback(issues[0].html_url, issues[0].comments_url)
            })
    }

    function list_comments(html_issues_url, api_issues_url) {
        var container = document.querySelector(COMMENT_CONTAINER);
        var howto = document.querySelector(COMMENT_HOWTO);
        fetch(api_issues_url, {
            headers:  {
                "Accept": "application/vnd.github.v3.html+json"
            }})
            .then(response => response.json())
            .then(comments => {
                comments.forEach(comment => {
                    var elt = document.createElement('div');
                    elt.innerHTML = build_comment_html(comment);
                    container.appendChild(elt);
                })
            })
        container.style.display = 'block';
        howto.href = html_issues_url;
    }

    find_comments_url(list_comments);
}
