import SwiftUI
import PhotosUI
import CoreImage
import CoreImage.CIFilterBuiltins
import Vision
import UIKit

// MARK: The Vyaya filter

enum Grade: String, CaseIterable, Identifiable {
    case signal, dusk, paper, chrome, none
    var id: String { rawValue }
    var label: String { rawValue.capitalized }

    /// Dark and light ends of the duotone.
    var colors: (CIColor, CIColor)? {
        switch self {
        case .signal: return (CIColor(red: 0.02, green: 0.02, blue: 0.02), CIColor(red: 0.95, green: 0.2, blue: 0.14))
        case .dusk: return (CIColor(red: 0.1, green: 0.02, blue: 0), CIColor(red: 0.96, green: 0.48, blue: 0.16))
        case .paper: return (CIColor(red: 0.04, green: 0.04, blue: 0.05), CIColor(red: 0.95, green: 0.94, blue: 0.92))
        case .chrome: return (CIColor(red: 0, green: 0, blue: 0), CIColor(red: 1, green: 1, blue: 1))
        case .none: return nil
        }
    }

    var lightText: Bool { self != .paper && self != .chrome }
}

enum VyayaFilter {
    private static let context = CIContext()

    /// Motion-blurs the person, leaves the background sharp, then applies the duotone grade and grain.
    static func apply(_ image: UIImage, grade: Grade, blur: Double) -> UIImage {
        guard let cg = normalized(image).cgImage else { return image }
        let base = CIImage(cgImage: cg)
        let extent = base.extent
        var output = base

        if blur > 1 {
            let motion = CIFilter.motionBlur()
            motion.inputImage = base.clampedToExtent()
            motion.radius = Float(blur)
            motion.angle = 0
            let blurred = (motion.outputImage ?? base).cropped(to: extent)
            if let mask = personMask(cg, extent: extent, blur: blur) {
                let blend = CIFilter.blendWithRedMask()
                blend.inputImage = blurred
                blend.backgroundImage = base
                blend.maskImage = mask
                output = blend.outputImage ?? base
            } else {
                // No person found: smear the left half and keep the right half sharp.
                let ramp = CIFilter.linearGradient()
                ramp.point0 = CGPoint(x: extent.width * 0.45, y: 0)
                ramp.point1 = CGPoint(x: extent.width * 0.65, y: 0)
                ramp.color0 = CIColor.white
                ramp.color1 = CIColor.black
                let blend = CIFilter.blendWithMask()
                blend.inputImage = blurred
                blend.backgroundImage = base
                blend.maskImage = (ramp.outputImage ?? base).cropped(to: extent)
                output = blend.outputImage ?? base
            }
        }

        if let (dark, light) = grade.colors {
            let duotone = CIFilter.falseColor()
            duotone.inputImage = output
            duotone.color0 = dark
            duotone.color1 = light
            output = duotone.outputImage ?? output
        }

        if let noise = CIFilter.randomGenerator().outputImage {
            let grain = noise
                .applyingFilter("CIColorControls", parameters: [kCIInputSaturationKey: 0])
                .applyingFilter("CIColorMatrix", parameters: ["inputAVector": CIVector(x: 0, y: 0, z: 0, w: 0.07)])
                .cropped(to: extent)
            output = grain.composited(over: output)
        }

        guard let result = context.createCGImage(output, from: extent) else { return image }
        return UIImage(cgImage: result)
    }

    /// White where the person is, widened sideways so the smear trails past their outline.
    private static func personMask(_ cg: CGImage, extent: CGRect, blur: Double) -> CIImage? {
        let request = VNGeneratePersonSegmentationRequest()
        request.qualityLevel = .balanced
        request.outputPixelFormat = kCVPixelFormatType_OneComponent8
        let handler = VNImageRequestHandler(cgImage: cg, options: [:])
        do {
            try handler.perform([request])
        } catch {
            return nil
        }
        guard let buffer = request.results?.first?.pixelBuffer else { return nil }
        let raw = CIImage(cvPixelBuffer: buffer)
        guard raw.extent.width > 0, raw.extent.height > 0 else { return nil }
        let scaled = raw.transformed(by: CGAffineTransform(scaleX: extent.width / raw.extent.width, y: extent.height / raw.extent.height))
        let stats = CIFilter.areaAverage()
        stats.inputImage = scaled
        stats.extent = extent
        var pixel = [UInt8](repeating: 0, count: 4)
        if let average = stats.outputImage {
            context.render(average, toBitmap: &pixel, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1),
                           format: .RGBA8, colorSpace: nil)
        }
        if pixel[0] < 3 { return nil }
        let spread = CIFilter.motionBlur()
        spread.inputImage = scaled.clampedToExtent()
        spread.radius = Float(blur * 0.8)
        spread.angle = 0
        return (spread.outputImage ?? scaled).cropped(to: extent)
    }

    /// Fixes rotation and limits the size so the filter stays fast.
    private static func normalized(_ image: UIImage) -> UIImage {
        let longest = max(image.size.width, image.size.height)
        let scale = longest > 1600 ? 1600 / longest : 1
        let size = CGSize(width: (image.size.width * scale).rounded(), height: (image.size.height * scale).rounded())
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            image.draw(in: CGRect(origin: .zero, size: size))
        }
    }
}

