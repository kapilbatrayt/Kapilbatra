# Vyaya: project handoff

Everything decided and built so far, so a new Claude session can pick the project up without the earlier chat.

Last updated: 16 November 2026.

## 1. What Vyaya is

A personal iPhone app for one user, Kapil. It tracks workouts and diet, shows calories burned and nutrition, and makes Strava-style share cards for Instagram.

| | |
|---|---|
| Device | iPhone 13. No Apple Watch. |
| User | Kapil, a designer. Starting training fresh, no current gym split. |
| Training | Gym, running, cycling, walking, yoga, home workouts |
| Goal | Fat loss, then maintenance |
| Diet | Vegetarian with whole eggs |
| Data | On the phone only. No account, no server. |
| Development | Kapil has a Mac with Xcode |

## 2. Where things are

Repository: `kapilbatrayt/Kapilbatra`, branch `claude/great-cori-o15q6q`. The repo is Kapil's portfolio site; the app lives in the `vyaya/` folder and is excluded from the Vercel deploy through `.vercelignore`. No pull request is open.

| Path | What it is |
|---|---|
| `vyaya/Vyaya.xcodeproj` | Xcode project, written by hand (Xcode 16 format, synchronised folder) |
| `vyaya/Vyaya/*.swift` | App source, about 2,500 lines |
| `vyaya/Vyaya/Assets.xcassets` | 23 Tabler icons as template SVGs, accent colour, empty app icon slot |
| `vyaya/README.md` | How to run it, what's in and out of version 0.1 |
| `vyaya/docs/journey-map.html` | User journey map |
| `vyaya/docs/wireframes.html` | 18 low-fidelity wireframes |
| `vyaya/docs/design-system.html` | Design system with a working filter demo |
| `vyaya/docs/visual-design.html` | 8 finished screens (the current look) |
| `vyaya/docs/HANDOFF.md` | This file |

The docs HTML files are page fragments written for Claude artifacts (no `<html>` or `<body>` tags). They open in a browser as they are.

Published copies (private to Kapil):

- Journey map: https://claude.ai/artifact/MiqvkgaxdxCCPbsShV4xBB
- Wireframes: https://claude.ai/artifact/ATaJ1uyaks9adr1znNLrNP
- Design system: https://claude.ai/artifact/KqTGJtygmQRWzmQ1jSpjic
- Visual design: https://claude.ai/artifact/6g9xEvZePedBhaWHao4umb

## 3. Current state and the next step

**The app has never been compiled or run.** It was written in a cloud session with no Swift toolchain. The first job on the Mac is:

1. Open `vyaya/Vyaya.xcodeproj` in Xcode 16 or newer. If it won't open, follow the fallback in `vyaya/README.md` (new empty SwiftUI app, drag `vyaya/Vyaya/` in).
2. Build for an iPhone simulator (iOS 17 or newer) and fix compile errors.
3. Run through setup, log a gym session, log food, open the share screen.

From the command line:

```bash
xcodebuild -project vyaya/Vyaya.xcodeproj -scheme Vyaya -destination 'platform=iOS Simulator,name=iPhone 16' build
```

Things most likely to need attention:

- The hand-written `project.pbxproj`
- `ShareViews.swift`: Core Image filter calls, Vision person segmentation (may not work in the simulator; there is a fallback that blurs the left side), `ImageRenderer`
- SVG icons in the asset catalogue rendering as templates
- The `Summary` and `Share` screens force dark mode with `.environment(\.colorScheme, .dark)`

## 4. Process so far

Kapil asked for four stages, in order. He also asked to keep credit use low, so each stage was built in one pass.

1. **User journey**: done
2. **Wireframes**: done
3. **Design system and visual design**: done
4. **SwiftUI build**: version 0.1 written, not yet compiled

## 5. Product decisions

