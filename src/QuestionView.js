export class QuestionView {
  #root

  constructor(root) {
    this.#root = root
  }

  renderLayout() {
    this.#root.innerHTML = `
      <h1 id="activity-title"></h1>
      <div id="round-progress" role="img"></div>
      <h2 id="question"></h2>

      <button type="button" id="listen" aria-label="Hear the instruction">
        🔊
      </button>
      <p id="audio-message" role="status"></p>

      <button
        type="button"
        id="check"
        aria-label="Check selected circles"
        hidden
        disabled
      >
        ✓ Check
      </button>

      <p id="objects" role="img"></p>
      <p id="letter-word" hidden></p>
      <div id="answers"></div>
      <p id="feedback" role="status"></p>

      <button type="button" id="next" aria-label="Continue" hidden>
        ➜
      </button>
    `
  }
  showAnswerFeedback(correct, selectedButton) {
    selectedButton.classList.add(correct ? 'correct' : 'incorrect')

    const mark = document.createElement('span')
    mark.setAttribute('aria-hidden', 'true')
    mark.textContent = correct ? ' ✓' : ' ✕'
    selectedButton.append(mark)

    const feedback = this.#root.querySelector('#feedback')

    const face = document.createElement('span')
    face.className = 'feedback-face'
    face.setAttribute('aria-hidden', 'true')
    face.textContent = correct ? '😊' : '🙁'

    const message = document.createElement('span')
    message.className = 'visually-hidden'
    message.textContent = correct
      ? 'Correct. Well done!'
      : 'Incorrect. We can practise this again.'

    feedback.replaceChildren(face, message)
  }
  showProgress(answered, total) {
    const progress = this.#root.querySelector('#round-progress')

    progress.setAttribute(
      'aria-label',
      `${answered} of ${total} questions answered`,
    )

    progress.replaceChildren()

    for (let index = 0; index < total; index += 1) {
      const dot = document.createElement('span')
      dot.className = 'progress-dot'
      dot.setAttribute('aria-hidden', 'true')

      if (index < answered) {
        dot.classList.add('completed')
      }

      progress.append(dot)
    }
  }
}
