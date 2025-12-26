export default (data) => {
  const rssData = new DOMParser().parseFromString(data, 'application/xml')
  const errorNode = rssData.querySelector('parsererror')

  if (errorNode) {
    throw new Error('XMLParseError')
  }

  const feed = {
    title: rssData.querySelector('channel > title').textContent,
    description: rssData.querySelector('channel > description').textContent,
  }
  const posts = [...rssData.querySelectorAll('item')].map(post => ({
    title: post.querySelector('title').textContent,
    link: post.querySelector('link').textContent,
    description: post.querySelector('description').textContent,
  }))

  return { feed, posts }
}
