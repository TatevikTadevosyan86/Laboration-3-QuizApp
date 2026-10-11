import { QuizSession } from 'quiz-engine'
import { QuestionBank } from './QuestionBank.js'

export class LearningApp {
  #root
  #questionBank = new QuestionBank()
  #session

  constructor(root) {
    this.#root = root;
  }
  start() {
    this.#showMenu();
  }
  #showMenu() {
  this.#root.innerHTML = `
    <h1>Learn & Play</h1>
    <p>Choose an activity</p>
    <div>
      <button type="button" class="activity shapes" disabled>Shapes</button>
<button type="button" class="activity colours" disabled>Colours</button>
<button type="button" class="activity counting" id="counting">Counting</button>
<button type="button" class="activity letters" disabled>Letters</button>
    </div>
  `

  this.#root.querySelector('#counting').addEventListener('click', () => {
    this.#startCounting()
  })
}
  #startCounting() {
    const quiz = this.#questionBank.createCountingQuiz()
    this.#session = new QuizSession(quiz)
    this.#showQuestion()
  }
  #showQuestion() {
  const question = this.#session.getCurrentQuestion()
  const count = this.#questionBank.getObjectCount(question)

  this.#root.innerHTML = `
    <h1>Counting</h1>
    <h2 id="question"></h2>
    <p id="objects" role="img"></p>
    <div id="answers"></div>
    <p id="feedback" role="status"></p>
    <button type="button" id="next" aria-label="Continue" hidden>
      ➜
    </button>
  `

  this.#root.querySelector('#question').textContent = question.getText()

  const objects = this.#root.querySelector('#objects')
  objects.textContent = '🍎 '.repeat(count)
  objects.setAttribute(
    'aria-label',
    `${count} ${count === 1 ? 'apple' : 'apples'}`
  )

  const answers = this.#root.querySelector('#answers')

  for (const [index, option] of question.getOptions().entries()) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = option

    button.addEventListener('click', () => {
      this.#submitAnswer(index,button)
    })

    answers.append(button)
  }

  this.#root.querySelector('#next').addEventListener('click', () => {
    this.#continueQuiz()
  })
}
  #submitAnswer(answerIndex, selectedButton) {
  const buttons = this.#root.querySelectorAll('#answers button')

  for (const button of buttons) {
    button.disabled = true
  }

  const correct = this.#session.submitAnswer(answerIndex)

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

#showResults() {
  const results = this.#session.getResults()
  const retryQuiz = this.#session.createRetryQuiz()
  const hasMistakes = retryQuiz.getQuestionCount() > 0

  this.#root.innerHTML = `
    <h1>Round complete! 🌟</h1>
    <p id="result"></p>
    <button type="button" id="retry" hidden>
      🔄 Practise again
    </button>
    <button type="button" id="menu">
      🏠 Back to activities
    </button>
  `

  this.#root.querySelector('#result').textContent =
    `${results.score} / ${results.maxScore}`

  const retryButton = this.#root.querySelector('#retry')
  retryButton.hidden = !hasMistakes

  retryButton.addEventListener('click', () => {
    this.#session = new QuizSession(retryQuiz)
    this.#showQuestion()
  })

  this.#root.querySelector('#menu').addEventListener('click', () => {
    this.#showMenu()
  })
}
}
