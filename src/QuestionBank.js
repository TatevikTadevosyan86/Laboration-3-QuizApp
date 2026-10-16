import { Question, MultipleChoiceQuestion, Quiz } from 'quiz-engine'

export class QuestionBank {
  #objectCounts = new WeakMap()
  #shapePatterns = new WeakMap()
  #colours = new WeakMap()
  #letterPictures = new WeakMap()

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
        'Counting',
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
      {
        pattern: ['●', '▲', '●', '▲'],
        options: ['●', '▲', '■'],
        correctIndex: 0,
      },
      {
        pattern: ['▲', '■', '▲', '■'],
        options: ['■', '●', '▲'],
        correctIndex: 2,
      },
      {
        pattern: ['■', '●', '■', '●'],
        options: ['▲', '■', '●'],
        correctIndex: 1,
      },
      {
        pattern: ['●', '■', '●', '■'],
        options: ['■', '●', '▲'],
        correctIndex: 1,
      },
      {
        pattern: ['▲', '●', '▲', '●'],
        options: ['▲', '■', '●'],
        correctIndex: 0,
      },
    ]

    for (const data of questions) {
      const question = new Question(
        'Which shape comes next?',
        data.options,
        data.correctIndex,
        'Shapes',
      )
      this.#shapePatterns.set(question, data.pattern)
      quiz.addQuestion(question)
    }

    return quiz
  }
  getShapePattern(question) {
    return this.#shapePatterns.get(question)
  }
  createColoursQuiz() {
    const quiz = new Quiz()
    const questions = [
      { colour: 'Red', dots: ['Red', 'Blue', 'Red'] },
      { colour: 'Blue', dots: ['Yellow', 'Blue', 'Green', 'Blue'] },
      { colour: 'Yellow', dots: ['Yellow', 'Red', 'Yellow', 'Blue', 'Yellow'] },
      { colour: 'Green', dots: ['Red', 'Green', 'Blue', 'Yellow'] },
      {
        colour: 'Purple',
        dots: ['Purple', 'Blue', 'Purple', 'Yellow', 'Purple'],
      },
    ]

    for (const data of questions) {
      const indexes = data.dots.flatMap((colour, index) =>
        colour === data.colour ? [index] : [],
      )
      const question = new MultipleChoiceQuestion(
        `Tap all the ${data.colour.toLowerCase()} circles`,
        data.dots,
        indexes,
        'Colours',
      )
      this.#colours.set(question, data)
      quiz.addQuestion(question)
    }
    return quiz
  }

  getColour(question) {
    return this.#colours.get(question).colour
  }

  getColourDots(question) {
    return [...this.#colours.get(question).dots]
  }
  createLettersQuiz() {
    const quiz = new Quiz()

    const questions = [
      {
        picture: '☀️',
        word: 'sun',
        options: ['S', 'B', 'C'],
      },
      {
        picture: '🐱',
        word: 'cat',
        options: ['D', 'C', 'B'],
      },
      {
        picture: '🐶',
        word: 'dog',
        options: ['B', 'S', 'D'],
      },
      {
        picture: '🚌',
        word: 'bus',
        options: ['B', 'C', 'S'],
      },
      {
        picture: '🐟',
        word: 'fish',
        options: ['S', 'F', 'D'],
      },
    ]

    for (const data of questions) {
      const firstLetter = data.word[0].toUpperCase()
      const correctIndex = data.options.indexOf(firstLetter)

      const question = new Question(
        'Choose the missing first letter',
        data.options,
        correctIndex,
        'Letters',
      )

      this.#letterPictures.set(question, {
        picture: data.picture,
        word: data.word,
      })

      quiz.addQuestion(question)
    }

    return quiz
  }

  getLetterPicture(question) {
    return { ...this.#letterPictures.get(question) }
  }
}
