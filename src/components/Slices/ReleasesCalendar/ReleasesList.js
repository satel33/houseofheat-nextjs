import ArticlesList from '../Articles/ArticlesList'

export default function ReleasesList ({ page, releases }) {
  return <ArticlesList page={page} articles={releases} countdownDateFormat='MMM DD' />
}
