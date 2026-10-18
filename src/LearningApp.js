import { QuizSession } from 'quiz-engine'

export class LearningApp {
  #questionBank
  #playerSetupView
  #activityMenuView
  #questionView
  #resultsView
  #playerStorage
  #scoreStorage
  #instructionPlayer

  #player = {
    nickname: 'Little Explorer',
    avatar: '🐱',
  }

  #session
  #activity
  #isRetryRound = false
  #roundQuestionCount = 0
  #selectedAnswers = new Set()

  constructor({
    questionBank,
    playerSetupView,
    playerStorage,
    scoreStorage,
    instructionPlayer,
    activityMenuView,
    resultsView,
    questionView,
  }) {
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

  #startShapes() {
    const quiz = this.#questionBank.createShapesQuiz()
    this.#startActivity('Shapes', quiz)
  }

  #startColours() {
    const quiz = this.#questionBank.createColoursQuiz()
    this.#startActivity('Colours', quiz)
  }

  #startCounting() {
    const quiz = this.#questionBank.createCountingQuiz()
    this.#startActivity('Counting', quiz)
  }

  #startLetters() {
    const quiz = this.#questionBank.createLettersQuiz()
    this.#startActivity('Letters', quiz)
  }

  #startActivity(activity, quiz) {
    this.#activity = activity
    this.#isRetryRound = false
    this.#roundQuestionCount = quiz.getQuestionCount()
    this.#session = new QuizSession(quiz)
    this.#showQuestion()
  }

  #showQuestion() {
    const question = this.#session.getCurrentQuestion()

    this.#selectedAnswers.clear()
    this.#instructionPlayer.stop()
    this.#questionView.renderLayout()
    this.#questionView.showHeading(question)
    this.#questionView.renderContent(question)
    this.#questionView.renderAnswers(
      question,
      (index, button) => {
        this.#submitAnswer(index, button)
      },
      (index, button) => {
        this.#toggleColour(index, button)
      },
    )
    this.#questionView.bindInstructionButton(() => {
      const fileName = this.#getInstructionFile(question)
      return this.#instructionPlayer.play(fileName)
    })
    this.#questionView.bindCheckButton(question, (button) => {
      this.#submitAnswer([...this.#selectedAnswers], button)
    })

    this.#questionView.bindNextButton(() => {
      this.#continueQuiz()
    })
    this.#updateProgress()
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
    const hasSelections = this.#selectedAnswers.size > 0

    this.#questionView.showColourSelection(button, selected)
    this.#questionView.setCheckEnabled(hasSelections)
  }

  #submitAnswer(answer, selectedButton) {
    this.#questionView.disableAnswers()

    const question = this.#session.getCurrentQuestion()
    const correct = this.#session.submitAnswer(answer)

    this.#updateProgress()
    this.#questionView.revealCompletedWord(question)
    this.#questionView.showAnswerFeedback(correct, selectedButton)
    this.#questionView.showNextButton()
  }

  #updateProgress() {
    const answered = this.#session.getAnswerHistory().length

    this.#questionView.showProgress(answered, this.#roundQuestionCount)
  }

  #continueQuiz() {
    if (this.#session.isComplete()) {
      this.#showResults()
      return
    }
    this.#showQuestion()
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
}
