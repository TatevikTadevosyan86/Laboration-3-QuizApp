export class QuestionView {
  #root
  #questionBank
  constructor(root, questionBank) {
    this.#root = root
    this.#questionBank = questionBank
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
  #renderCounting(question, container) {
    const count = this.#questionBank.getObjectCount(question)

    container.textContent = '🍎 '.repeat(count)
    container.setAttribute(
      'aria-label',
      `${count} ${count === 1 ? 'apple' : 'apples'}`,
    )
  }
  #renderShapes(question, container) {
    const pattern = this.#questionBank.getShapePattern(question)

    const names = { '●': 'Circle', '▲': 'Triangle', '■': 'Square' }
    for (const shape of pattern) {
      container.append(this.#createShapeSymbol(shape))
    }

    const missing = document.createElement('span')
    missing.textContent = '?'
    container.append(missing)

    container.setAttribute(
      'aria-label',
      pattern.map((shape) => names[shape]).join(', ') + ', what comes next?',
    )
  }
  #renderLetters(question, container) {
    const data = this.#questionBank.getLetterPicture(question)
    container.textContent = data.picture
    container.setAttribute('aria-label', data.word)

    const word = this.#root.querySelector('#letter-word')
    word.hidden = false
    word.textContent = '_' + data.word.slice(1)
  }
  renderContent(question) {
    const objects = this.#root.querySelector('#objects')

    if (category === 'Counting') {
      this.#renderCounting(question, objects)
    } else if (category === 'Shapes') {
      this.#renderShapes(question, objects)
    } else if (category === 'Colours') {
      objects.hidden = true
    } else if (category === 'Letters') {
      this.#renderLetters(question, objects)
    }
  }
  #createShapeSymbol(shape) {
    const classes = {
      '●': 'shape-circle',
      '▲': 'shape-triangle',
      '■': 'shape-square',
    }
    const symbol = document.createElement('span')
    symbol.className = `shape-symbol ${classes[shape]}`
    symbol.textContent = shape
    symbol.setAttribute('aria-hidden', 'true')
    return symbol
  }
  renderAnswers(question, onAnswer, onToggleColour) {
    const answers = this.#root.querySelector('#answers')

    for (const [index, option] of question.getOptions().entries()) {
      const button = document.createElement('button')
      button.type = 'button'
      if (category === 'Shapes') {
        button.append(this.#createShapeSymbol(option))
        const names = { '●': 'Circle', '▲': 'Triangle', '■': 'Square' }
        button.setAttribute('aria-label', names[option])
      } else if (category === 'Colours') {
        button.append(this.#createColourCircle(option))
        button.setAttribute('aria-label', option + ' circle ' + (index + 1))
        button.setAttribute('aria-pressed', 'false')
      } else {
        button.textContent = option
      }
      button.addEventListener('click', () => {
        if (category === 'Colours') {
          onToggleColour(index, button)
        } else {
          onAnswer(index, button)
        }
      })
      answers.append(button)
    }
  }
  #createColourCircle(colour) {
    const circle = document.createElement('span')
    circle.className = `colour-circle colour-${colour.toLowerCase()}`
    circle.setAttribute('aria-hidden', 'true')
    return circle
  }
  disableAnswers() {
    const buttons = this.#root.querySelectorAll('#answers button')

    for (const button of buttons) {
      button.disabled = true
    }
  }

  showNextButton() {
    const button = this.#root.querySelector('#next')
    button.hidden = false
    button.focus()
  }
  showHeading(question) {
    this.#root.querySelector('#question').textContent = question.getText()

    this.#root.querySelector('#activity-title').textContent =
      question.getCategory()
  }
  revealCompletedWord(question) {
    if (question.getCategory() !== 'Letters') {
      return
    }
    const data = this.#questionBank.getLetterPicture(question)
    const word = this.#root.querySelector('#letter-word')

    word.textContent = data.word
  }
}
