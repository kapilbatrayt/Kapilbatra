import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var store: Store
    @State private var step = 0
    @State private var p = Profile()
    private let last = 4

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                if step > 0 {
                    RoundButton(icon: "ic-back") { step -= 1 }
                }
                Spacer()
                Text("\(step + 1) of \(last + 1)").mono()
            }
            .frame(height: 40)
            HStack(spacing: 5) {
                ForEach(0...last, id: \.self) { i in
                    Capsule().fill(i <= step ? Theme.ink : Theme.tile).frame(height: 4)
                }
            }
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    content
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            GradientButton(title: step == last ? "Looks right" : "Continue") {
                if step == last {
                    finish()
                } else {
                    step += 1
                }
            }
        }
        .padding(20)
        .background(Theme.paper.ignoresSafeArea())
        .onAppear { p = store.data.profile }
    }

    private func finish() {
        p.onboarded = true
        store.data.profile = p
        if store.data.weights.isEmpty { store.addWeight(p.weightKg) }
    }

    @ViewBuilder private var content: some View {
        switch step {
        case 0: about
        case 1: goal
        case 2: activity
        case 3: kinds
        default: targets
        }
    }

    private var about: some View {
        Group {
            Text("About you").heading()
            Text("Vyaya uses these to work out your calories. Everything stays on this iPhone.").foregroundStyle(Theme.mute)
            StepRow(title: "Age", value: "\(p.age)", minus: { p.age = max(14, p.age - 1) }, plus: { p.age = min(90, p.age + 1) })
            HStack(spacing: 8) {
                ForEach(Sex.allCases) { s in
                    ChoiceTile(title: s.label, on: p.sex == s) { p.sex = s }
                }
            }
            StepRow(title: "Height", value: "\(Int(p.heightCm)) cm", minus: { p.heightCm = max(120, p.heightCm - 1) }, plus: { p.heightCm = min(220, p.heightCm + 1) })
            StepRow(title: "Weight", value: "\(num(p.weightKg)) kg", minus: { p.weightKg = max(35, p.weightKg - 0.5) }, plus: { p.weightKg = min(200, p.weightKg + 0.5) })
        }
    }

    private var goal: some View {
        Group {
            Text("Your goal").heading()
            Text("Set a target weight and how fast you want to get there.").foregroundStyle(Theme.mute)
            StepRow(title: "Target weight", value: "\(num(p.targetKg)) kg", minus: { p.targetKg = max(35, p.targetKg - 0.5) }, plus: { p.targetKg = min(200, p.targetKg + 0.5) })
            Text("Pace per week").mono()
            HStack(spacing: 8) {
                ForEach([0.25, 0.5, 0.75], id: \.self) { pace in
                    ChoiceTile(title: "\(num2(pace)) kg", on: p.pace == pace) { p.pace = pace }
                }
            }
            if p.targetKg < p.weightKg {
                let weeks = Int(((p.weightKg - p.targetKg) / p.pace).rounded(.up))
                Text("You'd reach \(num(p.targetKg)) kg in about \(weeks) weeks.").foregroundStyle(Theme.mute)
            } else {
                Text("Your target is at or above your current weight, so Vyaya will set maintenance calories.").foregroundStyle(Theme.mute)
            }
        }
    }

    private var activity: some View {
        Group {
            Text("Your week").heading()
            Text("Your day outside workouts").mono()
            ForEach(DayActivity.allCases) { a in
                ChoiceTile(title: a.label, on: p.activity == a) { p.activity = a }
            }
            StepRow(title: "Sessions a week", value: "\(p.sessionsPerWeek)", minus: { p.sessionsPerWeek = max(0, p.sessionsPerWeek - 1) }, plus: { p.sessionsPerWeek = min(7, p.sessionsPerWeek + 1) })
        }
    }

    private var kinds: some View {
        Group {
            Text("What do you want to train?").heading()
            Text("Pick as many as you like. You can change this later.").foregroundStyle(Theme.mute)
            LazyVGrid(columns: [GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8)], spacing: 8) {
                ForEach(WorkoutKind.allCases) { k in
                    ChoiceTile(title: k.label, icon: k.icon, on: p.kinds.contains(k)) {
                        if p.kinds.contains(k) {
                            p.kinds.removeAll { $0 == k }
                        } else {
                            p.kinds.append(k)
                        }
                    }
                }
            }
        }
    }

    private var targets: some View {
        let t = p.targets
        let c = p.calculated
        return Group {
            Text("Your daily target").heading()
            Text("Resting burn \(c.bmr.formatted()), maintenance \(c.maintenance.formatted()). Vyaya never sets you below your resting burn.")
                .foregroundStyle(Theme.mute)
            HStack {
                Spacer()
                NumberStepper(value: t.calories.formatted(), unit: "kcal a day", numberSize: 52,
                              minus: { p.customCalories = max(1000, t.calories - 50) },
                              plus: { p.customCalories = min(5000, t.calories + 50) })
                Spacer()
            }
            .padding(.vertical, 10)
            VStack(spacing: 10) {
                row("Protein", "\(t.protein) g")
                row("Carbs", "\(t.carbs) g")
                row("Fat", "\(t.fat) g")
                row("Fibre", "\(t.fibre) g")
                row("Water", "\(num(t.waterL)) L")
            }
            .card()
            if p.customCalories != nil {
                SoftButton(title: "Reset to calculated (\(c.calories.formatted()))") { p.customCalories = nil }
            }
            Text("You can change these any time in Progress, under Settings.").foregroundStyle(Theme.mute)
        }
    }

    private func row(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(value).fontWeight(.bold)
        }
    }

    private func num2(_ v: Double) -> String { String(format: "%.2g", v) }
}
