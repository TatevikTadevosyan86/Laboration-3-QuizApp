import test from 'node:test'
import assert from 'node:assert/strict'
import { ScoreStorage } from '../src/ScoreStorage.js'

class MemoryStorage {
  #values = new Map()

  getItem(key) {
    return this.#values.get(key) ?? null
  }

  setItem(key, value) {
    this.#values.set(key, String(value))
  }
}

test('keeps the best score and counts full rounds separately by activity', () => {
  const originalStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    'localStorage',
  )

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: new MemoryStorage(),
  })

  try {
    const storage = new ScoreStorage()

    assert.equal(storage.recordResult('Counting', 3), true)
    assert.equal(storage.recordResult('Counting', 2), true)
    assert.equal(storage.recordResult('Letters', 5), true)

    const restoredStorage = new ScoreStorage()

    assert.deepEqual(restoredStorage.getActivityScore('Counting'), {
      latest: 2,
      best: 3,
      rounds: 2,
    })

    assert.deepEqual(restoredStorage.getActivityScore('Letters'), {
      latest: 5,
      best: 5,
      rounds: 1,
    })
  } finally {
    if (originalStorage) {
      Object.defineProperty(globalThis, 'localStorage', originalStorage)
    } else {
      delete globalThis.localStorage
    }
  }
})
