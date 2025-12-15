import axios from 'axios'
import * as yup from 'yup'
import i18next from 'i18next'
import onChange from 'on-change'
import watch from './view'
import { uniqueId } from 'lodash'

const validateUrl = (url, feeds) => {
  const addedUrls = feeds.map(feed => feed.url)
  const schema = yup.string().url().required().notOneOf(addedUrls)

  return schema
    .validate(url)
    .then(() => null)
    .catch(error => error.message)
}

export default () => {
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
    view.render(path, value, previousValue)
  })
  const view = watch(watchedState)

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
      watchedState.feeds.push({ id: uniqueId(), url })
    })
    /* validateUrl(url, urls)
      .then(error => {
        if (error) {
          state.form.isValid = false
          state.form.error = error
          return
        }
        state.form.isValid = true
        loadData(url)
      }) */
  })
}
