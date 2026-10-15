# Test Report

## Test environment

Complete these fields for each test session. If the browser, address, or
application version changes, record a separate session.

- Date: Not recorded
- Browser and version: Not recorded
- Operating system: Not recorded
- App commit or deployed workflow commit: Not recorded
- Test address: Not recorded
- Published address: https://tateviktadevosyan86.github.io/Laboration-3-QuizApp/

## Method

Run the cases through the user interface on the published site. Alternatively,
run `npm ci`, `npm run build`, and `npm run preview`, then open
`http://localhost:4173/Laboration-3-QuizApp/`. Record which version was tested.
Do not use the development server for offline testing.

Before score tests, use a separate test browser profile with no previous app
data, or clear only this app's site data. Clearing site data removes saved
profiles, scores, and cached files; do not clear data that you want to keep.
Use the same browser profile throughout persistence and score tests.

For each case, record the actual observed outcome and Pass or Fail. If a case
fails, record reproduction details under Known issues. Keep Not run for cases
that have not been performed. Requirement IDs refer to README.md, R1–R18.

For offline testing, load online, wait for service-worker activation and
completed caching, then reload online once. Select Offline in developer tools'
Network panel and reload normally. Do not use a hard reload. Restore the
network setting after the test. Audio must be checked for all 12 recordings,
including recordings not played before going offline.

## Test cases

| ID | Requirement | Test case | Input/action | Expected outcome | Actual outcome | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | R1 | Empty nickname | Clear the nickname, leave it empty, press Play. Repeat with spaces only. | Uses Little Explorer in both cases. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T2 | R1 | Nickname too short | Enter A and press Play. | Validation error appears; setup remains visible. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T3 | R1 | Nickname too long | Enter 21 A characters and press Play. | Maximum-length error appears; setup remains visible. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T4 | R1, R2 | Valid profile | Enter Anna, select Frog, press Play. | Menu greets Anna with the Frog avatar. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T5 | R3 | Profile persistence | Save Anna and Frog, then refresh. | Setup restores Anna and the selected Frog avatar. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T6 | R6, R10 | Counting correct and incorrect answers | On the one-apple question select 1; in a fresh round select 2. | Correct choice turns green with a check and happy face; wrong choice turns red with a cross and sad face. Answers disable after submission. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T7 | R7, R10 | Complete shape patterns | Play Shapes; choose the first shape in each displayed alternating pattern as the next shape. | Each choice is accepted; shape symbols appear once per answer button and match the displayed pattern. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T8 | R8 | Select and deselect colours | On the first Colours question, select a red circle, deselect it, then select both red circles and press Check. | Selection indicators toggle; no answer submits before Check; selecting exactly the red circles is accepted. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T9 | R8, R10 | Incomplete or extra colour selections | In one fresh round select only one of the two red circles; in another select both red circles plus blue. Press Check each time. | Both submissions are incorrect; choices and Check disable after submission. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T10 | R9, R10 | Picture and missing letter | Open Letters: sun shows _un. Select S. Repeat in a fresh round with B. | S is correct and B is incorrect; both submissions reveal sun. The next question has its own picture and incomplete word. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T11 | R11 | Full-round progress | Start any activity and submit answers one at a time. | Five empty dots initially; one additional dot fills after each submitted answer, regardless of correctness. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T12 | R5, R13 | Full-round length and score | Complete each of the four activities, deliberately answering exactly three questions correctly in each. | Each full round has five questions and displays 3/5 at completion. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T13 | R14, R11 | Retry missed questions | Miss two known questions in an activity, finish, then press Practise again. Repeat for all four activities. | Only the two missed questions appear, with their original visuals; two progress dots are shown and practice starts at zero points. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T14 | R15 | Save latest and best scores | From clean test data, complete Counting with 3/5, then 2/5; refresh afterward. Inspect the learn-and-play-scores entry in developer tools' Local Storage. | Counting stores latest 2, best 3, rounds 2. Results show best 3/5 and two completed full rounds. Values survive refresh. | User confirmed shared browser score behaviour worked after clarification. Exact score/count checks and stored-value inspection for this case were not separately documented. | Partially verified (user-reported) |
| T15 | R16 | Exclude practice scores | Note saved full-round scores and counts; complete a retry and inspect saved scores again. | No full-round score or completion count changes. | User confirmed shared browser score behaviour worked after clarification. Exact score/count checks and stored-value inspection for this case were not separately documented. | Partially verified (user-reported) |
| T16 | R12 | Correct audio and replay | Play Counting and Shapes instructions; play each of the five colour instructions and five picture-word instructions. Replay a recording and advance while it is playing. | All 12 instructions match their questions; replay restarts without overlapping, and advancing stops old audio. | User heard Sunday instead of sun. sun.wav was regenerated with clearer wording; listening verification of the replacement and the complete replay/stop checks remain pending. See Sun instruction pronunciation below. | Retest required |
| T17 | R18 | Offline app and audio | Follow the offline method above; reload offline, play all activities and all 12 instructions, complete a round and retry. | App reloads, questions and audio work, and results and retries remain usable without network access. | User confirmed offline reload/audio worked and reported a separate offline favicon request error. Exact environment, all-recording coverage, and deployed commit were not recorded. See Offline favicon request below. | Partially verified (user-reported) |
| T18 | R4, R17 | Activity selection and return | Start and finish each activity, return to the menu, and start a different activity. | All four activities can be selected; returning to the menu and starting another round works. Progress summary stays on results rather than the menu. | Not run | Not run |
| T19 | R1 | Nickname length boundaries | Submit AB, then a nickname of exactly 20 A characters. Repeat with two-letter nickname surrounded by spaces. | Both boundary lengths are accepted; surrounding spaces are trimmed. | Not run | Not run |
| T20 | R2, R3 | All avatar options | Select and save each of the six avatars in turn; refresh after each. | Only one avatar is selected; greeting and restored selection match the saved avatar. | Not run | Not run |
| T21 | R14 | Perfect round | Complete a round with all answers correct. | Results show 5/5; Practise again is hidden because there are no missed questions. | User reported the described test group worked as expected; environment and commit were not recorded. | Pass (user-reported) |
| T22 | R15, R16 | Separate activity summaries | Complete different activities with different scores, including at least one practice round, then refresh and inspect stored summaries. | Each full-round result updates only its own activity; best scores do not decrease and practice does not alter summaries. | User confirmed shared browser score behaviour worked after clarification. Exact score/count checks and stored-value inspection for this case were not separately documented. | Partially verified (user-reported) |

