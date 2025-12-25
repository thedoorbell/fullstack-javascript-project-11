import axios from 'axios'
import * as yup from 'yup'
import i18next from 'i18next'
import onChange from 'on-change'
import watch from './view'
import { uniqueId } from 'lodash'
import ru from './locales/ru'

const parseRSS = (data) => {
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
  }))

  return { feed, posts }
}

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
      currentPost: '',
      seenPosts: '', // Set?
    },
  }

  const watchedState = onChange(state, (path, value, previousValue) => {
    console.log(path, value)
    view.render(path, value, previousValue)
  })
  const view = watch(watchedState)

  const loadData = (url) => {
    watchedState.loadingProcess = { status: 'loading' }

    const encodedUrl = encodeURIComponent(`${url}`)
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodedUrl}`, { timeout: 10000 })
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
        console.log(error)
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
}
