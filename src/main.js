import { LearningApp } from './LearningApp.js'
import { QuestionBank } from './QuestionBank.js'
import { PlayerNameValidator } from './PlayerNameValidator.js'
import { PlayerStorage } from './PlayerStorage.js'
import { ScoreStorage } from './ScoreStorage.js'
import { InstructionPlayer } from './InstructionPlayer.js'

const app = new LearningApp(document.querySelector('#app'), {
  questionBank: new QuestionBank(),
  nameValidator: new PlayerNameValidator(),
  playerStorage: new PlayerStorage(),
  scoreStorage: new ScoreStorage(),
  instructionPlayer: new InstructionPlayer(),
})
app.start()
