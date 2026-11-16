import Foundation

enum Sex: String, Codable, CaseIterable, Identifiable {
    case male, female
    var id: String { rawValue }
    var label: String { self == .male ? "Male" : "Female" }
}

enum DayActivity: String, Codable, CaseIterable, Identifiable {
    case sitting, onFeet, physical
    var id: String { rawValue }
    var label: String {
        switch self {
        case .sitting: return "Mostly sitting"
        case .onFeet: return "On my feet"
        case .physical: return "Physical"
        }
    }
    var factor: Double {
        switch self {
        case .sitting: return 1.2
        case .onFeet: return 1.35
        case .physical: return 1.5
        }
    }
}

enum WorkoutKind: String, Codable, CaseIterable, Identifiable {
    case gym, run, ride, walk, yoga, home
    var id: String { rawValue }
    var label: String {
        switch self {
        case .gym: return "Gym"
        case .run: return "Run"
        case .ride: return "Ride"
        case .walk: return "Walk"
        case .yoga: return "Yoga"
        case .home: return "Home"
        }
    }
    var icon: String { "ic-" + rawValue }
    /// Metabolic equivalent used for the calorie estimate when no distance is known.
    var met: Double {
        switch self {
        case .gym: return 5.0
        case .run: return 9.8
        case .ride: return 7.5
        case .walk: return 3.8
        case .yoga: return 3.0
        case .home: return 6.0
        }
    }
    var tracksDistance: Bool { self == .run || self == .ride || self == .walk }
}

enum MealSlot: String, Codable, CaseIterable, Identifiable {
    case wake, breakfast, fruit, lunch, snack, dinner
    var id: String { rawValue }
    var label: String {
        switch self {
        case .wake: return "On waking"
        case .breakfast: return "Breakfast"
        case .fruit: return "Fruit"
        case .lunch: return "Lunch"
        case .snack: return "Snack"
        case .dinner: return "Dinner"
        }
    }
    var time: String {
        switch self {
        case .wake: return "7:00"
        case .breakfast: return "8:30"
        case .fruit: return "11:00"
        case .lunch: return "1:30"
        case .snack: return "5:00"
        case .dinner: return "8:30"
        }
    }
}

struct Nutrients: Codable, Hashable {
    var kcal: Double = 0
    var protein: Double = 0
    var carbs: Double = 0
    var fat: Double = 0
    var fibre: Double = 0
    var calcium: Double = 0
    var iron: Double = 0

    static func + (a: Nutrients, b: Nutrients) -> Nutrients {
        Nutrients(kcal: a.kcal + b.kcal, protein: a.protein + b.protein, carbs: a.carbs + b.carbs, fat: a.fat + b.fat,
                  fibre: a.fibre + b.fibre, calcium: a.calcium + b.calcium, iron: a.iron + b.iron)
    }
    func times(_ q: Double) -> Nutrients {
        Nutrients(kcal: kcal * q, protein: protein * q, carbs: carbs * q, fat: fat * q,
                  fibre: fibre * q, calcium: calcium * q, iron: iron * q)
    }
}

struct Food: Codable, Identifiable, Hashable {
    var id: String
    var name: String
    var unit: String
    var n: Nutrients
    var tags: [String] = []
    var avoid: Bool = false
}

struct FoodLog: Codable, Identifiable {
    var id = UUID()
    var date = Date()
    var slot: MealSlot
    var name: String
    var unit: String
    var qty: Double
    var n: Nutrients
}

struct MealItem: Hashable {
    let foodID: String
    let qty: Double
}

struct MealIdea: Identifiable, Hashable {
    let id: String
    let slot: MealSlot
    let name: String
    let items: [MealItem]
    var total: Nutrients {
        items.reduce(Nutrients()) { $0 + Seed.food($1.foodID).n.times($1.qty) }
    }
}

struct Exercise: Identifiable, Hashable {
    let id: String
    let name: String
    let muscle: String
    let equipment: String
}

struct Routine: Identifiable, Hashable {
    let id: String
    let name: String
    let exerciseIDs: [String]
}

struct SetEntry: Codable, Identifiable {
    var id = UUID()
    var exerciseID: String
    var weight: Double
    var reps: Int
    var isPR: Bool = false
}

struct Workout: Codable, Identifiable {
    var id = UUID()
    var date = Date()
    var kind: WorkoutKind
    var title: String
    var minutes: Double
    var kcal: Double
    var sets: [SetEntry] = []
    var distanceKm: Double = 0

    var volume: Double { sets.reduce(0) { $0 + $1.weight * Double($1.reps) } }
    var prCount: Int { sets.filter { $0.isPR }.count }
}

struct WeightEntry: Codable, Identifiable {
    var id = UUID()
    var date = Date()
    var kg: Double
}

struct Targets {
    var calories: Int
    var protein: Int
    var carbs: Int
    var fat: Int
    var fibre: Int
    var waterL: Double
    var bmr: Int
    var maintenance: Int
}

struct Profile: Codable {
    var onboarded = false
    var age = 30
    var sex = Sex.male
    var heightCm = 175.0
    var weightKg = 75.0
    var targetKg = 70.0
    var pace = 0.5
    var activity = DayActivity.sitting
    var sessionsPerWeek = 4
    var kinds: [WorkoutKind] = [.gym, .walk, .yoga]
    var customCalories: Int? = nil
    var customProtein: Int? = nil
    /// 0 follows the phone, 1 light, 2 dark. Light is the default.
    var theme = 1

    /// Targets worked out from the setup answers (Mifflin-St Jeor resting burn).
    var calculated: Targets {
        let bmr = 10 * weightKg + 6.25 * heightCm - 5 * Double(age) + (sex == .male ? 5 : -161)
        let factor = min(1.9, activity.factor + 0.035 * Double(sessionsPerWeek))
        let maintenance = bmr * factor
        let deficit = targetKg < weightKg ? pace * 7700 / 7 : 0
        let calories = max(bmr, maintenance - deficit)
        let protein = 1.8 * weightKg
        let fat = calories * 0.25 / 9
        let carbs = max(0, (calories - protein * 4 - fat * 9) / 4)
        return Targets(calories: Int((calories / 10).rounded()) * 10, protein: Int(protein.rounded()), carbs: Int(carbs.rounded()),
                       fat: Int(fat.rounded()), fibre: Int((14 * calories / 1000).rounded()),
                       waterL: (weightKg * 0.035 * 10).rounded() / 10, bmr: Int(bmr.rounded()), maintenance: Int(maintenance.rounded()))
    }

    /// Calculated targets with any numbers the user set by hand applied on top.
    var targets: Targets {
        var t = calculated
        if let c = customCalories {
            t.calories = c
            let fat = Double(c) * 0.25 / 9
            t.fat = Int(fat.rounded())
            t.carbs = Int(max(0, (Double(c) - Double(customProtein ?? t.protein) * 4 - fat * 9) / 4).rounded())
            t.fibre = Int((14 * Double(c) / 1000).rounded())
        }
        if let p = customProtein { t.protein = p }
        return t
    }
}
