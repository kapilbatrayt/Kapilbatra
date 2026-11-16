import SwiftUI
import Combine

// MARK: Train tab

struct TrainView: View {
    @EnvironmentObject var store: Store
    @Binding var showStart: Bool

    var body: some View {
        Page {
            Text("Train").heading()
            GradientButton(title: "Start a workout", icon: "ic-play") { showStart = true }

            Text("Recent sessions").mono().padding(.top, 8)
            if store.data.workouts.isEmpty {
                Text("Nothing logged yet. Your sessions will appear here.").foregroundStyle(Theme.mute).card()
            }
            ForEach(store.data.workouts.suffix(8).reversed()) { w in
                HStack(spacing: 12) {
                    RoundIcon(icon: w.kind.icon)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(w.title).fontWeight(.bold)
                        Text("\(w.date.formatted(.dateTime.day().month(.abbreviated))) · \(whole(w.minutes)) min · ≈ \(whole(w.kcal)) kcal")
                            .font(.system(size: 13)).foregroundStyle(Theme.mute)
                    }
                    Spacer()
                    if w.prCount > 0 { PRBadge() }
                }
                .card()
            }

            Text("Exercise library").mono().padding(.top, 8)
            ForEach(muscles, id: \.self) { muscle in
                VStack(alignment: .leading, spacing: 8) {
                    Text(muscle).fontWeight(.bold)
                    ForEach(Seed.exercises.filter { $0.muscle == muscle }) { ex in
                        HStack {
                            Text(ex.name)
                            Spacer()
                            let best = store.best(for: ex.id)
                            Text(best > 0 ? "Best \(num(best)) kg" : ex.equipment).font(.system(size: 13)).foregroundStyle(Theme.mute)
                        }
                    }
                }
                .card()
            }
        }
    }

    private var muscles: [String] {
        var seen: [String] = []
        for ex in Seed.exercises where !seen.contains(ex.muscle) { seen.append(ex.muscle) }
        return seen
    }
}

// MARK: Start flow

struct StartView: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss
    @State private var routine: Routine?
    @State private var kind: WorkoutKind?
    @State private var finished: Workout?

    var body: some View {
        Group {
            if let workout = finished {
                SummaryView(workout: workout) { dismiss() }
            } else if let routine {
                GymLoggerView(routine: routine, onCancel: { self.routine = nil }) { workout in
                    store.add(workout)
                    finished = workout
                }
            } else if let kind {
                TimedSessionView(kind: kind, onCancel: { self.kind = nil }) { workout in
                    store.add(workout)
                    finished = workout
                }
            } else {
                picker
            }
        }
        .background(Theme.paper.ignoresSafeArea())
    }

    private var picker: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("Start a workout").heading()
                    Spacer()
                    RoundButton(icon: "ic-close") { dismiss() }
                }
                if let planned = store.plannedRoutine(on: Date()) {
                    HStack(spacing: 12) {
                        RoundIcon(icon: "ic-gym", filled: true)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Planned today").mono()
                            Text(planned.name).fontWeight(.bold)
                        }
                        Spacer()
                        Button { routine = planned } label: { Pill(text: "Start", style: .gradient) }.buttonStyle(.plain)
                    }
                    .card()
                }
                Text("Pick a type").mono().padding(.top, 6)
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8), GridItem(.flexible(), spacing: 8)], spacing: 8) {
                    ForEach(WorkoutKind.allCases.filter { $0 != .gym }) { k in
                        ChoiceTile(title: k.label, icon: k.icon, on: false) { kind = k }
                    }
                }
                Text("Gym routines").mono().padding(.top, 6)
                ForEach(Seed.routines) { r in
                    Button { routine = r } label: {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(r.name).fontWeight(.bold)
                                Text(r.exerciseIDs.map { Seed.exercise($0).name }.joined(separator: ", "))
                                    .font(.system(size: 13)).foregroundStyle(Theme.mute).lineLimit(2).multilineTextAlignment(.leading)
                            }
                            Spacer()
                            Icon("ic-play", size: 16)
                        }
                        .foregroundStyle(Theme.ink)
                        .card()
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(18)
        }
    }
}

// MARK: Gym logger

struct GymLoggerView: View {
    @EnvironmentObject var store: Store
    let routine: Routine
    let onCancel: () -> Void
    let onFinish: (Workout) -> Void