### Targets
- Vyaya asks setup questions (age, sex, height, weight, target weight, pace, daily activity, sessions per week, workout types) and calculates everything itself.
- Resting burn: Mifflin-St Jeor. Maintenance: resting burn × activity factor. Calories: maintenance minus the deficit for the chosen pace (0.5 kg a week ≈ 550 kcal a day), never below resting burn.
- Protein 1.8 g per kg, fat 25% of calories, carbs the remainder, fibre 14 g per 1,000 kcal, water 35 ml per kg.
- Every target is editable later. A hand-set number is marked Custom and can be reset to the calculated one.
- Planned: every 4 weeks or after a 2 kg change, propose new targets; offer maintenance when the target weight is reached.

### Calories burned without a watch
- Running: about 1.0 kcal × kg × km.
- Everything else: `(MET − 1) × 3.5 × kg ÷ 200 × minutes`. Only active calories are counted. Figures are shown with "≈".

### Workouts
- One routine picker covers every workout type.
- Gym logger: weight and rep steppers, last session prefilled, "try 2.5 kg more" hint, 90-second rest timer, personal-record detection.
- Starter plan because Kapil has no split: full body on Monday, Wednesday and Friday, with walks, yoga and a ride in between.
- Planned: the public-domain `free-exercise-db` library (about 800 exercises with two photos and instructions each), an exercise detail screen, custom exercises, plan builder.

### Diet
- Kapil supplied 9 photos: a two-page printed dietitian's chart and seven whiteboard days (11 to 27 September).
- The printed chart is made out to another person and carries medical details. **Do not copy the name, diagnosis or hospital into the app or any document.** The photos are not in the repository.
- The chart is printed at 1,200 kcal and 55 g protein. Vyaya keeps its foods and rules but calculates Kapil's own amounts.
- Day structure: on waking, breakfast 8:30, fruit 11:00, lunch 1:30, snack 5:00, dinner 8:30.
- Food library in the app: 59 foods (38 from the chart and whiteboards, 12 egg recipes, common Indian foods) and 30 whole meals. Portions use katori, roti, piece, glass.
- Chart "avoid" list (refined flour, potato, banana, mango, fried food, sweets and so on): flagged when logged, never blocked. Whole eggs are allowed and not flagged.
- Chart instructions to carry into the app: bejad roti (wheat 3 kg, barley 1 kg, black chana ½ kg), oil 2 tsp a day, water 3 to 4 litres, last meal 2 hours before sleep, fixed meal times, 30-minute morning walk, 10-minute walk after dinner.
- "Suggest me": up to three meals from the library that fit the calories left, highest protein first.
- Nutrients tracked: calories, protein, carbs, fat, fibre, calcium, iron. Totals update live while choosing a portion.
- Blood sugar tracking: not wanted.
- Planned: scan a chart or whiteboard photo with Apple's Vision text recognition, barcode and label scanning, recipe builder, Indian food tables (IFCT 2017) and Open Food Facts.

### Sharing
- Instagram Stories, a transparent sticker like Strava's, GPS routes for runs, walks and rides, and map styles (route only, standard, satellite, dark).
- Option to hide the first and last 200 m of a route.
- The Vyaya photo filter: detect the person, motion-blur only the person, keep the background sharp, apply a duotone grade, add film grain. Grades: Signal (black to red), Dusk (burnt orange), Paper (black on off-white), Chrome (monochrome), None.
- The share card carries the lockup (small label, mark, small label across the middle) and stats at the bottom.

### Reminders (planned defaults)
Wake-up water, nuts and weigh-in at 7:00; meals at chart times; water only if behind pace; workout an hour before; walk after dinner is logged; evening review at 21:30; Sunday recap; monthly progress photo. Each can be switched off.

## 6. Design system

Source of truth for the look: `docs/visual-design.html`. The older `docs/design-system.html` still shows square corners and is kept for the type, lockup and filter demo.

### Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| Paper | `#F4F3EF` | `#0A0A0B` | Screen background |
| Surface | `#FFFFFF` | `#17171A` | Cards |
| Tile | `#EBE9E4` | `#232327` | Option tiles, soft buttons, tracks |
| Ink | `#121214` | `#F4F3EF` | Text, selected tiles, ticks |
| Mute | `#76746F` | `#94928D` | Secondary text |
| Signal | `#E8281E` | `#FF3B2F` | Primary colour |
| Ember | `#F26A1B` | `#FF7A2E` | End of the gradient, avoid-list flag |

