import SwiftUI

struct SlotChoice: Identifiable {
    let slot: MealSlot
    var id: String { slot.rawValue }
}

struct DietView: View {
    @EnvironmentObject var store: Store
    @State private var picking: SlotChoice?
    @State private var suggesting: SlotChoice?
    private let today = Date()

    var body: some View {
        let t = store.targets
        let eaten = store.totals(on: today)

        Page {
            Text("Diet").heading()

            VStack(alignment: .leading, spacing: 10) {
                HStack(alignment: .firstTextBaseline) {
                    Text(whole(eaten.kcal)).font(.system(size: 26, weight: .heavy)).monospacedDigit()
                    Text("/ \(t.calories.formatted()) kcal").foregroundStyle(Theme.mute)
                    Spacer()
                    Text("\(whole(max(0, Double(t.calories) - eaten.kcal))) left").foregroundStyle(Theme.mute)
                }
                Bar(progress: eaten.kcal / Double(max(t.calories, 1)), gradient: true)
                HStack(spacing: 12) {
                    mini("Protein", eaten.protein, Double(t.protein), "g")
                    mini("Fibre", eaten.fibre, Double(t.fibre), "g")
                    mini("Calcium", eaten.calcium, 1000, "mg")
                    mini("Iron", eaten.iron, 19, "mg")
                }
            }
            .card()

            ForEach(MealSlot.allCases) { slot in
                slotCard(slot)
            }
        }
        .sheet(item: $picking) { choice in
            FoodPickerView(slot: choice.slot)
        }
        .sheet(item: $suggesting) { choice in
            SuggestView(slot: choice.slot)
        }
    }

    private func mini(_ title: String, _ value: Double, _ target: Double, _ unit: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).mono()
            Text("\(whole(value))/\(whole(target))").font(.system(size: 12, weight: .bold)).lineLimit(1).minimumScaleFactor(0.7)
            Bar(progress: value / max(target, 1))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    @ViewBuilder private func slotCard(_ slot: MealSlot) -> some View {
        let logged = store.logs(on: today, slot: slot)
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 12) {
                RoundIcon(icon: logged.isEmpty ? "ic-meal" : "ic-check", filled: !logged.isEmpty)
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(slot.label) · \(slot.time)").fontWeight(.bold)
                    if logged.isEmpty {
                        Text(store.planned(slot, on: today)?.name ?? "Nothing planned")
                            .font(.system(size: 13)).foregroundStyle(Theme.mute).lineLimit(2)
                    } else {
                        Text("\(whole(logged.reduce(0) { $0 + $1.n.kcal })) kcal").font(.system(size: 13)).foregroundStyle(Theme.mute)
                    }
                }
                Spacer()
                if logged.isEmpty, let plan = store.planned(slot, on: today) {
                    Button { store.log(plan, slot: slot) } label: { Pill(text: "Log", style: .gradient) }.buttonStyle(.plain)
                }
            }
            ForEach(logged) { item in
                HStack {
                    Text("\(num(item.qty)) × \(item.name)").font(.system(size: 14))
                    Spacer()
                    Text("\(whole(item.n.kcal)) kcal").font(.system(size: 13)).foregroundStyle(Theme.mute)
                    Button { store.remove(item) } label: { Icon("ic-close", size: 14).foregroundStyle(Theme.mute) }
                        .buttonStyle(.plain)
                        .accessibilityLabel("Remove \(item.name)")
                }
            }
            HStack(spacing: 8) {
                Button { picking = SlotChoice(slot: slot) } label: { Pill(text: "Add food") }.buttonStyle(.plain)
                Button { suggesting = SlotChoice(slot: slot) } label: { Pill(text: "Suggest me") }.buttonStyle(.plain)
            }
        }
        .card()
    }
}

// MARK: Suggest me

