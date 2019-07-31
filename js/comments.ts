import { IssueComment, Issue, URLString, fetch } from './github-api'

const build_comment_html = (issue: IssueComment) =>
  `<div class="comment">
    <div class="comment-photo"><img src="${issue.user.avatar_url}" /></div>
    <div class="comment-right">
      <div class="comment-header"><b>${issue.user.login}</b></div>
      <hr />
      <div class="body">${issue.body_html}</div>
    </div>
   </div>`;

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
export const loadGithubComments = (
  load_into: HTMLElement,
  github_id: string,
  repo_issues_url: URLString,
  issue_id: string
) => {
  // Issues must be referenced by their numeric Github ID, `find_comments_url`
  // resolves a local blogpost/page name to that numeric ID.
  const find_comments_url = (repo_issues_url: URLString) =>
    // we append 'created' to ensure only we can create comment threads
    fetch(repo_issues_url)
      .then(json => json.find((issue: Issue) => issue.title === issue_id));

  // Insert posts comments into current page
  const insert_comments = ({ html_url, comments_url }: Issue) =>
    fetch(comments_url)
      .then(comments => comments.map(build_comment_html))
      .then(comments_html => {
        comments_html.forEach((html: string) =>
          load_into.insertAdjacentHTML('afterend', html))
        // now unhide the container.
        load_into.style.display = 'block';
        return comments_html.length
      })
      .then(_count => {
        // set the howto link
        const howto = document.querySelector("a#comment-howto-link");
        howto && howto.setAttribute('href', html_url);
      })

  find_comments_url(`${repo_issues_url}?created=${github_id}`)
    .then(insert_comments)
    .catch(err => console.error("An error occurred while loading comments: ", err));
}
