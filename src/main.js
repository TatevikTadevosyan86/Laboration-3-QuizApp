import { LearningApp } from './LearningApp.js'
import { QuestionBank } from './QuestionBank.js'
import { PlayerNameValidator } from './PlayerNameValidator.js'
import { PlayerSetupView } from './PlayerSetupView.js'
import { PlayerStorage } from './PlayerStorage.js'
import { ScoreStorage } from './ScoreStorage.js'
import { InstructionPlayer } from './InstructionPlayer.js'
import { ActivityMenuView } from './ActivityMenuView.js'
import { ResultsView } from './ResultsView.js'
import { QuestionView } from './QuestionView.js'

const root = document.querySelector('#app')
const playerSetupView = new PlayerSetupView(root, new PlayerNameValidator())
const questionBank = new QuestionBank()

const app = new LearningApp({
  questionBank,
  playerSetupView,
  playerStorage: new PlayerStorage(),
  scoreStorage: new ScoreStorage(),
  instructionPlayer: new InstructionPlayer(),
  activityMenuView: new ActivityMenuView(root),
  resultsView: new ResultsView(root),
  questionView: new QuestionView(root, questionBank),
})

app.start()
