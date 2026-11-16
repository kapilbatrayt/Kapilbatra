# Vyaya

A personal iPhone app for tracking workouts and diet. Version 0.1, built with SwiftUI. All data stays on the phone.

## Run it on your iPhone

You need a Mac with Xcode 16 or newer, and an iPhone on iOS 17 or newer.

1. Open `vyaya/Vyaya.xcodeproj` in Xcode.
2. Click the blue **Vyaya** project at the top of the left sidebar, choose the **Vyaya** target, then **Signing & Capabilities**. Under **Team**, pick your Apple ID. If Xcode says the bundle identifier is taken, change `com.kapilbatra.vyaya` to something unique.
3. Plug in your iPhone, choose it in the device menu at the top of the window, and press **Run** (the play button).
4. The first time, the phone asks you to trust the developer: Settings → General → VPN & Device Management → your Apple ID → Trust.

With a free Apple ID the app stops opening after 7 days; press Run again to renew it. A paid developer account removes that limit.

### If the project won't open

The project file was written by hand and has not been opened in Xcode yet. If Xcode refuses it:

1. In Xcode choose File → New → Project → iOS → App. Name it `Vyaya`, interface SwiftUI, language Swift.
2. Delete the two Swift files and the `Assets` catalogue Xcode created.
3. Drag everything inside `vyaya/Vyaya/` into the project, with "Copy items if needed" ticked.
4. In the target's Info tab add **Privacy - Photo Library Additions Usage Description** with any short sentence.

## What version 0.1 does

- **Setup:** five screens of questions, then calorie, protein, carb, fat, fibre and water targets calculated from the answers. Every target can be changed later under Progress → Settings.
- **Today:** calories left, macros, the planned session, the next meal and water.
- **Train:** a routine picker, a gym logger with weight and rep steppers, a rest timer and personal-record detection, plus timed sessions for run, ride, walk, yoga and home workouts.
- **Summary and share:** a summary after each session, a share card with the Vyaya photo filter (motion blur on the person, duotone, grain), and a transparent sticker. Share through the iOS share sheet or save to Photos.
- **Diet:** meals planned from the whiteboard days, one-tap logging, a food picker with live nutrition, Suggest me, and custom foods.
- **Progress:** weigh-ins, a 7-day trend, a chart, and settings for theme and targets.

## Not in this version yet

- GPS tracking and route maps (distance is entered by hand)
- Scanning a diet chart from a photo
- Barcode and nutrition-label scanning
- Apple Health sync
- Posting straight into Instagram Stories (the share sheet is used instead)
- Reminders and lock-screen timers
- The full 800+ exercise library (34 exercises and 7 routines are built in)
- The Hanken Grotesk typeface (the system font is used)
- An app icon

## Notes

- Nutrition values are approximate.
- Calories burned are estimates from activity type, body weight and time.
- Icons are from [Tabler Icons](https://tabler.io/icons), MIT licence. See `TABLER-ICONS-LICENSE.txt`.
