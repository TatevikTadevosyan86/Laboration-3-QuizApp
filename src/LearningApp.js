import { QuizSession } from 'quiz-engine'

export class LearningApp {
  #root
  #questionBank
  #selectedAnswers = new Set()
  #session
  #playerSetupView
  #playerStorage
  #player = {
    nickname: 'Little Explorer',
    avatar: '🐱',
  }
  #scoreStorage
  #activity
  #isRetryRound = false
  #instructionPlayer
  #roundQuestionCount = 0

  constructor(
    root,
    {
      questionBank,
      playerSetupView,
      playerStorage,
      scoreStorage,
      instructionPlayer,
    },
  ) {
    this.#root = root
    this.#questionBank = questionBank
    this.#playerStorage = playerStorage
    this.#scoreStorage = scoreStorage
    this.#instructionPlayer = instructionPlayer
    this.#playerSetupView = playerSetupView
  }
  start() {
    const savedPlayer = this.#playerStorage.load()

    if (savedPlayer) {
      this.#player = savedPlayer
    }

    this.#showPlayerSetup()
  }

  #showPlayerSetup() {
    this.#playerSetupView.show(this.#player, (player) => {
      this.#player = player
      this.#playerStorage.save(player)
      this.#showMenu()
    })
  }
  #startActivity(activity, quiz) {
    this.#activity = activity
    this.#isRetryRound = false
    this.#roundQuestionCount = quiz.getQuestionCount()
    this.#session = new QuizSession(quiz)
    this.#showQuestion()
  }

  #showMenu() {
    this.#root.innerHTML = `
    <h1>Learn & Play</h1>
    <p id="player-greeting"></p>
    <p>Choose an activity</p>
    <div>
      <button type="button" class="activity shapes" id="shapes"><span class="activity-picture" aria-hidden="true"><span class="shape-symbol shape-circle">●</span> <span class="shape-symbol shape-triangle">▲</span> <span class="shape-symbol shape-square">■</span></span><span>Shapes</span></button>
<button type="button" class="activity colours" id="colours"><span class="activity-picture colour-picture" aria-hidden="true"><i></i><i></i><i></i></span><span>Colours</span></button>
<button type="button" class="activity counting" id="counting"><span class="activity-picture" aria-hidden="true">1 2 3</span><span>Counting</span></button>
<button type="button" class="activity letters"  id="letters"><span class="activity-picture" aria-hidden="true">A B C</span><span>Letters</span></button>
    
</div>
  `

    this.#root.querySelector('#player-greeting').textContent =
      `${this.#player.avatar} Hello, ${this.#player.nickname}!`
    this.#root.querySelector('#counting').addEventListener('click', () => {
      this.#startCounting()
    })

    this.#root.querySelector('#shapes').addEventListener('click', () => {
      this.#startShapes()
    })
    this.#root.querySelector('#colours').addEventListener('click', () => {
      this.#startColours()
    })
    this.#root.querySelector('#letters').addEventListener('click', () => {
      this.#startLetters()
    })
  }

  #startLetters() {
    const quiz = this.#questionBank.createLettersQuiz()
    this.#startActivity('Letters', quiz)
  }

  #startCounting() {
    const quiz = this.#questionBank.createCountingQuiz()
    this.#startActivity('Counting', quiz)
  }

  #renderAnswer(question) {
    const category = question.getCategory()
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
          this.#toggleColour(index, button)
        } else {
          this.#submitAnswer(index, button)
        }
      })
      answers.append(button)
    }
  }

  #renderQuestionLayout() {
    this.#root.innerHTML = `
      <h1 id="activity-title"></h1>
      <div id="round-progress" role="img"></div>
      <h2 id="question"></h2>
      <button type="button" id="listen" aria-label="Hear the instruction">
  🔊
