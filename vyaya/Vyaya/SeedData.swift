import Foundation

/// Built-in foods, meals, exercises and routines. Nutrition values are approximate, per portion shown.
enum Seed {
    private static func f(_ id: String, _ name: String, _ unit: String, _ kcal: Double, _ p: Double, _ c: Double, _ fat: Double,
                          _ fibre: Double, _ ca: Double, _ fe: Double, _ tags: [String], avoid: Bool = false) -> Food {
        Food(id: id, name: name, unit: unit,
             n: Nutrients(kcal: kcal, protein: p, carbs: c, fat: fat, fibre: fibre, calcium: ca, iron: fe), tags: tags, avoid: avoid)
    }

    static let foods: [Food] = [
        // From the diet chart and whiteboards
        f("nuts", "Soaked nuts", "5 almonds + 2 walnuts", 90, 2.5, 2.5, 8.3, 1.3, 25, 0.5, ["recipe"]),
        f("tea", "Tea, no sugar", "1 cup", 35, 1.5, 2.5, 1.5, 0, 50, 0, ["recipe"]),
        f("oatmeal", "Oatmeal", "1 bowl", 190, 7, 30, 4.5, 4, 110, 1.6, ["recipe"]),
        f("avotoast", "Avocado toast", "1 slice", 190, 4, 17, 12, 5, 30, 1, ["recipe"]),
        f("paneersandwich", "Paneer sandwich", "1", 280, 13, 30, 12, 3, 220, 1.5, ["recipe"]),
        f("poha", "Poha", "1 plate", 250, 5, 40, 8, 2, 20, 2.5, ["recipe", "indian"]),
        f("chilla", "Besan chilla", "1", 120, 6, 15, 4, 3, 20, 1.5, ["recipe", "indian"]),
        f("dalia", "Vegetable dalia", "1 katori", 160, 5, 28, 3, 4, 25, 1.5, ["recipe", "indian"]),
        f("upma", "Upma", "1 katori", 200, 5, 30, 7, 2.5, 20, 1.2, ["recipe", "indian"]),
        f("idli", "Idli", "2", 120, 4, 24, 0.5, 1.5, 15, 0.8, ["recipe", "indian"]),
        f("sprouts", "Sprouts bowl", "1 katori", 110, 8, 18, 0.8, 5, 30, 1.8, ["recipe", "indian"]),
        f("apple", "Apple", "1 medium", 95, 0.5, 25, 0.3, 4.4, 11, 0.2, ["recipe"]),
        f("kiwi", "Kiwi", "1", 42, 0.8, 10, 0.4, 2.1, 23, 0.2, ["recipe"]),
        f("guava", "Guava", "1 medium", 68, 2.5, 14, 1, 5.4, 18, 0.3, ["recipe"]),
        f("appleyogurt", "Apple with yogurt", "1 bowl", 155, 4, 30, 3.3, 4.4, 130, 0.3, ["recipe"]),
        f("besanmirchi", "Besan mirchi", "1 katori", 150, 5, 12, 9, 3, 30, 1.4, ["recipe", "indian"]),
        f("gwar", "Gwar sabzi", "1 katori", 90, 3, 9, 5, 4, 80, 1.2, ["recipe", "indian"]),
        f("bhindi", "Bhindi", "1 katori", 100, 2.5, 9, 6, 3.5, 70, 0.8, ["recipe", "indian"]),
        f("kalachana", "Kala chana masala", "1 katori", 210, 11, 30, 5, 9, 60, 3.5, ["recipe", "indian"]),
        f("chole", "Chole", "1 katori", 220, 10, 30, 7, 8, 60, 3, ["recipe", "indian"]),
        f("lauki", "Lauki", "1 katori", 80, 2, 8, 4, 3, 30, 0.6, ["recipe", "indian"]),
        f("pyazpaneer", "Pyaz paneer", "1 katori", 240, 12, 8, 18, 1.5, 300, 0.5, ["recipe", "indian"]),
        f("beans", "Beans ki sabzi", "1 katori", 90, 3, 10, 4.5, 4, 45, 1, ["recipe", "indian"]),
        f("kaddu", "Kaddu", "1 katori", 95, 2, 12, 4.5, 2.5, 30, 0.8, ["recipe", "indian"]),
        f("dal", "Dal", "1 katori", 150, 8, 20, 4, 4, 30, 2, ["recipe", "indian"]),
        f("roastedpaneer", "Roasted paneer", "50 g", 133, 9, 0.6, 10.4, 0, 240, 0.1, ["recipe", "indian"]),
        f("uttapam", "Paneer uttapam", "1", 230, 10, 28, 8, 2, 150, 1, ["recipe", "indian"]),
        f("bejadroti", "Bejad roti", "1", 100, 3.5, 19, 1, 3.5, 15, 1.2, ["recipe", "indian"]),
        f("multigrain", "Multigrain chapati", "1", 105, 3.5, 20, 1.2, 3, 15, 1.1, ["recipe", "indian"]),
        f("salad", "Salad", "half plate", 30, 1.5, 6, 0.2, 2.5, 30, 0.6, ["recipe"]),
        f("raita", "Raita", "100 g", 60, 3.3, 4.7, 3, 0.3, 120, 0.1, ["recipe", "indian"]),
        f("chaach", "Chaach", "1 glass", 40, 2, 3, 1.5, 0, 90, 0.1, ["recipe", "indian"]),
        f("dahi", "Dahi", "1 katori", 90, 5, 7, 4.5, 0, 180, 0.1, ["recipe", "indian"]),
        f("chutney", "Green chutney", "1 tbsp", 10, 0.4, 1.5, 0.2, 0.6, 15, 0.4, ["recipe", "indian"]),
        f("makhana", "Makhana", "1 katori", 70, 2, 15, 0.1, 0.5, 12, 0.3, ["recipe", "indian"]),
        f("peanuts", "Peanuts", "1 handful", 115, 5, 3, 10, 1.7, 18, 0.9, ["recipe"]),
        f("roastedchana", "Roasted chana", "1 katori", 120, 6, 18, 2, 5, 30, 1.5, ["recipe", "indian"]),
        f("biscuit", "Biscuit", "1", 40, 0.6, 6, 1.5, 0.2, 5, 0.2, ["recipe"]),
        // Egg recipes
        f("boiledegg", "Boiled egg", "1 large", 78, 6.3, 0.6, 5.3, 0, 25, 0.9, ["egg"]),
        f("eggwhites", "Egg whites", "2", 34, 7.2, 0.4, 0.1, 0, 4, 0, ["egg"]),
        f("bhurji", "Egg bhurji", "2 eggs", 210, 13, 4, 16, 0.8, 60, 2, ["egg", "indian"]),
        f("omelette", "Masala omelette", "2 eggs", 220, 13, 3, 17, 0.5, 60, 2, ["egg", "indian"]),
        f("whiteomelette", "Egg white omelette", "3 whites", 90, 11, 2, 4, 0.3, 10, 0.2, ["egg"]),
        f("eggcurry", "Egg curry", "2 eggs", 260, 14, 8, 19, 1.5, 70, 2.3, ["egg", "indian"]),
        f("scrambledtoast", "Scrambled eggs on toast", "2 eggs + 1 toast", 280, 15, 16, 17, 2, 80, 2.2, ["egg"]),
        f("eggsandwich", "Egg sandwich", "1", 300, 15, 30, 13, 3, 90, 2.5, ["egg"]),
        f("eggchaat", "Egg chaat", "2 eggs", 180, 13, 5, 11, 1, 55, 1.9, ["egg", "indian"]),
        f("eggsalad", "Egg salad", "1 bowl", 200, 13, 7, 13, 2.5, 70, 2, ["egg"]),
        f("eggdosa", "Egg dosa", "1", 240, 10, 28, 9, 1.5, 40, 1.6, ["egg", "indian"]),
        f("bhurjiroll", "Bhurji roti roll", "1", 310, 16, 24, 17, 4, 75, 3.2, ["egg", "indian"]),
        f("shakshuka", "Shakshuka", "2 eggs", 250, 14, 12, 16, 3, 80, 2.6, ["egg"]),
        // Common Indian foods
        f("rice", "Rice", "1 katori", 195, 4, 42, 0.4, 0.6, 15, 0.3, ["indian"]),
        f("rajma", "Rajma", "1 katori", 180, 9, 25, 5, 7, 50, 2.8, ["indian"]),
        f("paneer", "Paneer", "100 g", 265, 18, 1.2, 20.8, 0, 480, 0.2, ["indian"]),
        f("ghee", "Ghee", "1 tsp", 45, 0, 0, 5, 0, 0, 0, ["indian"]),
        f("samosa", "Samosa", "1 piece", 260, 4, 30, 14, 2, 20, 1, ["indian"], avoid: true),
        f("paratha", "Aloo paratha", "1", 290, 6, 40, 12, 4, 30, 1.6, ["indian"], avoid: true),
        f("banana", "Banana", "1 medium", 105, 1.3, 27, 0.4, 3.1, 6, 0.3, [], avoid: true),
        f("whey", "Whey protein", "1 scoop", 120, 24, 3, 1.5, 0, 120, 0.4, [])
    ]