struct SuggestView: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss
    let slot: MealSlot

    var body: some View {
        let today = Date()
        let left = Double(store.targets.calories) - store.totals(on: today).kcal
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("Suggest me").heading()
                    Spacer()
                    RoundButton(icon: "ic-close") { dismiss() }
                }
                Text("\(slot.label). \(whole(max(0, left))) kcal left today.").foregroundStyle(Theme.mute)
                ForEach(store.suggestions(for: slot, on: today)) { idea in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(idea.name).fontWeight(.bold)
                        Text("≈ \(whole(idea.total.kcal)) kcal · \(whole(idea.total.protein)) g protein").font(.system(size: 13)).foregroundStyle(Theme.mute)
                        Button {
                            store.log(idea, slot: slot)
                            dismiss()
                        } label: { Pill(text: "Use this", style: .gradient) }
                        .buttonStyle(.plain)
                    }
                    .card()
                }
                Text("From your recipes, highest protein first.").font(.system(size: 13)).foregroundStyle(Theme.mute)
            }
            .padding(18)
        }
        .background(Theme.paper.ignoresSafeArea())
    }
}

// MARK: Food picker

struct FoodPickerView: View {
    @EnvironmentObject var store: Store
    @Environment(\.dismiss) private var dismiss
    let slot: MealSlot
    @State private var query = ""
    @State private var filter = "all"
    @State private var selected: Food?
    @State private var showCustom = false
    private let filters = [("all", "All"), ("recipe", "My recipes"), ("indian", "Indian"), ("egg", "Eggs"), ("custom", "Custom")]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let food = selected {
                FoodDetailView(food: food, slot: slot, onBack: { selected = nil }) { dismiss() }
            } else if showCustom {
                CustomFoodView(onBack: { showCustom = false }) { food in
                    showCustom = false
                    selected = food
                }
            } else {
                list
            }
        }
        .padding(18)
        .background(Theme.paper.ignoresSafeArea())
    }

    private var results: [Food] {
        store.allFoods.filter { food in
            let matchesFilter = filter == "all" || food.tags.contains(filter)
            let matchesQuery = query.isEmpty || food.name.localizedCaseInsensitiveContains(query)
            return matchesFilter && matchesQuery
        }
    }

    private var list: some View {
        Group {
            HStack {
                Text("Add to \(slot.label.lowercased())").font(.system(size: 22, weight: .heavy))
                Spacer()
                RoundButton(icon: "ic-close") { dismiss() }
            }
            HStack(spacing: 8) {
                Icon("ic-search", size: 18).foregroundStyle(Theme.mute)
                TextField("Search food", text: $query).autocorrectionDisabled()
            }
            .card(12)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(filters, id: \.0) { f in
                        Button { filter = f.0 } label: { Pill(text: f.1, style: filter == f.0 ? .ink : .soft) }.buttonStyle(.plain)
                    }
                }
            }
            ScrollView {
                VStack(spacing: 8) {
                    ForEach(results) { food in
                        Button { selected = food } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(food.name).fontWeight(.semibold)
                                    Text("\(food.unit) · \(whole(food.n.kcal)) kcal · P \(num(food.n.protein)) g").font(.system(size: 12)).foregroundStyle(Theme.mute)
                                }
                                Spacer()
                                if food.avoid { Icon("ic-flag", size: 16).foregroundStyle(Theme.ember) }
                            }
                            .foregroundStyle(Theme.ink)
                            .card(12)
                        }
                        .buttonStyle(.plain)
                    }
                    SoftButton(title: "Custom food or recipe", icon: "ic-plus") { showCustom = true }
                }
            }
        }
    }
}

struct FoodDetailView: View {
    @EnvironmentObject var store: Store
    let food: Food
    let slot: MealSlot
    let onBack: () -> Void
    let onAdded: () -> Void
    @State private var qty = 1.0

