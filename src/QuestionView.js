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
}
