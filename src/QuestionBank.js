import { Question, Quiz } from 'quiz-engine'

export class QuestionBank {
  createCountingQuiz() {
    const quiz = new Quiz()

    quiz.addQuestion(
      new Question('How many apples?', ['1', '2', '3'], 0, 'Counting')
    )

    quiz.addQuestion(
      new Question('How many apples?', ['1', '2', '3'], 1, 'Counting')
    )

    quiz.addQuestion(
      new Question('How many apples?', ['2', '3', '4'], 1, 'Counting')
    )

    quiz.addQuestion(
      new Question('How many apples?', ['3', '4', '5'], 1, 'Counting')
    )

    quiz.addQuestion(
      new Question('How many apples?', ['3', '4', '5'], 2, 'Counting')
    )

    return quiz
  }
}