    private static let foodIndex: [String: Food] = Dictionary(uniqueKeysWithValues: foods.map { ($0.id, $0) })

    static func food(_ id: String) -> Food {
        foodIndex[id] ?? Food(id: id, name: id, unit: "1", n: Nutrients())
    }

    private static func m(_ id: String, _ slot: MealSlot, _ name: String, _ items: [(String, Double)]) -> MealIdea {
        MealIdea(id: id, slot: slot, name: name, items: items.map { MealItem(foodID: $0.0, qty: $0.1) })
    }

    /// Whole meals taken from the whiteboard days, plus egg options.
    static let ideas: [MealIdea] = [
        m("w1", .wake, "Soaked nuts and tea", [("nuts", 1), ("tea", 1)]),
        m("b1", .breakfast, "2 besan chilla, chutney", [("chilla", 2), ("chutney", 1)]),
        m("b2", .breakfast, "Oatmeal", [("oatmeal", 1)]),
        m("b3", .breakfast, "Avocado toast", [("avotoast", 2)]),
        m("b4", .breakfast, "Masala omelette, 1 roti", [("omelette", 1), ("bejadroti", 1)]),
        m("b5", .breakfast, "Poha", [("poha", 1)]),
        m("b6", .breakfast, "Paneer sandwich", [("paneersandwich", 1)]),
        m("b7", .breakfast, "Egg bhurji, 1 roti", [("bhurji", 1), ("bejadroti", 1)]),
        m("f1", .fruit, "Apple", [("apple", 1)]),
        m("f2", .fruit, "Apple with yogurt", [("appleyogurt", 1)]),
        m("f3", .fruit, "Guava", [("guava", 1)]),
        m("f4", .fruit, "Kiwi", [("kiwi", 2)]),
        m("l1", .lunch, "Salad, 2 roti, dal, bhindi", [("salad", 1), ("bejadroti", 2), ("dal", 1), ("bhindi", 1)]),
        m("l2", .lunch, "Kala chana, 2 roti, raita, salad", [("kalachana", 1), ("bejadroti", 2), ("raita", 1), ("salad", 1)]),
        m("l3", .lunch, "Chole, 2 roti, salad, dahi", [("chole", 1), ("bejadroti", 2), ("salad", 1), ("dahi", 1)]),
        m("l4", .lunch, "Pyaz paneer, 2 roti, salad, raita", [("pyazpaneer", 1), ("bejadroti", 2), ("salad", 1), ("raita", 1)]),
        m("l5", .lunch, "Besan mirchi, gwar, 2 roti, chaach", [("besanmirchi", 1), ("gwar", 1), ("bejadroti", 2), ("chaach", 1), ("salad", 1)]),
        m("l6", .lunch, "Lauki, 1 roti, salad, chaach", [("lauki", 1), ("bejadroti", 1), ("salad", 1), ("chaach", 1)]),
        m("s1", .snack, "Tea and makhana", [("tea", 1), ("makhana", 1)]),
        m("s2", .snack, "Tea and peanuts", [("tea", 1), ("peanuts", 1)]),
        m("s3", .snack, "Roasted chana", [("roastedchana", 1)]),
        m("s4", .snack, "2 boiled eggs", [("boiledegg", 2)]),
        m("s5", .snack, "Roasted paneer", [("roastedpaneer", 1)]),
        m("d1", .dinner, "Kala chana, dal, 2 roti", [("kalachana", 1), ("dal", 1), ("bejadroti", 2)]),
        m("d2", .dinner, "Beans ki sabzi, 2 chapati, dal", [("beans", 1), ("multigrain", 2), ("dal", 1)]),
        m("d3", .dinner, "Roasted paneer, sabzi, 2 chapati, salad", [("roastedpaneer", 1), ("bhindi", 1), ("multigrain", 2), ("salad", 1)]),
        m("d4", .dinner, "Kaddu, dal, 1 roti", [("kaddu", 1), ("dal", 1), ("bejadroti", 1)]),
        m("d5", .dinner, "Vegetable dalia", [("dalia", 2)]),
        m("d6", .dinner, "Egg curry, 2 roti, salad", [("eggcurry", 1), ("bejadroti", 2), ("salad", 1)]),
        m("d7", .dinner, "Paneer uttapam, chutney, dahi", [("uttapam", 1), ("chutney", 1), ("dahi", 1)])
    ]