// MARK: Share screen

struct ShareView: View {
    @Environment(\.dismiss) private var dismiss
    let workout: Workout

    @State private var mode = 0
    @State private var item: PhotosPickerItem?
    @State private var source: UIImage?
    @State private var filtered: UIImage?
    @State private var grade = Grade.signal
    @State private var blur = 40.0
    @State private var shareItems: ShareItems?
    @State private var saved = false

    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 6) {
                Button { mode = 0 } label: { Pill(text: "Photo", style: mode == 0 ? .ink : .soft) }.buttonStyle(.plain)
                Button { mode = 1 } label: { Pill(text: "Sticker", style: mode == 1 ? .ink : .soft) }.buttonStyle(.plain)
                Spacer()
                RoundButton(icon: "ic-close") { dismiss() }
            }

            if mode == 0 {
                ShareCard(workout: workout, image: filtered ?? source, lightText: source == nil || grade.lightText)
                    .aspectRatio(9.0 / 16.0, contentMode: .fit)
                    .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
                    .frame(maxHeight: .infinity)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        PhotosPicker(selection: $item, matching: .images) { Pill(text: source == nil ? "Choose photo" : "Change photo", style: .gradient) }
                        ForEach(Grade.allCases) { g in
                            Button { grade = g } label: { Pill(text: g.label, style: grade == g ? .ink : .soft) }.buttonStyle(.plain)
                        }
                    }
                }
                HStack {
                    Text("Blur · person only").mono()
                    Slider(value: $blur, in: 0...120)
                }
            } else {
                ZStack {
                    Checker().clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
                    Sticker(workout: workout, light: true).padding(24)
                }
                .frame(maxHeight: .infinity)
                Text("Saved with no background. Paste it over any photo or video in Instagram.")
                    .font(.system(size: 13)).foregroundStyle(Theme.mute).multilineTextAlignment(.center)
            }

            GradientButton(title: "Share", icon: "ic-share") { share() }
            SoftButton(title: saved ? "Saved to Photos" : "Save to Photos", icon: "ic-save") { save() }
        }
        .padding(18)
        .foregroundStyle(Theme.ink)
        .background(Theme.paper.ignoresSafeArea())
        .environment(\.colorScheme, .dark)
        .task(id: item) {
            guard let item else { return }
            if let data = try? await item.loadTransferable(type: Data.self), let image = UIImage(data: data) {
                source = image
                filtered = nil
            }
        }
        .task(id: "\(grade.rawValue)-\(Int(blur))-\(source?.hash ?? 0)") {
            guard let source else { return }
            let g = grade
            let b = blur
            try? await Task.sleep(nanoseconds: 150_000_000)
            if Task.isCancelled { return }
            let result = await Task.detached(priority: .userInitiated) {
                VyayaFilter.apply(source, grade: g, blur: b)
            }.value
            if !Task.isCancelled { filtered = result }
        }
        .sheet(item: $shareItems) { items in
            ActivitySheet(items: items.items)
        }
    }

    @MainActor private func render() -> (UIImage, URL)? {
        let image: UIImage?
        if mode == 0 {
            let renderer = ImageRenderer(content: ShareCard(workout: workout, image: filtered ?? source, lightText: source == nil || grade.lightText)
                .frame(width: 360, height: 640))
            renderer.scale = 3
            image = renderer.uiImage
        } else {
            let renderer = ImageRenderer(content: Sticker(workout: workout, light: true).padding(24).frame(width: 360))
            renderer.scale = 3
            renderer.isOpaque = false
            image = renderer.uiImage
        }
        guard let image, let data = image.pngData() else { return nil }
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(mode == 0 ? "vyaya-share.png" : "vyaya-sticker.png")
        try? data.write(to: url, options: .atomic)
        return (image, url)
    }

    @MainActor private func share() {
        guard let (_, url) = render() else { return }
        shareItems = ShareItems(items: [url])
    }

    @MainActor private func save() {
        guard let (image, url) = render() else { return }
        if mode == 1, let data = try? Data(contentsOf: url), let png = UIImage(data: data) {
            UIImageWriteToSavedPhotosAlbum(png, nil, nil, nil)
        } else {
            UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
        }
        saved = true
    }
}

