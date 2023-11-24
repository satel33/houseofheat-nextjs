const Robots = () => null

export async function getServerSideProps ({ req, res }) {
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 's-maxage=30000, stale-while-revalidate=6000')

  res.write(`Sitemap: https://${req.headers.host}/sitemap.xml

User-agent: *
Allow: /*
Disallow: /api/*`)
  res.end()

  return { props: {} }
}

export default Robots
