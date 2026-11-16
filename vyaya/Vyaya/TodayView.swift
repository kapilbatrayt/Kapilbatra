import SwiftUI

struct TodayView: View {
    @EnvironmentObject var store: Store
    @Binding var tab: Int
    @Binding var showStart: Bool
    private let today = Date()

    var body: some View {
        let t = store.targets
        let eaten = store.totals(on: today)
        let burned = store.burned(on: today)
        let left = Double(t.calories) - eaten.kcal

        Page {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Today").heading()
                    Text(today.formatted(.dateTime.weekday(.abbreviated).day().month(.abbreviated))).foregroundStyle(Theme.mute)
                }
                Spacer()
                Button { tab = 3 } label: { RoundIcon(icon: "ic-user") }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Profile and settings")
            }

            week

            HStack(spacing: 16) {
                ZStack {
                    Ring(progress: eaten.kcal / Double(max(t.calories, 1)))
                    VStack(spacing: 2) {
                        Text(whole(abs(left))).font(.system(size: 26, weight: .heavy)).tracking(-1).monospacedDigit()
                        Text(left >= 0 ? "kcal left" : "kcal over").mono()
                    }
                }
                .frame(width: 130, height: 130)
                VStack(alignment: .leading, spacing: 10) {
                    stat("Eaten", "\(whole(eaten.kcal)) kcal")
                    stat("Burned", "≈ \(whole(burned)) kcal")
                    stat("Target", "\(t.calories.formatted()) kcal")
                }
            }
            .card()

            HStack(alignment: .top, spacing: 12) {
                macro("Protein", eaten.protein, Double(t.protein))
                macro("Carbs", eaten.carbs, Double(t.carbs))
                macro("Fat", eaten.fat, Double(t.fat))
            }
            .card()

            session

            if let next = nextMeal {
                HStack(spacing: 12) {
                    RoundIcon(icon: "ic-meal")
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(next.slot.label) · \(next.slot.time)").fontWeight(.bold)
                        Text(next.name).font(.system(size: 13)).foregroundStyle(Theme.mute).lineLimit(2)
                    }
                    Spacer()
                    Button { store.log(next, slot: next.slot) } label: { Pill(text: "Log") }.buttonStyle(.plain)
                }
                .card()
            }

            HStack(spacing: 12) {
                RoundIcon(icon: "ic-drop")
                VStack(alignment: .leading, spacing: 2) {
                    Text("Water").fontWeight(.bold)
                    Text("\(num(Double(store.water(on: today)) / 1000)) of \(num(t.waterL)) L").font(.system(size: 13)).foregroundStyle(Theme.mute)
                }
                Spacer()
                Button { store.addWater(250, on: today) } label: { Pill(text: "+ 250 ml") }.buttonStyle(.plain)
            }
            .card()
        }
    }

    private var week: some View {
        let cal = Calendar.current
        let start = cal.date(byAdding: .day, value: -6, to: cal.startOfDay(for: today)) ?? today
        return HStack {
            ForEach(0..<7, id: \.self) { i in
                let day = cal.date(byAdding: .day, value: i, to: start) ?? today
                let done = !store.workouts(on: day).isEmpty
                VStack(spacing: 6) {
                    Text(day.formatted(.dateTime.weekday(.narrow))).mono()
                    ZStack {
                        Circle().fill(done ? Theme.ink : Color.clear)
                        Circle().stroke(i == 6 && !done ? Theme.signal : (done ? Theme.ink : Theme.tile), lineWidth: 1.5)
                        if done { Icon("ic-check", size: 12).foregroundStyle(Theme.paper) }
                    }
                    .frame(width: 24, height: 24)
                }
                .frame(maxWidth: .infinity)
            }
        }
    }

    private var session: some View {
        let done = store.workouts(on: today)
        return HStack(spacing: 12) {
            RoundIcon(icon: "ic-gym", filled: !done.isEmpty)
            VStack(alignment: .leading, spacing: 2) {
                if let w = done.last {
                    Text("\(w.title) done").fontWeight(.bold)
                    Text("\(whole(w.minutes)) min · ≈ \(whole(w.kcal)) kcal").font(.system(size: 13)).foregroundStyle(Theme.mute)
                } else if let r = store.plannedRoutine(on: today) {
                    Text(r.name).fontWeight(.bold)
                    Text("\(r.exerciseIDs.count) exercises").font(.system(size: 13)).foregroundStyle(Theme.mute)
                } else {
                    Text("No gym session planned").fontWeight(.bold)
                    Text("A walk, run or yoga still counts").font(.system(size: 13)).foregroundStyle(Theme.mute)
                }
            }
            Spacer()
            Button { showStart = true } label: { Pill(text: "Start", style: .gradient) }.buttonStyle(.plain)
        }
        .card()
    }

    /// The first meal slot today with nothing logged yet.
    private var nextMeal: MealIdea? {
        for slot in MealSlot.allCases where store.logs(on: today, slot: slot).isEmpty {
            return store.planned(slot, on: today)
        }
        return nil
    }

    private func stat(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(title).mono()
            Text(value).font(.system(size: 15, weight: .bold))
        }
    }

    private func macro(_ title: String, _ value: Double, _ target: Double) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title).mono()
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text(whole(value)).font(.system(size: 17, weight: .bold))
                Text("/\(whole(target))").font(.system(size: 12)).foregroundStyle(Theme.mute)
            }
            Bar(progress: value / max(target, 1))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