## Requirement coverage

| Requirement | Test cases |
| --- | --- |
| R1 | T1, T2, T3, T4, T19 |
| R2 | T4, T20 |
| R3 | T5, T20 |
| R4 | T18 |
| R5 | T12 |
| R6 | T6 |
| R7 | T7 |
| R8 | T8, T9 |
| R9 | T10 |
| R10 | T6, T7, T9, T10 |
| R11 | T11, T13 |
| R12 | T16 |
| R13 | T12 |
| R14 | T13, T21 |
| R15 | T14, T22 |
| R16 | T15, T22 |
| R17 | T18 |
| R18 | T17 |

## Known issues

### Offline favicon request

While offline, the browser requested
`https://tateviktadevosyan86.github.io/favicon.ico` and logged
`net::ERR_INTERNET_DISCONNECTED`. The user reported that app reload and
audio worked. This icon request remains unresolved and is separate from
the quiz functionality. Related test: T17.

## Fix awaiting retest

### Sun instruction pronunciation

The user heard Sunday instead of sun in the original recording. The file
`public/audio/sun.wav` was regenerated with clearer wording:

> Look at the sun in the sky. Which letter starts the word sun?

The replacement file was generated, but listening confirmation and a
published-site/offline retest are still pending. Existing browser caches
may keep the earlier recording until an updated service worker activates.
Related tests: T16 and T17.

## Selected resolved issues

| Issue | Correction | Regression check |
| --- | --- | --- |
| Answer feedback colours appeared only on small screens because their CSS rules were inside a mobile media query. | Moved the feedback styles outside the media query. | T6 and T10: verify correct/incorrect colours on wide and narrow screens. Later grouped feedback checks were reported working by the user. |
| Letters and Colours used the Shapes activity name when saving scores. | Corrected the activity names and set activity state before starting each quiz. | T22: verify each full round changes only its own activity summary. Code/syntax checks passed; exact stored-value checks remain partially documented. |

## Summary

The report defines 22 manual cases covering all 18 README requirements.
The user confirmed T1–T5, T6–T10, T11–T13, and T21 in grouped checks; these
are recorded as user-reported passes rather than independent browser tests.
Score and offline checks have partial user confirmation. T18–T20 still lack
separate explicit execution confirmation and remain Not run.

T16 requires retesting after the Sun recording replacement. The offline
favicon request remains open. A production build succeeded during development.
Browser version, precise test-session dates, and tested commit IDs still
need to be recorded. No complete deployed-site acceptance pass is claimed.
