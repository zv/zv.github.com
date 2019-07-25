
export interface GHFetch<T> {
  (url: string): Promise<T>
}

export type URLString = string;

type GithubUser = {
  login: string,
  id: number,
  node_id: string,
  avatar_url?: string,
  gravatar_id?: string,
  url: string,
  html_url: URLString,
  followers_url: URLString,
  following_url: URLString,
  gists_url: URLString,
  starred_url: URLString,
  subscriptions_url: URLString,
  organizations_url: URLString,
  repos_url: URLString,
  events_url: URLString,
  received_events_url: URLString,
  type: string,
  site_admin: boolean,
}

export type Issue = {
  id: number,
  node_id: string,
  url: string,
  repository_url: URLString,
  labels_url: URLString,
  comments_url: URLString,
  events_url: URLString,
  html_url: URLString,
  "number": number,
  state: string,
  title: string,
  body: string,
  body_html: string,
  user: GithubUser,
}

export type IssueComment = {
  id: number,
  node_id: string,
  url: string,
  html_url: URLString,
  body: string,
  body_html: string,
  created_at: string,
  updated_at: string,
  user: GithubUser,
}

export const fetch: GHFetch<any> = (url: URLString) =>
  new Promise((ok, fail) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(_progressEvt) {
      let result = this.responseText;
      try {
        result = JSON.parse(result)
      } catch (e) { }
      ok(result)
    });
    xhr.addEventListener("error", fail)
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "application/vnd.github.v3.html+json")
    xhr.send();
  })
