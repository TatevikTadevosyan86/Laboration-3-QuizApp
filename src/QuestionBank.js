import { Question, Quiz } from 'quiz-engine'

export class QuestionBank {
  #objectCounts = new WeakMap()

  createCountingQuiz() {
    const quiz = new Quiz()

    const questions = [
      { count: 1, options: ['1', '2', '3'], correctIndex: 0 },
      { count: 2, options: ['1', '2', '3'], correctIndex: 1 },
      { count: 3, options: ['2', '3', '4'], correctIndex: 1 },
      { count: 4, options: ['3', '4', '5'], correctIndex: 1 },
      { count: 5, options: ['3', '4', '5'], correctIndex: 2 },
    ]

    for (const data of questions) {
      const question = new Question(
        'How many apples?',
        data.options,
        data.correctIndex,
        'Counting'
      )

      this.#objectCounts.set(question, data.count)
      quiz.addQuestion(question)
    }

    return quiz
  }

  getObjectCount(question) {
    return this.#objectCounts.get(question)
  }
}