import { i18n } from './app'

const watch = (state) => {
  const elements = {
    input: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    errorMessage: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    button: document.querySelector('.rss-form button'),
  }

  const render = (path, value) => {
    if (path === 'form') {
      switch (value.isValid) {
        case false:
          elements.input.classList.add('is-invalid')
          elements.errorMessage.textContent = state.form.error
          break
        case true:
          elements.input.classList.remove('is-invalid')
          elements.errorMessage.textContent = ''
          break
        default:
          break
      }
    }
    if (path === 'feeds') {
      renderFeeds()
    }
    if (path === 'posts') {
      renderPosts()
    }
    if (path === 'loadingProcess') {
      switch (value.status) {
        case 'failure':
          elements.input.classList.add('is-invalid')
          elements.errorMessage.textContent = i18n.t(state.loadingProcess.error)
          elements.button.disabled = false
          break
        case 'loading':
          elements.button.disabled = true
          break
        case 'success':
          elements.button.disabled = false
          break
        default:
          break
      }
    }
  }

  const renderFeeds = () => {
    elements.feeds.innerHTML = ''

    const card = document.createElement('div')
    card.classList.add('card', 'border-0')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const cardTitle = document.createElement('div')
    cardTitle.classList.add('card-title', 'h4')
    cardTitle.textContent = i18n.t('feeds')

    elements.feeds.append(card)
    card.append(cardBody)
    cardBody.append(cardTitle)

    const feedList = document.createElement('ul')
    feedList.classList.add('list-group', 'border-0', 'rounded-0')

    state.feeds.forEach((feed) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'border-0', 'border-end-0')
      const h3 = document.createElement('h3')
      h3.classList.add('h6', 'm-0')
      const p = document.createElement('p')
      p.classList.add('m-0', 'small', 'text-black-50')

      h3.textContent = feed.title
      p.textContent = feed.description

      feedList.append(li)
      li.append(h3)
      li.append(p)
    })

    elements.feeds.append(feedList)

    elements.input.value = ''
    elements.input.focus()
  }

  const renderPosts = () => {
    elements.posts.innerHTML = ''

    const card = document.createElement('div')
    card.classList.add('card', 'border-0')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const cardTitle = document.createElement('div')
    cardTitle.classList.add('card-title', 'h4')
    cardTitle.textContent = i18n.t('posts')

    elements.posts.append(card)
    card.append(cardBody)
    cardBody.append(cardTitle)

    const postList = document.createElement('ul')
    postList.classList.add('list-group', 'border-0', 'rounded-0')

    state.posts.forEach((post) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
      const a = document.createElement('a')
      a.classList.add('fw-fold')

      a.textContent = post.title
      a.href = post.link

      postList.append(li)
      li.append(a)
    })

    elements.posts.append(postList)
  }

  return { render }
}

export default watch
