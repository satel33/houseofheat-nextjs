
async function redirects () {
  return [
    {
      source: '/ads.txt',
      destination: 'https://a.pub.network/houseofheat-co/ads.txt',
      permanent: true,
      locale: false
    }
  ]
}

module.exports = redirects