    var body: some View {
        let t = store.targets
        let n = food.n.times(qty)
        let after = store.totals(on: Date()) + n

        HStack {
            RoundButton(icon: "ic-back", action: onBack)
            Spacer()
            Text("Add to \(slot.label.lowercased())").fontWeight(.bold)
            Spacer()
            Color.clear.frame(width: 40, height: 40)
        }
        HStack {
            Text(food.name).heading()
            Spacer()
            if food.avoid {
                HStack(spacing: 4) {
                    Icon("ic-flag", size: 14)
                    Text("Avoid list").font(.system(size: 13, weight: .semibold))
                }
                .foregroundStyle(Theme.ember)
            }
        }
        HStack {
            Text("Portion · \(food.unit)")
            Spacer()
            RoundButton(icon: "ic-minus", size: 32) { qty = max(0.5, qty - 0.5) }
            Text(num(qty)).font(.system(size: 17, weight: .bold)).monospacedDigit().frame(minWidth: 36)
            RoundButton(icon: "ic-plus", size: 32) { qty += 0.5 }
        }
        .card(14)
        HStack(spacing: 14) {
            ZStack {
                Ring(progress: n.kcal / Double(max(t.calories, 1)), width: 10)
                VStack(spacing: 0) {
                    Text(whole(n.kcal)).font(.system(size: 22, weight: .heavy)).monospacedDigit()
                    Text("kcal").mono()
                }
            }
            .frame(width: 96, height: 96)
            cell("Carbs", n.carbs)
            cell("Fat", n.fat)
            cell("Protein", n.protein)
        }
        .card()
        VStack(alignment: .leading, spacing: 8) {
            Text("Your day after adding").mono()
            line("Calories", after.kcal, Double(t.calories), "", gradient: true)
            line("Protein", after.protein, Double(t.protein), " g")
            line("Fibre", after.fibre, Double(t.fibre), " g")
            Text("Calcium \(whole(after.calcium)) mg · Iron \(num((after.iron * 10).rounded() / 10)) mg")
                .font(.system(size: 13)).foregroundStyle(Theme.mute)
        }
        .card()
        Spacer()
        GradientButton(title: "Add to \(slot.label.lowercased())") {
            store.log(food, qty: qty, slot: slot)
            onAdded()
        }
    }

    private func cell(_ title: String, _ value: Double) -> some View {
        VStack(spacing: 2) {
            Text("\(num((value * 10).rounded() / 10)) g").fontWeight(.bold)
            Text(title).mono()
        }
        .frame(maxWidth: .infinity)
    }

    private func line(_ title: String, _ value: Double, _ target: Double, _ unit: String, gradient: Bool = false) -> some View {
        VStack(spacing: 5) {
            HStack {
                Text(title)
                Spacer()
                Text("\(whole(value)) / \(whole(target))\(unit)").fontWeight(.bold)
            }
            Bar(progress: value / max(target, 1), gradient: gradient)
        }
    }
}

struct CustomFoodView: View {
    @EnvironmentObject var store: Store
    let onBack: () -> Void
    let onSaved: (Food) -> Void
    @State private var name = ""
    @State private var unit = "1 katori"
    @State private var kcal = ""
    @State private var protein = ""
    @State private var carbs = ""
    @State private var fat = ""
    @State private var fibre = ""

    var body: some View {
        HStack {
            RoundButton(icon: "ic-back", action: onBack)
            Spacer()
            Text("Custom food").fontWeight(.bold)
            Spacer()
            Color.clear.frame(width: 40, height: 40)
        }
        ScrollView {
            VStack(spacing: 8) {
                field("Name", $name, numeric: false)
                field("Portion (for example 1 katori)", $unit, numeric: false)
                field("Calories per portion", $kcal)
                field("Protein, g", $protein)
                field("Carbs, g", $carbs)
                field("Fat, g", $fat)
                field("Fibre, g", $fibre)
            }
        }
        GradientButton(title: "Save food") {
            let food = Food(id: "custom-" + UUID().uuidString, name: name.isEmpty ? "My food" : name, unit: unit,
                            n: Nutrients(kcal: value(kcal), protein: value(protein), carbs: value(carbs), fat: value(fat), fibre: value(fibre)),
                            tags: ["custom"])
            store.data.customFoods.append(food)
            onSaved(food)
        }
    }

    private func value(_ text: String) -> Double {
        Double(text.replacingOccurrences(of: ",", with: ".")) ?? 0
    }

    private func field(_ title: String, _ text: Binding<String>, numeric: Bool = true) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).mono()
            TextField(title, text: text).keyboardType(numeric ? .decimalPad : .default)
        }
        .card(12)
    }
}