    private static func e(_ id: String, _ name: String, _ muscle: String, _ equipment: String) -> Exercise {
        Exercise(id: id, name: name, muscle: muscle, equipment: equipment)
    }

    /// Starter library. The full 800+ exercise set is planned as a later import.
    static let exercises: [Exercise] = [
        e("bench", "Bench press", "Chest", "Barbell"), e("inclinedb", "Incline dumbbell press", "Chest", "Dumbbell"),
        e("pushup", "Push-up", "Chest", "Bodyweight"), e("cablefly", "Cable fly", "Chest", "Cable"),
        e("chestpress", "Machine chest press", "Chest", "Machine"),
        e("latpull", "Lat pulldown", "Back", "Cable"), e("row", "Barbell row", "Back", "Barbell"),
        e("seatedrow", "Seated cable row", "Back", "Cable"), e("dbrow", "One-arm dumbbell row", "Back", "Dumbbell"),
        e("pullup", "Pull-up", "Back", "Bodyweight"), e("deadlift", "Deadlift", "Back", "Barbell"),
        e("ohp", "Overhead press", "Shoulders", "Barbell"), e("dbpress", "Dumbbell shoulder press", "Shoulders", "Dumbbell"),
        e("lateral", "Lateral raise", "Shoulders", "Dumbbell"), e("facepull", "Face pull", "Shoulders", "Cable"),
        e("curl", "Barbell curl", "Biceps", "Barbell"), e("dbcurl", "Dumbbell curl", "Biceps", "Dumbbell"),
        e("hammer", "Hammer curl", "Biceps", "Dumbbell"),
        e("pushdown", "Triceps pushdown", "Triceps", "Cable"), e("skull", "Skull crusher", "Triceps", "Barbell"),
        e("dips", "Dips", "Triceps", "Bodyweight"),
        e("squat", "Back squat", "Legs", "Barbell"), e("goblet", "Goblet squat", "Legs", "Dumbbell"),
        e("legpress", "Leg press", "Legs", "Machine"), e("lunge", "Walking lunge", "Legs", "Dumbbell"),
        e("legext", "Leg extension", "Legs", "Machine"), e("legcurl", "Leg curl", "Legs", "Machine"),
        e("rdl", "Romanian deadlift", "Legs", "Barbell"), e("hipthrust", "Hip thrust", "Glutes", "Barbell"),
        e("calf", "Standing calf raise", "Calves", "Machine"),
        e("plank", "Plank", "Core", "Bodyweight"), e("crunch", "Cable crunch", "Core", "Cable"),
        e("legraise", "Hanging leg raise", "Core", "Bodyweight"), e("russian", "Russian twist", "Core", "Bodyweight")
    ]

