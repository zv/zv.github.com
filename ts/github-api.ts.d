
interface GHFetch<T> {
  (url: string): Promise<T>
}

type URLString = string;

export type GithubUser = {
  login: string,
  id: number,
  node_id: string,
  avatar_url?: string,
  gravatar_id?: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: string,
  site_admin: boolean,
}

type Issue = {
  id: number,
  node_id: string,
  url: string,
  repository_url: string,
  labels_url: string,
  comments_url: string,
  events_url: string,
  html_url: string,
  "number": number,
  state: string,
  title: string,
  body: string,
  body_html: string,
  user: GithubUser,
}

type IssueComment = {
  id: number,
  node_id: string,
  url: string,
  html_url: string,
  body: string,
  body_html: string,
  created_at: string,
  updated_at: string,
  user: GithubUser,
}