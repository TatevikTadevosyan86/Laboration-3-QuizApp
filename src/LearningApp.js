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
  #activityMenuView
  #resultsView
  #questionView

  constructor(
    root,
    {
      questionBank,
      playerSetupView,
      playerStorage,
      scoreStorage,
      instructionPlayer,
      activityMenuView,
      resultsView,
      questionView,
    },
  ) {
    this.#root = root
    this.#questionBank = questionBank
    this.#playerStorage = playerStorage
    this.#scoreStorage = scoreStorage
    this.#instructionPlayer = instructionPlayer
    this.#playerSetupView = playerSetupView
    this.#activityMenuView = activityMenuView
    this.#resultsView = resultsView
    this.#questionView = questionView
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
    this.#activityMenuView.show(this.#player, (activity) => {
      if (activity === 'Shapes') {
        this.#startShapes()
      } else if (activity === 'Colours') {
        this.#startColours()
      } else if (activity === 'Counting') {
        this.#startCounting()
      } else if (activity === 'Letters') {
        this.#startLetters()
      }
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
    this.#questionView.renderLayout()

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

    this.#questionView.showProgress(answered, this.#roundQuestionCount)
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
    this.#questionView.showAnswerFeedback(correct, selectedButton)

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

    const progress = this.#scoreStorage.getActivityScore(this.#activity)
    const retryQuiz = this.#session.createRetryQuiz()

    const summary = {
      score: results.score,
      maxScore: results.maxScore,
      best: progress.best,
      rounds: progress.rounds,
      scoreSaved,
      canRetry: retryQuiz.getQuestionCount() > 0,
    }

    this.#resultsView.show(
      summary,
      () => {
        this.#startRetryRound(retryQuiz)
      },
      () => {
        this.#showMenu()
      },
    )
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