    private static let exerciseIndex: [String: Exercise] = Dictionary(uniqueKeysWithValues: exercises.map { ($0.id, $0) })

    static func exercise(_ id: String) -> Exercise {
        exerciseIndex[id] ?? Exercise(id: id, name: id, muscle: "", equipment: "")
    }

    static let routines: [Routine] = [
        Routine(id: "fba", name: "Full body A", exerciseIDs: ["goblet", "bench", "latpull", "dbpress", "legcurl", "plank"]),
        Routine(id: "fbb", name: "Full body B", exerciseIDs: ["legpress", "inclinedb", "seatedrow", "lateral", "rdl", "crunch"]),
        Routine(id: "push", name: "Push", exerciseIDs: ["bench", "inclinedb", "ohp", "lateral", "pushdown", "dips"]),
        Routine(id: "pull", name: "Pull", exerciseIDs: ["deadlift", "latpull", "row", "facepull", "curl", "hammer"]),
        Routine(id: "legs", name: "Legs", exerciseIDs: ["squat", "legpress", "rdl", "legext", "legcurl", "calf"]),
        Routine(id: "upper", name: "Upper body", exerciseIDs: ["bench", "row", "dbpress", "latpull", "dbcurl", "pushdown"]),
        Routine(id: "lower", name: "Lower body", exerciseIDs: ["squat", "rdl", "lunge", "hipthrust", "calf", "legraise"])
    ]
}