- **Primary colour is signal red. Do not change it.** Kapil rejected a crimson alternative.
- **Gradient:** signal red to ember, the same one the filter uses. It goes on the main button of each screen, the round Start button, the calorie ring, calorie bars and the PR badge. Everything else is ink on paper.
- Light theme is the default. Dark is available in settings. The Summary and Share screens are always dark.

### Type
- **Hanken Grotesk** for headings, numbers and body. Heavy weight, tight tracking for headlines and big numbers.
- **JetBrains Mono** for small uppercase labels with wide tracking.
- Both are free to bundle. Version 0.1 uses the system font; the font files still need adding.
- Kapil tried Inter Display and chose Hanken Grotesk because it is less common. PP Neue Montreal and Suisse Int'l were ruled out as paid.

### Shape
- Soft and rounded, easy on the eyes: cards 22 pt radius, tiles 16, buttons 18, pills and steppers fully round.
- Floating tab bar with a round gradient Start button in the middle. Tabs: Today, Train, Start, Diet, Progress.
- Grey option tiles turn ink when selected.

### Icons
- **Tabler Icons** 3.24.0, MIT licence. Kapil asked for a free set from the internet, not hand-drawn icons.
- The Vyaya "V" mark is a placeholder, not a final logo.

### Reference apps
Kapil shared screenshots of Strava (setup tiles), Hevy, Apple Fitness (ring, big number with round plus and minus) and MyFitnessPal (week strip, macro columns, meal cards with a Log pill). Take cues from them but keep Vyaya's own identity; he was concerned about looking like Strava.

### Moodboard
Black with a single red, motion-blurred silhouettes, duotone orange dusk, off-white with a black figure and one orange accent, small mono labels flanking a centred mark, film grain.

## 7. Version 0.1: what is built

| File | Contents |
|---|---|
| `VyayaApp.swift` | App entry, root view, floating tab bar, page scaffold |
| `Models.swift` | Profile, targets calculation, foods, workouts, weights |
| `SeedData.swift` | 59 foods, 30 meals, 34 exercises, 7 routines |
| `Store.swift` | One observable store saved as JSON in the app's Documents folder |
| `Theme.swift` | Colours, gradient, buttons, pills, ring, bar, steppers, tiles, mark |
| `OnboardingView.swift` | Five setup screens ending in editable targets |
| `TodayView.swift` | Week strip, calorie ring, macros, session, next meal, water |
| `TrainViews.swift` | Train tab, start flow, gym logger, timed sessions, summary |
| `DietViews.swift` | Meal slots, Suggest me, food picker, food detail, custom food |
| `ProgressViews.swift` | Weight trend and chart, counts, theme and target settings |
| `ShareViews.swift` | Filter, share card, transparent sticker, share sheet, save to Photos |

Technical choices: SwiftUI, iOS 17 minimum, Swift 5 language mode, no third-party packages, storage in a single Codable JSON file (not SwiftData), bundle identifier `com.kapilbatra.vyaya`.

## 8. Not built yet

In rough priority order:

1. Get version 0.1 compiling and running
2. Exercise library with demo photos and instructions, exercise detail screen, custom exercises
3. GPS tracking and route maps for run, walk and ride; routes on share cards
4. Scan a diet chart or whiteboard from a photo
5. Bundle Hanken Grotesk and JetBrains Mono
6. Apple Health sync
7. Direct share to Instagram Stories (needs a free Meta developer app ID)
8. Reminders and lock-screen rest timer
9. Barcode and nutrition-label scanning, recipe builder
10. Progress photos, weekly recap card, widgets
11. App icon and final logo

## 9. Working preferences

- Keep credit use low: build in one pass, avoid long back-and-forth.
- Explain in plain language; Kapil is a designer, not a developer.
- Be upfront about anything untested.
- Ask before changing the primary colour, the typeface or the icon set.
