# Test Report

## Test environment

- Date:
- Browser and version:
- Operating system:
- App commit:
- Test address:

## Method

Build the application with `npm run build`, then serve it with
`npm run preview`. Open the printed address in the browser.

Run the cases below through the user interface.
Record the observed result and whether each case passed.

For offline testing, first allow the service worker to install,
reload online, then select Offline in browser developer tools
and reload normally.

## Test cases

| ID | Feature | Input/action | Expected outcome | Actual outcome | Status |
| --- | --- | --- | --- | --- | --- |
| T1 | Optional nickname | Leave nickname empty and press Play | Uses Little Explorer | Not run | Not run |
| T2 | Nickname validation | Enter A and press Play | Shows validation error | Not run | Not run |
| T3 | Nickname validation | Enter 21 characters and press Play | Shows validation error | Not run | Not run |
| T4 | Player profile | Enter Anna, select Frog, press Play | Menu greets Anna with Frog avatar | Not run | Not run |
| T5 | Profile persistence | Refresh after saving profile | Restores nickname and selected avatar | Not run | Not run |
| T6 | Counting | Select the number matching the apples | Shows correct feedback | Not run | Not run |
| T7 | Shapes | Select the next shape in the pattern | Shows correct feedback | Not run | Not run |
| T8 | Colours | Select every target-colour circle and press Check | Accepts the complete selection | Not run | Not run |
| T9 | Colours | Omit one target circle or include another colour | Shows incorrect feedback | Not run | Not run |
| T10 | Letters | Select S for the sun picture | Shows correct feedback and the complete word sun | Not run | Not run |
| T11 | Progress | Submit answers through a round | Fills one progress dot per answer | Not run | Not run |
| T12 | Results | Finish five questions with three correct | Displays 3/5 on results screen | Not run | Not run |
| T13 | Retry | Miss two questions and start practice | Shows only those two questions with matching visuals | Not run | Not run |
| T14 | Saved scores | Finish rounds scoring 3/5 then 2/5 | Latest 2/5, best 3/5; completed rounds increases twice | Not run | Not run |
| T15 | Practice scores | Complete a retry round | Saved full-round scores and round count stay unchanged | Not run | Not run |
| T16 | Audio | Press speaker in each activity | Plays the instruction for the current question | Not run | Not run |
| T17 | Offline | Cache app, disconnect, reload, play all activities and audio | App and recordings work offline | Not run | Not run |
| T18 | Navigation | Finish a round and return to activities | Menu appears and another activity can start | Not run | Not run |

## Known issues

Record any observed problems here.

## Summary

Complete after testing. State which tests passed, which failed,
and any remaining limitations.