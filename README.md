# Learn & Play

Learn & Play helps children aged 3–5 practise counting, shape patterns,
colour recognition, and initial letters through short visual quizzes.
It supports one child at a time, independently or with an adult.
Spoken instructions let children hear what to do without reading the prompts.

## Play online

[Open Learn & Play](https://tateviktadevosyan86.github.io/Laboration-3-QuizApp/)

1. Enter an optional nickname and choose an animal avatar.
2. Press Play and choose an activity.
3. Press the speaker button to hear the current instruction.
4. Answer, view the feedback, and press the arrow to continue.
5. At the end, view the result, practise missed questions, or return to activities.

An empty nickname uses **Little Explorer**. Entered nicknames must contain
2–20 characters after surrounding spaces are removed.

## Activities

| Activity | What the child does                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------- |
| Counting | Counts one to five apples and chooses a number.                                                                       |
| Shapes   | Chooses the next shape in an alternating pattern.                                                                     |
| Colours  | Selects all circles of the named colour, then presses Check. Tapping a circle again deselects it.                     |
| Letters  | Uses a picture to choose a word's missing first letter, such as S for sun. The complete word appears after answering. |

Each full round contains five questions. Progress dots fill as questions
are answered. Green/red feedback and faces indicate correct/incorrect
answers. There is no timer. English instructions are provided as local
WAV recordings generated with the Windows Microsoft Zira voice.

## Results and saved progress

The results screen shows earned points and available points for the round,
plus the activity's best full-round score and completed full-round count.
The app stores the latest full-round score as well.

Practice contains only incorrectly answered questions. It starts a fresh
session and does not change saved full-round scores or completion counts.

The nickname, avatar, and score summaries are saved in `localStorage`.
There is one profile per browser: changing the nickname or avatar does not
create a separate score history. Data does not sync between devices, and
clearing browser site data removes it. Saving depends on browser storage
being available.

## Offline use

The first visit requires an internet connection. Keep the app open until
its service worker has finished caching the application and all 12 audio
recordings, then reload once online. After caching, the same browser can
load the app and play instructions offline.

Offline availability depends on the browser retaining its cached files.
Clearing site data removes both cached files and saved progress. Local
development with `npm run dev` does not enable the production service worker.

## Run locally

Install Node.js **24.12.0 or later**, npm, and Git. This Node.js minimum
comes from the Quiz Engine dependency.

```bash
git clone https://github.com/TatevikTadevosyan86/Laboration-3-QuizApp.git
cd Laboration-3-QuizApp
npm ci
npm run dev
```

Open the address printed by Vite. Dependencies are installed from the
committed lockfile; both student modules are obtained from GitHub.

To build and preview the production version:

```bash
npm run build
npm run preview
```

Open the printed address with `/Laboration-3-QuizApp/`, normally
`http://localhost:4173/Laboration-3-QuizApp/`. Use the production preview
or published site when testing offline behaviour.

## Application structure

| Class               | Responsibility                                                                    |
| ------------------- | --------------------------------------------------------------------------------- |
| LearningApp         | Coordinates profiles, activity sessions, answer submission, results, and retries. |
| PlayerSetupView     | Displays nickname and avatar selection and validation feedback.                   |
| ActivityMenuView    | Displays the greeting and activity choices and reports the selected activity.     |
| QuestionView        | Displays question content, answers, progress, feedback, and question controls.    |
| ResultsView         | Displays scores and reports retry and menu button clicks.                         |
| QuestionBank        | Creates quizzes and associates question objects with visual content.              |
| PlayerNameValidator | Adapts the second student's validation module for optional nicknames.             |
| PlayerStorage       | Saves and restores the browser's player profile.                                  |
| ScoreStorage        | Saves and reads full-round score summaries.                                       |
| InstructionPlayer   | Plays and stops local instruction recordings.                                     |

`main.js` creates the application and passes its dependencies through
constructors. Views report user actions through callbacks; `LearningApp`
responds by updating quiz state or navigating to another screen.

The Quiz Engine checks answers, calculates scores, records answer history,
and creates retry quizzes. The application supplies the content and interface.

The same `QuestionBank` instance is passed to `LearningApp` and `QuestionView`.
Its visual metadata is associated with the question objects used by the
engine, including questions reused in retry rounds.

## Module integration

### Quiz Engine — primary module

[Quiz Engine repository](https://github.com/TatevikTadevosyan86/Laboration-2-QuizEngine)

Installed as `quiz-engine`, pinned to the L3-refactored commit
`07f992d351ae7e42181a92731aba21923a31882e`.
The original L2 assessment version remains available at the
`laboration-2` tag.
It provides `Question`, `MultipleChoiceQuestion`, `Quiz`, and `QuizSession` for answer
checking, scoring, history, and retry quizzes. Colours uses multiple-answer
questions; the other activities use single-answer questions.

`QuestionBank` creates quiz content and stores visual metadata separately.
`LearningApp` coordinates the quiz flow, while view classes handle the interface. The engine has
no dependency on this application.

### Form Validation Module — second student's module

[Form Validation Module repository](https://github.com/Fielifia/1dv610-laboration-2)

Installed as `laboration-2`. `PlayerNameValidator` wraps its `Field`,
`Validation`, `MinLengthRule`, and `MaxLengthRule` classes to validate the
optional nickname on the player setup screen. The application reads its
validation results and displays errors; the module source is not modified.

Both modules remain separate projects and are installed as dependencies.
Do not edit their installed copies in `node_modules`.

## Requirements

| ID  | Requirement                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------- |
| R1  | The user can enter an optional nickname. An entered nickname must contain 2–20 characters after trimming surrounding spaces. |
| R2  | The user can choose one of six avatars.                                                                                      |
| R3  | The app restores the saved nickname and avatar in the same browser.                                                          |
| R4  | The user can select Counting, Shapes, Colours, or Letters.                                                                   |
| R5  | Each full activity round contains five questions.                                                                            |
| R6  | Counting displays apples and accepts one number answer per question.                                                         |
| R7  | Shapes displays a pattern and accepts one answer for the next shape.                                                         |
| R8  | Colours allows selecting and deselecting several circles before checking the answer.                                         |
| R9  | Letters displays a picture and incomplete word, accepts one letter answer, and reveals the complete word after submission.   |
| R10 | Answer submission displays correct or incorrect visual feedback.                                                             |
| R11 | Progress indicators show how many questions have been answered in the current round.                                         |
| R12 | The speaker button plays the instruction for the current question.                                                           |
| R13 | Completing a round displays earned and available points.                                                                     |
| R14 | The user can practise only the questions answered incorrectly.                                                               |
| R15 | The app saves each activity's latest full-round score, best full-round score, and number of completed full rounds.           |
| R16 | Practice rounds do not change saved full-round scores or counts.                                                             |
| R17 | The user can return to the activity menu after a round.                                                                      |
| R18 | After initial caching, all activities and instructions work offline.                                                         |

## Deployment

GitHub Actions builds and publishes the application to GitHub Pages when
the deployment workflow runs on `main`. The Vite base path is
`/Laboration-3-QuizApp/`. The generated `dist` directory is the deployment
artifact and should not be committed.

## Testing

See [TEST_REPORT.md](./TEST_REPORT.md) for manual test cases and recorded
outcomes. Each requirement above must be covered by at least one test.
The manual tests passed during development. On 2026-10-19, I tested the application again after refactoring, and the regression checks passed. The detailed results are recorded in TEST_REPORT.md.

`npm run build` checks production packaging; it does not replace interface,
audio, persistence, or offline testing. Run `npm test` for the automated
score-storage tests in `test/ScoreStorage.test.js`. These tests do not replace
manual interface or offline checks. Run `npm run format:check` to verify formatting.

Verification on 2026-10-19: the application automated test passed (1 test),
the production build passed, and the Quiz Engine passed all 41 tests,
ESLint, and its source formatting check. The automated checks cover a
subset of behaviour; the manual checks cover the user interface and offline use.
