import test from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'

test('website content service preserves endpoint contracts and existing session recovery', async t => {
  const previous = axios.defaults.adapter
  const requests = []
  let expired = false
  let refreshes = 0
  let rejectConflict = false
  let responseData = { fixture: 'response data' }

  axios.defaults.adapter = async config => {
    if (config.url.endsWith('/auth/refresh-token')) {
      refreshes++
      assert.equal(config.method, 'post')
      assert.equal(config.withCredentials, true)
      await new Promise(resolve => setImmediate(resolve))
      expired = false
      return { status: 200, data: { message: 'Token refreshed' }, config, headers: {} }
    }
    const body = config.data === undefined ? undefined : JSON.parse(config.data)
    requests.push({ method: config.method, url: config.url, params: config.params, body, retried: Boolean(config._sessionRetried) })
    assert.equal(config.withCredentials, true)
    if (expired) throw new axios.AxiosError('Expired', 'ERR_BAD_REQUEST', config, {}, { status: 401, data: { message: 'Invalid session' }, config })
    if (rejectConflict) throw new axios.AxiosError('Conflict', 'ERR_BAD_REQUEST', config, {}, { status: 409, data: { message: 'Content revision conflict' }, config })
    return { status: 200, data: responseData, config, headers: { 'cache-control': 'no-store' } }
  }

  try {
    const api = await import('../src/services/api.js?website-content-service-test')
    const key = 'home.section-1.title / ?#'
    const encoded = encodeURIComponent(key)

    await t.test('published and catalog reads pass the exact page path and return data', async () => {
      requests.length = 0
      assert.equal(await api.getWebsiteContent(), responseData)
      assert.equal(await api.getWebsiteContentCatalog('/about/founders'), responseData)
      assert.deepEqual(requests.map(({ method, url, params }) => ({ method, url, params })), [
        { method: 'get', url: '/website-content', params: { path: '/' } },
        { method: 'get', url: '/website-content/catalog', params: { path: '/about/founders' } }
      ])
      for (const name of ['getWebsiteContent', 'getWebsiteContentCatalog', 'saveWebsiteContent', 'getWebsiteContentHistory', 'restoreWebsiteContent', 'resetWebsiteContent']) assert.equal(api.default[name], api[name])
      for (const name of ['login', 'getCirculars', 'getStaff', 'getGallery', 'getSyllabus', 'uploadImage', 'getFileUrl']) assert.equal(api.default[name], api[name])
    })

    await t.test('save keeps empty strings, zero revisions and optional content type', async () => {
      requests.length = 0
      assert.equal(await api.saveWebsiteContent(key, '', 0), responseData)
      assert.equal(await api.saveWebsiteContent(key, 0, 7, 'number'), responseData)
      assert.deepEqual(requests.map(({ method, url, body }) => ({ method, url, body })), [
        { method: 'put', url: `/website-content/${encoded}`, body: { value: '', expectedRevision: 0 } },
        { method: 'put', url: `/website-content/${encoded}`, body: { value: 0, expectedRevision: 7, contentType: 'number' } }
      ])
    })

    await t.test('history preserves pagination options without inventing defaults', async () => {
      requests.length = 0
      assert.equal(await api.getWebsiteContentHistory(key), responseData)
      assert.equal(await api.getWebsiteContentHistory(key, { before: 0, limit: 20 }), responseData)
      assert.deepEqual(requests.map(({ method, url, params }) => ({ method, url, params })), [
        { method: 'get', url: `/website-content/history/${encoded}`, params: {} },
        { method: 'get', url: `/website-content/history/${encoded}`, params: { before: 0, limit: 20 } }
      ])
    })

    await t.test('restore and reset use POST with exact revision payloads', async () => {
      requests.length = 0
      assert.equal(await api.restoreWebsiteContent(key, 1, 8), responseData)
      assert.equal(await api.resetWebsiteContent(key, 0), responseData)
      assert.deepEqual(requests.map(({ method, url, body }) => ({ method, url, body })), [
        { method: 'post', url: `/website-content/${encoded}/restore`, body: { revision: 1, expectedRevision: 8 } },
        { method: 'post', url: `/website-content/${encoded}/reset`, body: { expectedRevision: 0 } }
      ])
    })

    await t.test('concurrent expired operations share refresh and keep original mutation payloads', async () => {
      requests.length = 0
      expired = true
      const results = await Promise.all([
        api.saveWebsiteContent(key, '', 0, 'text'),
        api.restoreWebsiteContent(key, 1, 9),
        api.resetWebsiteContent(key, 10),
        api.getWebsiteContentCatalog('/')
      ])
      assert.equal(refreshes, 1)
      assert.deepEqual(results, [responseData, responseData, responseData, responseData])
      const attempts = requests.filter(request => request.method !== 'get')
      assert.equal(attempts.length, 6)
      for (const url of [...new Set(attempts.map(request => request.url))]) {
        const pair = attempts.filter(request => request.url === url)
        assert.equal(pair.length, 2)
        assert.deepEqual(pair[1].body, pair[0].body)
        assert.equal(pair[0].retried, false)
        assert.equal(pair[1].retried, true)
      }
    })

    await t.test('409 conflicts propagate without refresh or a silent retry', async () => {
      requests.length = 0
      rejectConflict = true
      await assert.rejects(api.saveWebsiteContent(key, 'new text', 0), error => error.response?.status === 409 && error.response.data.message === 'Content revision conflict')
      assert.equal(refreshes, 1)
      assert.equal(requests.length, 1)
      assert.deepEqual(requests[0].body, { value: 'new text', expectedRevision: 0 })
    })
  } finally { axios.defaults.adapter = previous }
})
