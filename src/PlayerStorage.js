export class PlayerStorage {
  #key = 'learn-and-play-player'
  #avatars = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐸']

  load() {
    try {
      const saved = localStorage.getItem(this.#key)

      if (!saved) {
        return null
      }

      const player = JSON.parse(saved)

      if (
        typeof player?.nickname !== 'string' ||
        player.nickname.trim().length < 2 ||
        player.nickname.trim().length > 20 ||
        !this.#avatars.includes(player.avatar)
      ) {
        return null
      }

      return {
        nickname: player.nickname.trim(),
        avatar: player.avatar,
      }
    } catch {
      return null
    }
  }

  save(player) {
    try {
      localStorage.setItem(
        this.#key,
        JSON.stringify({
          nickname: player.nickname,
          avatar: player.avatar,
        }),
      )

      return true
    } catch {
      return false
    }
  }
}
