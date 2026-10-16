export class PlayerSetupView {
  #root
  #nameValidator

  constructor(root, nameValidator) {
    this.#root = root
    this.#nameValidator = nameValidator
  }

  show(player, onReady) {
    this.#root.innerHTML = `
      <h1>Learn & Play</h1>

      <form id="player-form" novalidate>
        <label for="nickname">Nickname</label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          placeholder="Little Explorer"
          aria-describedby="name-error"
        >

        <fieldset>
          <legend>Choose your animal</legend>
          <div id="avatars"></div>
        </fieldset>

        <p id="name-error" role="alert"></p>
        <button type="submit">▶ Play</button>
      </form>
    `

    this.#root.querySelector('#nickname').value =
      player.nickname === 'Little Explorer' ? '' : player.nickname

    this.#renderAvatars(player.avatar)

    this.#root
      .querySelector('#player-form')
      .addEventListener('submit', (event) => {
        event.preventDefault()
        this.#submitPlayer(onReady)
      })
  }

  #renderAvatars(selectedAvatar) {
    const avatars = [
      { symbol: '🐱', name: 'Cat' },
      { symbol: '🐶', name: 'Dog' },
      { symbol: '🐰', name: 'Rabbit' },
      { symbol: '🦊', name: 'Fox' },
      { symbol: '🐼', name: 'Panda' },
      { symbol: '🐸', name: 'Frog' },
    ]

    const container = this.#root.querySelector('#avatars')

    for (const avatar of avatars) {
      const label = document.createElement('label')
      label.className = 'avatar-choice'

      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = 'avatar'
      radio.value = avatar.symbol
      radio.checked = avatar.symbol === selectedAvatar
      radio.setAttribute('aria-label', avatar.name)

      const picture = document.createElement('span')
      picture.textContent = avatar.symbol
      picture.setAttribute('aria-hidden', 'true')

      label.append(radio, picture)
      container.append(label)
    }
  }

  #submitPlayer(onReady) {
    const input = this.#root.querySelector('#nickname')
    const result = this.#nameValidator.validate(input.value)

    input.setAttribute('aria-invalid', String(!result.valid))
    this.#root.querySelector('#name-error').textContent =
      result.errors.join(' ')

    if (!result.valid) {
      input.focus()
      return
    }

    const avatar = this.#root.querySelector('input[name="avatar"]:checked')

    onReady({
      nickname: result.nickname,
      avatar: avatar.value,
    })
  }
}
