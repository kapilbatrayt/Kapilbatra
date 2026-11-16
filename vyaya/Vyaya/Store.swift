import Foundation
import SwiftUI

struct AppData: Codable {
    var profile = Profile()
    var logs: [FoodLog] = []
    var workouts: [Workout] = []
    var weights: [WeightEntry] = []
    var customFoods: [Food] = []
    var water: [String: Int] = [:]
}

/// Everything the app knows, kept in one JSON file on this phone only.
final class Store: ObservableObject {
    @Published var data: AppData {
        didSet { save() }
    }
    private let url: URL

    init() {
        url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("vyaya.json")
        if let raw = try? Data(contentsOf: url), let saved = try? JSONDecoder().decode(AppData.self, from: raw) {
            data = saved
        } else {
            data = AppData()
        }
    }

    private func save() {
        guard let raw = try? JSONEncoder().encode(data) else { return }
        try? raw.write(to: url, options: .atomic)
    }

    static func key(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    var targets: Targets { data.profile.targets }
    var allFoods: [Food] { data.customFoods + Seed.foods }

    // MARK: Food

    func logs(on date: Date) -> [FoodLog] {
        data.logs.filter { Calendar.current.isDate($0.date, inSameDayAs: date) }
    }

    func logs(on date: Date, slot: MealSlot) -> [FoodLog] {
        logs(on: date).filter { $0.slot == slot }
    }

    func totals(on date: Date) -> Nutrients {
        logs(on: date).reduce(Nutrients()) { $0 + $1.n }
    }

    func log(_ food: Food, qty: Double, slot: MealSlot) {
        data.logs.append(FoodLog(slot: slot, name: food.name, unit: food.unit, qty: qty, n: food.n.times(qty)))
    }

    func log(_ idea: MealIdea, slot: MealSlot) {
        var logs = data.logs
        for item in idea.items {
            let food = Seed.food(item.foodID)
            logs.append(FoodLog(slot: slot, name: food.name, unit: food.unit, qty: item.qty, n: food.n.times(item.qty)))
        }
        data.logs = logs
    }

    func remove(_ log: FoodLog) {
        data.logs.removeAll { $0.id == log.id }
    }

    /// The whiteboard-style meal planned for a slot, rotating by day.
    func planned(_ slot: MealSlot, on date: Date) -> MealIdea? {
        let options = Seed.ideas.filter { $0.slot == slot }
        guard !options.isEmpty else { return nil }
        let day = Calendar.current.ordinality(of: .day, in: .year, for: date) ?? 0
        return options[day % options.count]
    }

    /// Up to three meals for a slot that fit the calories left today, highest protein first.
    func suggestions(for slot: MealSlot, on date: Date) -> [MealIdea] {
        let left = Double(targets.calories) - totals(on: date).kcal
        let options = Seed.ideas.filter { $0.slot == slot }
        let fitting = options.filter { $0.total.kcal <= max(left, 150) }
        let pool = fitting.isEmpty ? options : fitting
        return Array(pool.sorted { $0.total.protein > $1.total.protein }.prefix(3))
    }

    func water(on date: Date) -> Int { data.water[Store.key(date)] ?? 0 }

    func addWater(_ ml: Int, on date: Date) {
        data.water[Store.key(date)] = max(0, water(on: date) + ml)
    }

    // MARK: Workouts

    func add(_ workout: Workout) {
        data.workouts.append(workout)
    }

    func workouts(on date: Date) -> [Workout] {
        data.workouts.filter { Calendar.current.isDate($0.date, inSameDayAs: date) }
    }

    func burned(on date: Date) -> Double {
        workouts(on: date).reduce(0) { $0 + $1.kcal }
    }

    /// Heaviest weight ever logged for an exercise.
    func best(for exerciseID: String) -> Double {
        data.workouts.flatMap { $0.sets }.filter { $0.exerciseID == exerciseID }.map { $0.weight }.max() ?? 0
    }

    /// The heaviest set from the most recent session that included this exercise.
    func lastSet(for exerciseID: String) -> SetEntry? {
        for workout in data.workouts.reversed() {
            let sets = workout.sets.filter { $0.exerciseID == exerciseID }
            if let top = sets.max(by: { $0.weight < $1.weight }) { return top }
        }
        return nil
    }

    /// Starter week: full body on Monday, Wednesday and Friday.
    func plannedRoutine(on date: Date) -> Routine? {
        switch Calendar.current.component(.weekday, from: date) {
        case 2, 6: return Seed.routines[0]
        case 4: return Seed.routines[1]
        default: return nil
        }
    }

    func activeCalories(kind: WorkoutKind, minutes: Double, distanceKm: Double) -> Double {
        let kg = data.profile.weightKg
        if kind == .run && distanceKm > 0 { return kg * distanceKm }
        if kind == .walk && distanceKm > 0 { return kg * distanceKm * 0.55 }
        return (kind.met - 1) * 3.5 * kg / 200 * minutes
    }

    // MARK: Weight

    func addWeight(_ kg: Double) {
        var weights = data.weights.filter { !Calendar.current.isDateInToday($0.date) }
        weights.append(WeightEntry(kg: kg))
        data.weights = weights
        data.profile.weightKg = kg
    }

    /// Average of the last seven weigh-ins.
    var trend: Double? {
        let recent = data.weights.suffix(7)
        guard !recent.isEmpty else { return nil }
        return recent.reduce(0) { $0 + $1.kg } / Double(recent.count)
    }

    /// Change between the latest trend and the trend a week of entries earlier.
    var trendChange: Double? {
        guard data.weights.count >= 8, let now = trend else { return nil }
        let earlier = data.weights.dropLast(7).suffix(7)
        guard !earlier.isEmpty else { return nil }
        return now - earlier.reduce(0) { $0 + $1.kg } / Double(earlier.count)
    }
}
