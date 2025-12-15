const watch = (state) => {
  const elements = {
    input: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    errorMessage: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  }

  const render = (path, value) => {
    if (path === 'form') {
      switch (value.isValid) {
        case false:
          elements.input.classList.add('is-invalid')
          elements.errorMessage.textContent = value.error
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
  }

  const renderFeeds = () => {
    elements.feeds.innerHTML = ''
    /* state.feeds.forEach((feed) => {

    }) */
    elements.input.value = ''
    elements.input.focus()
  }

  return { render }
}

export default watch
