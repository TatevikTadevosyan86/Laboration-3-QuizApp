import { Question, Quiz } from 'quiz-engine'

export class QuestionBank {
  #objectCounts = new WeakMap()
  #shapePatterns = new WeakMap()

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
  createShapesQuiz() {
  const quiz = new Quiz()

  const questions = [
    { pattern: ['●', '▲', '●', '▲'], options: ['●', '▲', '■'], correctIndex: 0 },
    { pattern: ['▲', '■', '▲', '■'], options: ['■', '●', '▲'], correctIndex: 2 },
    { pattern: ['■', '●', '■', '●'], options: ['▲', '■', '●'], correctIndex: 1 },
    { pattern: ['●', '■', '●', '■'], options: ['■', '●', '▲'], correctIndex: 1 },
    { pattern: ['▲', '●', '▲', '●'], options: ['▲', '■', '●'], correctIndex: 0 },
  ]

  for (const data of questions) {
    const question = new Question(
      'Which shape comes next?',
      data.options,
      data.correctIndex,
      'Shapes'
    )
this.#shapePatterns.set(question, data.pattern)
    quiz.addQuestion(question)
  }

  return quiz
}
getShapePattern(question) {
  return this.#shapePatterns.get(question)
}
}