</button>
<p id="audio-message" role="status"></p>
      <button type="button" id="check" aria-label="Check selected circles" hidden disabled>✓ Check</button>
      <p id="objects" role="img"></p>
      <p id="letter-word" hidden></p>
      <div id="answers"></div>
      <p id="feedback" role="status"></p>
      <button type="button" id="next" aria-label="Continue" hidden>➜</button>
    `
  }

  #bindInstructionButton(question) {
    const button = this.#root.querySelector('#listen')
    const message = this.#root.querySelector('#audio-message')

    button.addEventListener('click', async () => {
      const fileName = this.#getInstructionFile(question)
      const played = await this.#instructionPlayer.play(fileName)

      if (message.isConnected) {
        message.textContent = played ? '' : 'The recording could not be played.'
      }
    })
  }
  #bindCheckButton(question) {
    if (question.getCategory() !== 'Colours') {
      return
    }

    const button = this.#root.querySelector('#check')
    button.hidden = false

    this.#root.querySelector('#answers').after(button)

    button.addEventListener('click', () => {
      button.disabled = true
      this.#submitAnswer([...this.#selectedAnswers], button)
    })
  }

  #showQuestion() {
    const question = this.#session.getCurrentQuestion()
    const category = question.getCategory()

    this.#selectedAnswers.clear()
    this.#instructionPlayer.stop()
    this.#renderQuestionLayout()

    this.#root.querySelector('#question').textContent = question.getText()
    this.#root.querySelector('#activity-title').textContent = category

    this.#renderQuestionContent(question)
    this.#renderAnswer(question)
    this.#bindInstructionButton(question)
    this.#bindCheckButton(question)

    this.#root.querySelector('#next').addEventListener('click', () => {
      this.#continueQuiz()
    })

    this.#updateProgress()
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
  #renderQuestionContent(question) {
    const category = question.getCategory()
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
  #updateProgress() {
    const answered = this.#session.getAnswerHistory().length
    const progress = this.#root.querySelector('#round-progress')

    progress.setAttribute(
      'aria-label',
      `${answered} of ${this.#roundQuestionCount} questions answered`,
    )

    progress.replaceChildren()

    for (let index = 0; index < this.#roundQuestionCount; index += 1) {
      const dot = document.createElement('span')
      dot.className = 'progress-dot'
      dot.setAttribute('aria-hidden', 'true')

      if (index < answered) {
        dot.classList.add('completed')
      }

      progress.append(dot)
    }
  }
  #getInstructionFile(question) {
    const category = question.getCategory()

    if (category === 'Letters') {
      return this.#questionBank.getLetterPicture(question).word
    }

    if (category === 'Colours') {
      return this.#questionBank.getColour(question).toLowerCase()
    }

    return category.toLowerCase()
  }
  #toggleColour(index, button) {
    if (this.#selectedAnswers.has(index)) {
      this.#selectedAnswers.delete(index)
    } else {
      this.#selectedAnswers.add(index)
    }
    const selected = this.#selectedAnswers.has(index)
    button.classList.toggle('selected', selected)
    button.setAttribute('aria-pressed', String(selected))
    this.#root.querySelector('#check').disabled =
      this.#selectedAnswers.size === 0
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
  #showAnswerFeedback(correct, selectedButton) {
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
  #revealCompletedWord(question) {
    if (question.getCategory() !== 'Letters') {
      return
    }
    const data = this.#questionBank.getLetterPicture(question)
    const word = this.#root.querySelector('#letter-word')

    word.textContent = data.word
  }

  #submitAnswer(answerIndex, selectedButton) {
    const buttons = this.#root.querySelectorAll('#answers button')

    for (const button of buttons) {
      button.disabled = true
    }

    const question = this.#session.getCurrentQuestion()
    const correct = this.#session.submitAnswer(answerIndex)

    this.#updateProgress()
    this.#revealCompletedWord(question)
    this.#showAnswerFeedback(correct, selectedButton)

    const nextButton = this.#root.querySelector('#next')
    nextButton.hidden = false
    nextButton.focus()
  }

  #continueQuiz() {
    if (this.#session.isComplete()) {
      this.#showResults()
      return
    }
    this.#showQuestion()
  }

  #startShapes() {
    const quiz = this.#questionBank.createShapesQuiz()
    this.#startActivity('Shapes', quiz)
  }
  #renderResultsLayout() {
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
  }
  #showResults() {
    this.#instructionPlayer.stop()
    const results = this.#session.getResults()
    let scoreSaved = true

    if (!this.#isRetryRound) {
      scoreSaved = this.#scoreStorage.recordResult(
        this.#activity,
        results.score,
      )
    }
    const retryQuiz = this.#session.createRetryQuiz()

    this.#renderResultsLayout()

    const progress = this.#scoreStorage.getActivityScore(this.#activity)

    this.#root.querySelector('#activity-progress').textContent =
      progress.rounds === 0
        ? 'Complete a full round to save your progress.'
        : `⭐ Best: ${progress.best}/5 · Rounds completed: ${progress.rounds}`

    if (!scoreSaved) {
      this.#root.querySelector('#save-message').textContent =
        'Your score could not be saved on this device.'
    }
    this.#root.querySelector('#result').textContent =
      `${results.score} / ${results.maxScore}`

    this.#bindRetryButton(retryQuiz)

    this.#root.querySelector('#menu').addEventListener('click', () => {
      this.#showMenu()
    })
  }
  #bindRetryButton(retryQuiz) {
    const retryButton = this.#root.querySelector('#retry')
    retryButton.hidden = !hasMistakes

    retryButton.addEventListener('click', () => {
      this.#isRetryRound = true
      this.#roundQuestionCount = retryQuiz.getQuestionCount()
      this.#session = new QuizSession(retryQuiz)
      this.#showQuestion()
    })
  }

  #startRetryRound(quiz) {
    this.#isRetryRound = true
    this.#roundQuestionCount = quiz.getQuestionCount()
    this.#session = new QuizSession(quiz)
    this.#showQuestion()
  }

  #startColours() {
    const quiz = this.#questionBank.createColoursQuiz()
    this.#startActivity('Colours', quiz)
  }
  #createColourCircle(colour) {
    const circle = document.createElement('span')
    circle.className = `colour-circle colour-${colour.toLowerCase()}`
    circle.setAttribute('aria-hidden', 'true')
    return circle
  }
}
