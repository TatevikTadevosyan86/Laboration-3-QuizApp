import Field from 'laboration-2/src/Field.js'
import Validation from 'laboration-2/src/Validation.js'
import { MinLengthRule, MaxLengthRule } from 'laboration-2/src/Rule.js'

export class PlayerNameValidator {
  #validation = new Validation()

  constructor() {
    const nickname = new Field('nickname')

    nickname.addRule(
      new MinLengthRule(2, 'Please enter at least 2 characters.'),
    )

    nickname.addRule(
      new MaxLengthRule(20, 'Please enter no more than 20 characters.'),
    )

    this.#validation.addField(nickname)
  }

  validate(name) {
    const nickname = name.trim()
    const result = this.#validation.validate({ nickname })

    return {
      valid: result.success,
      nickname: nickname || 'Little Explorer',
      errors: result.errors.map((error) => error.errorMessage),
    }
  }
}
