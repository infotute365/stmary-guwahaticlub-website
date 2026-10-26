import test from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'

test('frontend recovers concurrent expired sessions once, retries calls, and preserves POST refresh', async () => {
  const previous = axios.defaults.adapter
  let valid = false
  let refreshes = 0
  let calls = 0
  axios.defaults.adapter = async config => {
    if (config.url.endsWith('/auth/refresh-token')) {
      refreshes++
      assert.equal(config.method, 'post')
      await new Promise(resolve => setImmediate(resolve))
      valid = true
      return { status: 200, data: { message: 'Token refreshed' }, config, headers: {} }
    }
    if (config.url === '/auth/session') {
      calls++
      if (!valid) throw new axios.AxiosError('Expired', 'ERR_BAD_REQUEST', config, {}, { status: 401, data: {}, config })
      return { status: 200, data: { email: 'fixture@example.com', role: 'admin' }, config, headers: {} }
    }
    if (config.url === '/circulars') return { status: 200, data: [], config, headers: {} }
    throw new Error('Unexpected frontend request')
  }
  try {
    const api = await import('../src/services/api.js')
    const sessions = await Promise.all([api.getSession(), api.getSession()])
    assert.equal(refreshes, 1)
    assert.equal(calls, 4)
    assert.equal(sessions[0].role, 'admin')
    valid = false
    assert.deepEqual(await api.getCirculars(true), [])
    assert.equal(refreshes, 2)
  } finally { axios.defaults.adapter = previous }
})
