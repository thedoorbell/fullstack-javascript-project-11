import { i18n } from './app'

const watch = (state) => {
  const elements = {
    input: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    button: document.querySelector('.rss-form button'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalButton: document.querySelector('.full-article'),
  }

  const showNegativeFeedback = () => {
    elements.input.classList.add('is-invalid')
    elements.feedback.classList.remove('text-success')
    elements.feedback.classList.add('text-danger')
  }

  const render = (path, value) => {
    if (path === 'form') {
      switch (value.isValid) {
        case false:
          showNegativeFeedback()
          elements.feedback.textContent = state.form.error
          break
        case true:
          elements.input.classList.remove('is-invalid')
          elements.feedback.textContent = ''
          break
        default:
          break
      }
    }
    if (path === 'loadingProcess') {
      switch (value.status) {
        case 'failure':
          showNegativeFeedback()
          elements.feedback.textContent = i18n.t(state.loadingProcess.error)
          elements.button.disabled = false
          break
        case 'loading':
          elements.button.disabled = true
          break
        case 'success':
          elements.button.disabled = false
          elements.feedback.classList.replace('text-danger', 'text-success')
          elements.feedback.textContent = i18n.t('success')
          elements.input.value = ''
          elements.input.focus()
          break
        default:
          break
      }
    }
    if (path === 'feeds') {
      renderFeeds()
    }
    if (path === 'posts' || path === 'ui.seenPosts') {
      renderPosts()
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
      a.classList.add('fw-bold')
      a.setAttribute('href', post.link)
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      a.dataset.id = post.id
      if (state.ui.seenPosts.has(post)) {
        a.classList.replace('fw-bold', 'fw-normal')
      }

      const button = document.createElement('button')
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.setAttribute('type', 'button')
      button.setAttribute('data-bs-toggle', 'modal')
      button.setAttribute('data-bs-target', '#modal')
      button.dataset.id = post.id

      a.textContent = post.title
      button.textContent = i18n.t('view')

      Array.from([a, button]).forEach((el) => {
        el.addEventListener('click', () => {
          elements.modalBody.textContent = post.description
          elements.modalTitle.textContent = post.title
          elements.modalButton.href = post.link
          if (!state.ui.seenPosts.has(post)) {
            state.ui.seenPosts.add(post)
          }
        })
      })

      postList.append(li)
      li.append(a)
      li.append(button)
    })

    elements.posts.append(postList)
  }

  return { render }
}

export default watch
