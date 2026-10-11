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
      <button type="button" disabled>Shapes</button>
      <button type="button" disabled>Colours</button>
      <button type="button" id="counting">Counting</button>
      <button type="button" disabled>Letters</button>
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

  this.#root.innerHTML = `
    <h1>Counting</h1>
    <h2 id="question"></h2>
    <p role="img" aria-label="One apple">🍎</p>
    <div id="answers"></div>
    <p id="feedback" role="status"></p>
  `

  this.#root.querySelector('#question').textContent = question.getText()

  const answers = this.#root.querySelector('#answers')
  const options = question.getOptions()

  for (const [index, option] of options.entries()) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = option

    button.addEventListener('click', () => {
      this.#submitAnswer(index)
    })

    answers.append(button)
  }
}
  #submitAnswer(answerIndex) {
  const buttons = this.#root.querySelectorAll('#answers button')

  for (const button of buttons) {
    button.disabled = true
  }

  const correct = this.#session.submitAnswer(answerIndex)
  const feedback = this.#root.querySelector('#feedback')

  feedback.textContent = correct
    ? 'Well done!'
    : 'Good try! We can practise this again.'
}
}
