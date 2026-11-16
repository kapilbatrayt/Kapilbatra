import SwiftUI
import Charts

struct ProgressTabView: View {
    @EnvironmentObject var store: Store
    @State private var entry = 70.0

    var body: some View {
        let t = store.targets
        let c = store.data.profile.calculated

        Page {
            Text("Progress").heading()

            VStack(alignment: .leading, spacing: 8) {
                Text("7-day trend").mono()
                HStack(alignment: .firstTextBaseline, spacing: 6) {
                    Text(store.trend.map { num(($0 * 10).rounded() / 10) } ?? "–").font(.system(size: 54, weight: .heavy)).tracking(-2).monospacedDigit()
                    Text("kg").font(.system(size: 18, weight: .bold))
                }
                if let change = store.trendChange {
                    Text(change <= 0 ? "Down \(num((abs(change) * 10).rounded() / 10)) kg on the week before" : "Up \(num((change * 10).rounded() / 10)) kg on the week before")
                        .foregroundStyle(Theme.mute)
                } else {
                    Text("Weigh in each morning. The trend smooths out daily swings from water and salt.").foregroundStyle(Theme.mute)
                }
                if store.data.weights.count > 1 {
                    Chart(store.data.weights) { w in
                        LineMark(x: .value("Date", w.date), y: .value("Weight", w.kg))
                            .foregroundStyle(Theme.ink)
                            .interpolationMethod(.catmullRom)
                    }
                    .chartYScale(domain: .automatic(includesZero: false))
                    .frame(height: 140)
                }
            }
            .card()

            VStack(alignment: .leading, spacing: 12) {
                Text("Today's weight").mono()
                HStack {
                    NumberStepper(value: String(format: "%.1f", entry), unit: "kg", minus: { entry = max(30, entry - 0.1) }, plus: { entry += 0.1 })
                    Spacer()
                    Button { store.addWeight((entry * 10).rounded() / 10) } label: { Pill(text: "Save", style: .gradient) }.buttonStyle(.plain)
                }
            }
            .card()

            HStack(spacing: 8) {
                count("Workouts", store.data.workouts.count)
                count("PRs", store.data.workouts.reduce(0) { $0 + $1.prCount })
                count("Km", Int(store.data.workouts.reduce(0) { $0 + $1.distanceKm }.rounded()))
            }

            Text("Settings").mono().padding(.top, 8)

            VStack(alignment: .leading, spacing: 10) {
                Text("Theme").fontWeight(.bold)
                Picker("Theme", selection: $store.data.profile.theme) {
                    Text("Light").tag(1)
                    Text("Dark").tag(2)
                    Text("Match phone").tag(0)
                }
                .pickerStyle(.segmented)
            }
            .card()

            VStack(alignment: .leading, spacing: 10) {
                Text("Daily targets").fontWeight(.bold)
                Text("Vyaya calculated \(c.calories.formatted()) kcal and \(c.protein) g protein from your answers.")
                    .font(.system(size: 13)).foregroundStyle(Theme.mute)
                target("Calories", "\(t.calories.formatted())", custom: store.data.profile.customCalories != nil,
                       minus: { store.data.profile.customCalories = max(1000, t.calories - 50) },
                       plus: { store.data.profile.customCalories = min(5000, t.calories + 50) })
                target("Protein", "\(t.protein) g", custom: store.data.profile.customProtein != nil,
                       minus: { store.data.profile.customProtein = max(30, t.protein - 5) },
                       plus: { store.data.profile.customProtein = min(300, t.protein + 5) })
                if store.data.profile.customCalories != nil || store.data.profile.customProtein != nil {
                    SoftButton(title: "Reset to calculated") {
                        store.data.profile.customCalories = nil
                        store.data.profile.customProtein = nil
                    }
                }
                SoftButton(title: "Answer the setup questions again") { store.data.profile.onboarded = false }
            }
            .card()

            Text("Everything is stored on this iPhone only.").font(.system(size: 13)).foregroundStyle(Theme.mute)
        }
        .onAppear { entry = store.data.weights.last?.kg ?? store.data.profile.weightKg }
    }

    private func count(_ title: String, _ value: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).mono()
            Text("\(value)").font(.system(size: 26, weight: .heavy)).monospacedDigit()
        }
        .card(14)
    }

    private func target(_ title: String, _ value: String, custom: Bool, minus: @escaping () -> Void, plus: @escaping () -> Void) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                if custom { Text("Custom").mono() }
            }
            Spacer()
            RoundButton(icon: "ic-minus", size: 32, action: minus)
            Text(value).font(.system(size: 16, weight: .bold)).monospacedDigit().frame(minWidth: 70)
            RoundButton(icon: "ic-plus", size: 32, action: plus)
        }
    }
}
