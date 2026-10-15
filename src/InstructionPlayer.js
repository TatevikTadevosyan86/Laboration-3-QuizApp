export class InstructionPlayer {
  #audio = null

  async play(fileName) {
    this.stop()

    const audio = new Audio(
      `${import.meta.env.BASE_URL}audio/${fileName}.wav`
    )

    this.#audio = audio

    try {
      await audio.play()
      return true
    } catch {
      return false
    }
  }

  stop() {
    if (this.#audio) {
      this.#audio.pause()
      this.#audio.currentTime = 0
      this.#audio = null
    }
  }
}