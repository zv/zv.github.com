import {IssueComment, Issue, URLString, fetch} from './github-api'

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
export const load_comments = (
  load_into: HTMLElement,
  github_id: string,
  repo_issues_url: URLString,
  issue_id: string
) => {
  const build_comment_html = (issue: IssueComment) =>
    `<div class="comment">
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

  // Issues must be referenced by their numeric Github ID, `find_comments_url`
  // resolves a local blogpost/page name to that numeric ID.
  const find_comments_url = (repo_issues_url: URLString) =>
    // we append 'created' to ensure only we can create comment threads
    fetch(repo_issues_url)
      .then(json => {
        const issues = json.filter((issue: Issue) => issue.title === issue_id);
        if (issues.length === 1) return issues[0];
        else throw new Error(`Incorrect number of issues: ${issues.length}`);
      });

  // Insert posts comments into current page
  const insert_comments = ({html_url, comments_url}: Issue) => {
    fetch(comments_url)
      .then(comments => {
        let howto = document.querySelector("a#comment-howto-link");
        let container = load_into;

        for (let comment of comments) {
          let elt = document.createElement('div');
          elt.innerHTML = build_comment_html(comment);
          if (!container.appendChild(elt)) {
            throw new Error(`could not append element: ${elt}`);
          }
        }

        // un-hide the container
        container.style.display = 'block';

        if (howto && html_url) {
          howto.setAttribute('href', html_url);
        } else {
          throw new Error("insert_comments: html_url blank");
        }
      })
  }

  find_comments_url(`${repo_issues_url}?created=${github_id}`)
    .then(insert_comments)
    .catch(err => console.error("An error occurred while loading comments: ", err));
}