struct ShareItems: Identifiable {
    let id = UUID()
    let items: [Any]
}

struct ActivitySheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ controller: UIActivityViewController, context: Context) {}
}

// MARK: Card and sticker

private func headline(_ workout: Workout) -> String {
    if workout.kind == .gym { return "\(whole(workout.volume)) KG" }
    return workout.distanceKm > 0 ? String(format: "%.1f KM", workout.distanceKm) : "\(whole(workout.minutes)) MIN"
}

private func detail(_ workout: Workout) -> String {
    var parts = ["\(whole(workout.minutes)) min", "≈ \(whole(workout.kcal)) kcal"]
    if workout.prCount > 0 { parts.append("\(workout.prCount) PR") }
    return parts.joined(separator: " · ")
}

/// Photo with the lockup across the middle and stats at the bottom.
struct ShareCard: View {
    let workout: Workout
    let image: UIImage?
    let lightText: Bool

    var body: some View {
        let ink = lightText ? Color(hex: 0xF4F3EF) : Color(hex: 0x121214)
        GeometryReader { geo in
            ZStack {
                if let image {
                    Image(uiImage: image).resizable().scaledToFill().frame(width: geo.size.width, height: geo.size.height).clipped()
                } else {
                    Color(hex: 0x050505)
                    LinearGradient(colors: [Color.clear, Color(hex: 0xE8281E), Color(hex: 0xF26A1B)], startPoint: .leading, endPoint: .trailing)
                        .frame(height: geo.size.height * 0.5).blur(radius: 50).offset(x: 40, y: geo.size.height * 0.2)
                }
                HStack {
                    Text("Vyaya").tracking(2)
                    Spacer()
                    VyayaMark().fill(ink).frame(width: 28, height: 28)
                    Spacer()
                    Text(workout.title).tracking(2)
                }
                .font(.system(size: 10, weight: .medium, design: .monospaced))
                .textCase(.uppercase)
                .padding(.horizontal, 18)
                VStack(alignment: .leading, spacing: 6) {
                    Text(workout.date.formatted(.dateTime.day().month(.abbreviated).year()))
                        .font(.system(size: 10, weight: .medium, design: .monospaced)).textCase(.uppercase)
                    Spacer()
                    Text(headline(workout)).font(.system(size: 48, weight: .heavy)).tracking(-2).minimumScaleFactor(0.5).lineLimit(1)
                    Text(detail(workout)).font(.system(size: 10, weight: .medium, design: .monospaced)).textCase(.uppercase)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                .padding(18)
            }
            .foregroundStyle(ink)
        }
    }
}

/// Stats only, drawn on a clear background.
struct Sticker: View {
    let workout: Workout
    let light: Bool

    var body: some View {
        let ink = light ? Color.white : Color.black
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                VyayaMark().fill(ink).frame(width: 22, height: 22)
                Text("Vyaya · \(workout.title)").font(.system(size: 11, weight: .medium, design: .monospaced)).textCase(.uppercase)
            }
            Text(headline(workout)).font(.system(size: 56, weight: .heavy)).tracking(-2).minimumScaleFactor(0.5).lineLimit(1)
            Text(detail(workout)).font(.system(size: 11, weight: .medium, design: .monospaced)).textCase(.uppercase)
        }
        .foregroundStyle(ink)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// Checkerboard that stands for a transparent background.
struct Checker: View {
    var body: some View {
        Canvas { context, size in
            let cell: CGFloat = 14
            let columns = Int(size.width / cell) + 1
            let rows = Int(size.height / cell) + 1
            for row in 0..<rows {
                for column in 0..<columns {
                    let dark = (row + column) % 2 == 0
                    context.fill(Path(CGRect(x: CGFloat(column) * cell, y: CGFloat(row) * cell, width: cell, height: cell)),
                                 with: .color(dark ? Color(hex: 0x2A2A2E) : Color(hex: 0x1C1C1F)))
                }
            }
        }
    }
}
