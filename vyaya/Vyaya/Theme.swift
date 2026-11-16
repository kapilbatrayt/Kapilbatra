import SwiftUI
import UIKit

extension Color {
    init(hex: UInt) {
        self.init(.sRGB, red: Double((hex >> 16) & 0xFF) / 255, green: Double((hex >> 8) & 0xFF) / 255,
                  blue: Double(hex & 0xFF) / 255, opacity: 1)
    }

    /// A colour that switches with the light or dark theme.
    static func dyn(_ light: UInt, _ dark: UInt) -> Color {
        Color(UIColor { traits in
            traits.userInterfaceStyle == .dark ? UIColor(Color(hex: dark)) : UIColor(Color(hex: light))
        })
    }
}

enum Theme {
    static let paper = Color.dyn(0xF4F3EF, 0x0A0A0B)
    static let surface = Color.dyn(0xFFFFFF, 0x17171A)
    static let tile = Color.dyn(0xEBE9E4, 0x232327)
    static let ink = Color.dyn(0x121214, 0xF4F3EF)
    static let mute = Color.dyn(0x76746F, 0x94928D)
    static let signal = Color.dyn(0xE8281E, 0xFF3B2F)
    static let ember = Color.dyn(0xF26A1B, 0xFF7A2E)
    static let gradient = LinearGradient(colors: [signal, ember], startPoint: .topLeading, endPoint: .bottomTrailing)
}

func num(_ value: Double) -> String {
    value == value.rounded() ? String(Int(value)) : String(format: "%.1f", value)
}

func whole(_ value: Double) -> String {
    Int(value.rounded()).formatted()
}

extension View {
    func card(_ padding: CGFloat = 16) -> some View {
        self.padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
    }

    /// Small uppercase monospaced label.
    func mono() -> some View {
        self.font(.system(size: 10, weight: .medium, design: .monospaced))
            .tracking(1.2)
            .textCase(.uppercase)
            .foregroundStyle(Theme.mute)
    }

    func heading() -> some View {
        self.font(.system(size: 30, weight: .heavy)).tracking(-0.8).foregroundStyle(Theme.ink)
    }
}

struct Icon: View {
    let name: String
    var size: CGFloat = 20

    init(_ name: String, size: CGFloat = 20) {
        self.name = name
        self.size = size
    }

    var body: some View {
        Image(name).renderingMode(.template).resizable().scaledToFit().frame(width: size, height: size)
    }
}

struct GradientButton: View {
    let title: String
    var icon: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon { Icon(icon, size: 18) }
                Text(title).font(.system(size: 16, weight: .bold))
            }
            .foregroundStyle(Color.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Theme.gradient)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

struct SoftButton: View {
    let title: String
    var icon: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon { Icon(icon, size: 18) }
                Text(title).font(.system(size: 15, weight: .bold))
            }
            .foregroundStyle(Theme.ink)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 15)
            .background(Theme.tile)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

enum PillStyle { case soft, gradient, ink }

struct Pill: View {
    let text: String
    var style: PillStyle = .soft

    var body: some View {
        Text(text)
            .font(.system(size: 13, weight: .semibold))
            .lineLimit(1)
            .padding(.horizontal, 14)
            .padding(.vertical, 7)
            .foregroundStyle(style == .soft ? Theme.ink : (style == .ink ? Theme.paper : Color.white))
            .background {
                switch style {
                case .soft: Capsule().fill(Theme.tile)
                case .gradient: Capsule().fill(Theme.gradient)
                case .ink: Capsule().fill(Theme.ink)
                }
            }
    }
}

struct RoundButton: View {
    let icon: String
    var filled = false
    var size: CGFloat = 40
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Icon(icon, size: size * 0.45)
                .foregroundStyle(filled ? Theme.paper : Theme.ink)
                .frame(width: size, height: size)
                .background(filled ? Theme.ink : Theme.tile)
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
    }
}

struct RoundIcon: View {
    let icon: String
    var filled = false

    var body: some View {
        Icon(icon, size: 18)
            .foregroundStyle(filled ? Theme.paper : Theme.ink)
            .frame(width: 40, height: 40)
            .background(filled ? Theme.ink : Theme.tile)
            .clipShape(Circle())
    }
}

struct Ring: View {
    let progress: Double
    var width: CGFloat = 13

    var body: some View {
        ZStack {
            Circle().stroke(Theme.tile, lineWidth: width)
            Circle()
                .trim(from: 0, to: min(max(progress, 0.002), 1))
                .stroke(Theme.gradient, style: StrokeStyle(lineWidth: width, lineCap: .round))
                .rotationEffect(.degrees(-90))
        }
        .padding(width / 2)
    }
}

struct Bar: View {
    let progress: Double
    var gradient = false

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Theme.tile)
                if gradient {
                    Capsule().fill(Theme.gradient).frame(width: geo.size.width * min(max(progress, 0), 1))
                } else {
                    Capsule().fill(Theme.ink).frame(width: geo.size.width * min(max(progress, 0), 1))
                }
            }
        }
        .frame(height: 6)
    }
}

/// A big number with round minus and plus buttons.
struct NumberStepper: View {
    let value: String
    let unit: String
    var numberSize: CGFloat = 32
    let minus: () -> Void
    let plus: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            RoundButton(icon: "ic-minus", action: minus)
            VStack(spacing: 2) {
                Text(value).font(.system(size: numberSize, weight: .heavy)).tracking(-1).monospacedDigit()
                Text(unit).mono()
            }
            .frame(minWidth: 64)
            RoundButton(icon: "ic-plus", action: plus)
        }
    }
}

/// A settings-style row: title on the left, stepper on the right.
struct StepRow: View {
    let title: String
    let value: String
    let minus: () -> Void
    let plus: () -> Void

    var body: some View {
        HStack {
            Text(title).font(.system(size: 15, weight: .medium))
            Spacer()
            RoundButton(icon: "ic-minus", size: 32, action: minus)
            Text(value).font(.system(size: 16, weight: .bold)).monospacedDigit().frame(minWidth: 76)
            RoundButton(icon: "ic-plus", size: 32, action: plus)
        }
        .card(14)
    }
}

/// Grey tile that turns ink when chosen.
struct ChoiceTile: View {
    let title: String
    var icon: String? = nil
    let on: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 14) {
                if let icon { Icon(icon, size: 22) }
                Text(title).font(.system(size: 15, weight: .semibold))
            }
            .foregroundStyle(on ? Theme.paper : Theme.ink)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(14)
            .background(on ? Theme.ink : Theme.tile)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

struct PRBadge: View {
    var body: some View {
        Text("PR")
            .font(.system(size: 10, weight: .bold, design: .monospaced))
            .foregroundStyle(Color.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(Capsule().fill(Theme.gradient))
    }
}

/// The Vyaya mark: a V cut from a single shape.
struct VyayaMark: Shape {
    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height) / 34
        var p = Path()
        p.move(to: CGPoint(x: 3 * s, y: 4 * s))
        p.addLine(to: CGPoint(x: 11 * s, y: 4 * s))
        p.addLine(to: CGPoint(x: 17 * s, y: 16 * s))
        p.addLine(to: CGPoint(x: 23 * s, y: 4 * s))
        p.addLine(to: CGPoint(x: 31 * s, y: 4 * s))
        p.addLine(to: CGPoint(x: 17 * s, y: 31 * s))
        p.closeSubpath()
        return p
    }
}
