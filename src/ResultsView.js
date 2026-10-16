export class ResultsView {
  #root

  constructor(root) {
    this.#root = root
  }

  show(summary, onRetry, onMenu) {
    this.#root.innerHTML = `
      <h1>Round complete! 🌟</h1>
      <p id="result"></p>
      <p id="activity-progress"></p>
      <p id="save-message" role="status"></p>

      <button type="button" id="retry" hidden>
        🔄 Practise again
      </button>

      <button type="button" id="menu">
        🏠 Back to activities
      </button>
    `

    this.#root.querySelector('#result').textContent =
      `${summary.score} / ${summary.maxScore}`

    const progress = this.#root.querySelector('#activity-progress')

    if (summary.rounds === 0) {
      progress.textContent = 'Complete a full round to save your progress.'
    } else {
      progress.textContent = `⭐ Best: ${summary.best}/5 · Rounds completed: ${summary.rounds}`
    }

    if (!summary.scoreSaved) {
      this.#root.querySelector('#save-message').textContent =
        'Your score could not be saved on this device.'
    }

    const retryButton = this.#root.querySelector('#retry')
    retryButton.hidden = !summary.canRetry

    retryButton.addEventListener('click', () => {
      onRetry()
    })

    this.#root.querySelector('#menu').addEventListener('click', () => {
      onMenu()
    })
  }
}
