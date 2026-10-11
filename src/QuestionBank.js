import { Question, Quiz } from 'quiz-engine'

export class QuestionBank {
  #objectCounts = new WeakMap()
  #shapes = new WeakMap()

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
    { shape: '●', options: ['●', '▲', '■'], correctIndex: 0 },
    { shape: '▲', options: ['■', '●', '▲'], correctIndex: 2 },
    { shape: '■', options: ['▲', '■', '●'], correctIndex: 1 },
    { shape: '●', options: ['■', '●', '▲'], correctIndex: 1 },
    { shape: '▲', options: ['▲', '■', '●'], correctIndex: 0 },
  ]

  for (const data of questions) {
    const question = new Question(
      'Find the matching shape',
      data.options,
      data.correctIndex,
      'Shapes'
    )
this.#shapes.set(question, data.shape)
    quiz.addQuestion(question)
  }

  return quiz
}
getShape(question) {
  return this.#shapes.get(question)
}
}