    @State private var index = 0
    @State private var sets: [SetEntry] = []
    @State private var weight = 20.0
    @State private var reps = 8
    @State private var started = Date()
    @State private var now = Date()
    @State private var rest = 0
    private let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    private var exercise: Exercise { Seed.exercise(routine.exerciseIDs[index]) }
    private var currentSets: [SetEntry] { sets.filter { $0.exerciseID == exercise.id } }
    private var elapsed: Int { max(0, Int(now.timeIntervalSince(started))) }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                RoundButton(icon: "ic-close", action: onCancel)
                Spacer()
                Text("\(routine.name) · \(index + 1) of \(routine.exerciseIDs.count)").mono()
                Spacer()
                Pill(text: clock(elapsed))
            }
            Text(exercise.name).heading()
            Text(hint).foregroundStyle(Theme.mute)

            ScrollView {
                VStack(spacing: 8) {
                    ForEach(Array(currentSets.enumerated()), id: \.element.id) { i, set in
                        HStack {
                            Text("Set \(i + 1)").mono()
                            Spacer()
                            Text("\(num(set.weight)) kg × \(set.reps)").fontWeight(.bold)
                            if set.isPR { PRBadge() }
                            Spacer()
                            Icon("ic-check", size: 14).foregroundStyle(Theme.paper).frame(width: 28, height: 28).background(Theme.ink).clipShape(Circle())
                        }
                        .card(12)
                    }
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Set \(currentSets.count + 1)").mono()
                        HStack {
                            NumberStepper(value: num(weight), unit: "kg", minus: { weight = max(0, weight - 2.5) }, plus: { weight += 2.5 })
                            Spacer()
                            NumberStepper(value: "\(reps)", unit: "reps", minus: { reps = max(1, reps - 1) }, plus: { reps += 1 })
                        }
                    }
                    .card()
                    if rest > 0 {
                        HStack {
                            Icon("ic-timer", size: 18)
                            Text("Rest")
                            Spacer()
                            Text(clock(rest)).font(.system(size: 24, weight: .heavy)).monospacedDigit()
                            Spacer()
                            Button { rest += 30 } label: { Pill(text: "+30 s") }.buttonStyle(.plain)
                        }
                        .card(12)
                    }
                }
            }

            GradientButton(title: "Done", icon: "ic-check") { logSet() }
            HStack(spacing: 8) {
                if index < routine.exerciseIDs.count - 1 {
                    SoftButton(title: "Next exercise") {
                        index += 1
                        rest = 0
                        prefill()
                    }
                }
                SoftButton(title: "Finish") { finish() }
            }
        }
        .padding(18)
        .onAppear { prefill() }
        .onReceive(timer) { date in
            now = date
            if rest > 0 { rest -= 1 }
        }
    }

    private var hint: String {
        if let last = store.lastSet(for: exercise.id) {
            return "Last time \(num(last.weight)) kg × \(last.reps). Try \(num(last.weight + 2.5)) kg today."
        }
        return "First time. Start light and learn the movement."
    }

    private func prefill() {
        if let mine = currentSets.last {
            weight = mine.weight
            reps = mine.reps
        } else if let last = store.lastSet(for: exercise.id) {
            weight = last.weight
            reps = last.reps
        } else {
            weight = 20
            reps = 8
        }
    }

    private func logSet() {
        let earlier = max(store.best(for: exercise.id), currentSets.map { $0.weight }.max() ?? 0)
        let isPR = earlier > 0 && weight > earlier
        sets.append(SetEntry(exerciseID: exercise.id, weight: weight, reps: reps, isPR: isPR))
        rest = 90
    }

    private func finish() {
        let minutes = max(1, Double(elapsed) / 60)
        let kcal = store.activeCalories(kind: .gym, minutes: minutes, distanceKm: 0)
        onFinish(Workout(kind: .gym, title: routine.name, minutes: minutes, kcal: kcal, sets: sets))
    }
}

func clock(_ seconds: Int) -> String {
    String(format: "%d:%02d", seconds / 60, seconds % 60)
}

// MARK: Timed sessions (run, ride, walk, yoga, home)

struct TimedSessionView: View {
    @EnvironmentObject var store: Store
    let kind: WorkoutKind
    let onCancel: () -> Void
    let onFinish: (Workout) -> Void

