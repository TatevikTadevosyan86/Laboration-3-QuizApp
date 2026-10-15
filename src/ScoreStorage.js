export class ScoreStorage {
  #key = 'learn-and-play-scores'
  #activities = ['Counting', 'Shapes', 'Colours', 'Letters']

  getActivityScore(activity) {
    const scores = this.#load()

    return scores[activity] ?? {
      latest: 0,
      best: 0,
      rounds: 0,
    }
  }
   recordResult(activity, score) {
    if (
      !this.#activities.includes(activity) ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > 5
    ) {
      throw new Error('Invalid activity or score.')
    }
const scores = this.#load()
    const previous = this.getActivityScore(activity)

    scores[activity] = {
      latest: score,
      best: Math.max(previous.best, score),
      rounds: previous.rounds + 1,
    }
 try {
      localStorage.setItem(this.#key, JSON.stringify(scores))
      return true
    } catch {
      return false
    }
  }
  #load() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.#key))

      if (!saved || typeof saved !== 'object') {
        return {}
      }

      const scores = {}

      for (const activity of this.#activities) {
        const record = saved[activity]

        if (
          Number.isInteger(record?.latest) &&
          record.latest >= 0 &&
          record.latest <= 5 &&
          Number.isInteger(record.best) &&
          record.best >= record.latest &&
          record.best <= 5 &&
          Number.isInteger(record.rounds) &&
          record.rounds > 0
        ) {
          scores[activity] = record
        }
      }

      return scores
    } catch {
      return {}
    }
  }
}