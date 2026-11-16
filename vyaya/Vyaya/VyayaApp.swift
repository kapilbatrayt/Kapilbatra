import SwiftUI

@main
struct VyayaApp: App {
    @StateObject private var store = Store()

    var body: some Scene {
        WindowGroup {
            Group {
                if store.data.profile.onboarded {
                    RootView()
                } else {
                    OnboardingView()
                }
            }
            .environmentObject(store)
            .preferredColorScheme(scheme)
            .tint(Theme.signal)
        }
    }

    private var scheme: ColorScheme? {
        switch store.data.profile.theme {
        case 1: return .light
        case 2: return .dark
        default: return nil
        }
    }
}

struct RootView: View {
    @State private var tab = 0
    @State private var showStart = false

    var body: some View {
        ZStack(alignment: .bottom) {
            Theme.paper.ignoresSafeArea()
            Group {
                switch tab {
                case 0: TodayView(tab: $tab, showStart: $showStart)
                case 1: TrainView(showStart: $showStart)
                case 2: DietView()
                default: ProgressTabView()
                }
            }
            TabBar(tab: $tab, showStart: $showStart)
        }
        .fullScreenCover(isPresented: $showStart) {
            StartView()
        }
    }
}

struct TabBar: View {
    @Binding var tab: Int
    @Binding var showStart: Bool

    var body: some View {
        HStack(spacing: 0) {
            item(0, "Today", "ic-home")
            item(1, "Train", "ic-gym")
            Button {
                showStart = true
            } label: {
                Icon("ic-play", size: 22)
                    .foregroundStyle(Color.white)
                    .frame(width: 54, height: 54)
                    .background(Theme.gradient)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Start workout")
            .frame(maxWidth: .infinity)
            item(2, "Diet", "ic-diet")
            item(3, "Progress", "ic-chart")
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 30, style: .continuous))
        .shadow(color: Color.black.opacity(0.12), radius: 14, y: 6)
        .padding(.horizontal, 16)
        .padding(.bottom, 6)
    }

    private func item(_ index: Int, _ title: String, _ icon: String) -> some View {
        Button {
            tab = index
        } label: {
            VStack(spacing: 4) {
                Icon(icon, size: 22)
                Text(title).font(.system(size: 10, weight: .semibold))
            }
            .foregroundStyle(tab == index ? Theme.ink : Theme.mute)
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
    }
}

/// Shared page scaffold: scrolling content on paper, with room for the floating tab bar.
struct Page<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                content
            }
            .padding(.horizontal, 18)
            .padding(.top, 12)
            .padding(.bottom, 110)
        }
        .background(Theme.paper)
    }
}
