export class ActivityMenuView {
  #root

  constructor(root) {
    this.#root = root
  }

  show(player, onSelect) {
    this.#root.innerHTML = `
      <h1>Learn & Play</h1>
      <p id="player-greeting"></p>
      <p>Choose an activity</p>

      <div>
        <button type="button" class="activity shapes" id="shapes">
          <span class="activity-picture" aria-hidden="true">
            <span class="shape-symbol shape-circle">●</span>
            <span class="shape-symbol shape-triangle">▲</span>
            <span class="shape-symbol shape-square">■</span>
          </span>
          <span>Shapes</span>
        </button>

        <button type="button" class="activity colours" id="colours">
          <span class="activity-picture colour-picture" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
          <span>Colours</span>
        </button>

        <button type="button" class="activity counting" id="counting">
          <span class="activity-picture" aria-hidden="true">1 2 3</span>
          <span>Counting</span>
        </button>

        <button type="button" class="activity letters" id="letters">
          <span class="activity-picture" aria-hidden="true">A B C</span>
          <span>Letters</span>
        </button>
      </div>
    `

    this.#root.querySelector('#player-greeting').textContent =
      `${player.avatar} Hello, ${player.nickname}!`

    this.#root.querySelector('#shapes').addEventListener('click', () => {
      onSelect('Shapes')
    })

    this.#root.querySelector('#colours').addEventListener('click', () => {
      onSelect('Colours')
    })

    this.#root.querySelector('#counting').addEventListener('click', () => {
      onSelect('Counting')
    })

    this.#root.querySelector('#letters').addEventListener('click', () => {
      onSelect('Letters')
    })
  }
}
