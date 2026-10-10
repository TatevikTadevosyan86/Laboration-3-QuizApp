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
    `
     this.#root.querySelector('#question').textContent = question.getText()

    const answers = this.#root.querySelector('#answers')

    for (const option of question.getOptions()) {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = option
      answers.append(button)
    }
  }
}