    @State private var seconds = 0
    @State private var running = true
    @State private var distance = 0.0
    private let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 16) {
            HStack {
                RoundButton(icon: "ic-close", action: onCancel)
                Spacer()
                Text(kind.label).mono()
                Spacer()
                RoundIcon(icon: kind.icon)
            }
            Spacer()
            Text(clock(seconds)).font(.system(size: 84, weight: .heavy)).tracking(-3).monospacedDigit()
            Text(running ? "Running" : "Paused").mono()
            Text("≈ \(whole(store.activeCalories(kind: kind, minutes: Double(seconds) / 60, distanceKm: distance))) kcal")
                .font(.system(size: 18, weight: .bold))
            if kind.tracksDistance {
                VStack(spacing: 8) {
                    Text("Distance").mono()
                    NumberStepper(value: String(format: "%.1f", distance), unit: "km",
                                  minus: { distance = max(0, distance - 0.1) }, plus: { distance += 0.1 })
                    Text("GPS tracking comes in the next version. Enter the distance for now.")
                        .font(.system(size: 13)).foregroundStyle(Theme.mute).multilineTextAlignment(.center)
                }
                .card()
            }
            Spacer()
            HStack(spacing: 8) {
                SoftButton(title: running ? "Pause" : "Resume") { running.toggle() }
                GradientButton(title: "Finish") { finish() }
            }
        }
        .padding(18)
        .onReceive(timer) { _ in
            if running { seconds += 1 }
        }
    }

    private func finish() {
        let minutes = max(1, Double(seconds) / 60)
        let kcal = store.activeCalories(kind: kind, minutes: minutes, distanceKm: distance)
        onFinish(Workout(kind: kind, title: kind.label, minutes: minutes, kcal: kcal, distanceKm: distance))
    }
}

// MARK: Summary

struct SummaryView: View {
    let workout: Workout
    let onDone: () -> Void
    @State private var showShare = false

    var body: some View {
        ZStack {
            Theme.paper.ignoresSafeArea()
            LinearGradient(colors: [Color.clear, Theme.signal, Theme.ember], startPoint: .leading, endPoint: .trailing)
                .frame(height: 320).blur(radius: 70).opacity(0.7).offset(x: 60, y: 120)
            VStack(alignment: .leading, spacing: 12) {
                Text("\(workout.date.formatted(.dateTime.weekday(.abbreviated).day().month(.abbreviated))) · \(whole(workout.minutes)) min").mono()
                Text("\(workout.title),\ndone.").font(.system(size: 36, weight: .heavy)).tracking(-1)
                Spacer()
                Text(headlineLabel).mono()
                Text(headlineValue).font(.system(size: 64, weight: .heavy)).tracking(-2.5).monospacedDigit().minimumScaleFactor(0.5).lineLimit(1)
                HStack(spacing: 8) {
                    VStack(alignment: .leading, spacing: 6) {
                        Icon("ic-flame", size: 18)
                        Text("≈ \(whole(workout.kcal)) kcal").fontWeight(.bold)
                        Text("Active").mono()
                    }
                    .card()
                    VStack(alignment: .leading, spacing: 6) {
                        if workout.prCount > 0 { PRBadge() } else { Icon("ic-timer", size: 18) }
                        Text(workout.prCount > 0 ? "\(workout.prCount) new" : "\(whole(workout.minutes)) min").fontWeight(.bold)
                        Text(workout.prCount > 0 ? "Personal records" : "Duration").mono()
                    }
                    .card()
                }
                GradientButton(title: "Share", icon: "ic-share") { showShare = true }
                SoftButton(title: "Done", action: onDone)
            }
            .padding(18)
            .foregroundStyle(Theme.ink)
        }
        .environment(\.colorScheme, .dark)
        .sheet(isPresented: $showShare) {
            ShareView(workout: workout)
        }
    }

    private var headlineLabel: String {
        if workout.kind == .gym { return "Lifted" }
        return workout.distanceKm > 0 ? "Distance" : "Time"
    }

    private var headlineValue: String {
        if workout.kind == .gym { return "\(whole(workout.volume)) kg" }
        return workout.distanceKm > 0 ? String(format: "%.1f km", workout.distanceKm) : "\(whole(workout.minutes)) min"
    }
}
