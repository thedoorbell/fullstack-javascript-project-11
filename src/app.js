import axios from 'axios'
import * as yup from 'yup'
import i18next from 'i18next'
import onChange from 'on-change'
import watch from './view'
import ru from './locales/ru'
import parseRSS from './parser'

const getErrorKey = (error) => {
  if (error.name === 'ValidationError') {
    return error.message
  }
  if (error.name === 'AxiosError') {
    return 'errors.networkError'
  }
  if (error.message === 'XMLParseError') {
    return 'errors.invalidRSS'
  }
}

const validateUrl = (url, feeds) => {
  const addedUrls = feeds.map(feed => feed.url)
  const schema = yup.string().url().required().notOneOf(addedUrls)

  return schema
    .validate(url)
    .then(() => null)
    .catch(error => error.message)
}

const getData = (url) => {
  const encodedUrl = encodeURIComponent(`${url}`)
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodedUrl}`, { timeout: 10000 })
}

const update = (state) => {
  const { feeds, posts: addedPosts } = state

  Promise.all(
    feeds.map(feed => getData(feed.url)
      .then((response) => {
        const { posts } = parseRSS(response.data.contents)
        const oldPosts = addedPosts.filter(post => post.feedId === feed.id)
        const newPosts = posts.filter(post => !oldPosts.find(p => p.link === post.link))

        if (newPosts.length > 0) {
          const postForUpdate = newPosts.map((post, i) => ({
            id: state.posts.length + i + 1,
            feedId: feed.id,
            ...post,
          }))
          state.posts.unshift(...postForUpdate)
        }
      })),
  ).finally(() => setTimeout(update, 5000, state))
}

export const i18n = i18next.createInstance()

export default () => {
  i18n.init({
    lng: 'ru',
    resources: {
      ru,
    },
  })
  yup.setLocale({
    mixed: {
      required: i18n.t('errors.required'),
      notOneOf: i18n.t('errors.notOneOf'),
    },
    string: {
      url: i18n.t('errors.url'),
    },
  })

  const state = {
    feeds: [],
    posts: [],
    form: {
      isValid: false,
      error: null,
    },
    loadingProcess: {
      status: 'idle', // loading, success, failure
      error: null,
    },
    ui: {
      seenPosts: new Set(),
    },
  }

  const watchedState = onChange(state, (path, value) => {
    view.render(path, value)
  })
  const view = watch(watchedState)

  const loadData = (url) => {
    watchedState.loadingProcess = { status: 'loading' }

    getData(url)
      .then((response) => {
        const parsedData = parseRSS(response.data.contents)
        const feed = {
          id: watchedState.feeds.length + 1,
          url,
          ...parsedData.feed,
        }
        const posts = parsedData.posts.map((post, i) => ({
          id: watchedState.posts.length + i + 1,
          feedId: feed.id,
          ...post,
        }))

        watchedState.feeds.push(feed)
        watchedState.posts.push(...posts)
        watchedState.loadingProcess = { status: 'success' }
      })
      .catch((error) => {
        watchedState.loadingProcess = { status: 'failure', error: getErrorKey(error) }
      })
  }

  const form = document.querySelector('.rss-form')
  const input = document.querySelector('#url-input')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value

    validateUrl(url, state.feeds).then((error) => {
      if (error) {
        watchedState.form = { error, isValid: false }
        return
      }

      watchedState.form = { isValid: true }
      loadData(url)
    })
  })

  setTimeout(update, 5000, watchedState)
}
