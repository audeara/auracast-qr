# PRD: Auracast QR Generator

## Problem Statement

Venue operators, AV technicians, and Audeara product teams need to generate SIG-compliant Auracast QR codes for physical deployment (signage, printed cards, posters). Currently there is no dedicated tool for this — users must manually construct the `BLUETOOTH:UUID:184F;...` URI string and feed it into a generic QR generator, which is error-prone, technical, and time-consuming. Non-technical users cannot do this at all without assistance.

## Solution

A public, browser-based QR code generator purpose-built for the Bluetooth SIG Broadcast Audio URI (BAU v1.0) specification. Users fill in a friendly form (Broadcast Name, Broadcast ID, Device Address, quality settings, and optional encryption code), see a live QR code preview, customise its appearance, and download a print-ready zip containing both SVG and PNG formats — all client-side with no data sent to a server.

The tool is branded with Audeara's visual identity and deployed publicly to Vercel.

---

## User Stories

### Core Form & URI Generation

1. As a venue operator, I want to type a human-readable Broadcast Name, so that the QR code identifies my audio stream by name.
2. As a venue operator, I want the form to validate that my Broadcast Name is between 4 and 32 characters, so that I don't generate a non-compliant URI.
3. As a venue operator, I want to enter my Broadcast ID as a hex value, so that the QR code uniquely identifies my BIG among multiple transmitters.
4. As a venue operator, I want to enter my Device Address in MAC address format (AA:BB:CC:00:11:22), so that I can copy it directly from my Bluetooth tooling without reformatting.
5. As a venue operator, I want the Device Address field to auto-insert colons as I type, so that entry is fast and error-free.
6. As a venue operator, I want to select my device's Address Type (Public or Random), so that the QR code includes the correct address type flag.
7. As a venue operator, I want to select the audio quality of my broadcast from a dropdown (Not specified / Standard Quality / High Quality / Both), so that compatible devices can identify my stream's quality tier.
8. As a venue operator, I want to tick an "Encrypted" checkbox to reveal a Broadcast Code field, so that encrypted broadcasts can include the decryption key without cluttering the form for unencrypted use cases.
9. As a venue operator, I want to type a plain-text Broadcast Code (up to 16 characters), so that I don't need to understand Base64 or binary encoding.
10. As a venue operator, I want the Broadcast Code field to accept regular text (not a password field), so that I can see what I've typed.
11. As a venue operator, I want the system to automatically Base64-encode my Broadcast Code (null-padded to 16 bytes), so that the URI is always spec-compliant.
12. As a venue operator, I want validation errors to appear when I move away from a field (on blur), so that I'm not interrupted while typing.
13. As a venue operator, I want validation errors to clear as soon as I start correcting them (on change), so that feedback feels responsive.
14. As a venue operator, I want to see a placeholder graphic instead of a QR code until I've entered a valid Broadcast Name (≥ 4 characters), so that I know more information is needed.
15. As a venue operator, I want the QR code to update in real time as I fill in the form, so that I can see the result of each change immediately.

### QR Code Preview & Styling

16. As a user, I want to see a live QR code preview on the same screen as the form, so that I don't have to switch between pages to check my output.
17. As a user, I want the preview to be beside the form on desktop and below it on mobile, so that the layout works well on both screen sizes.
18. As a user, I want the preview panel to remain visible (sticky) as I scroll through the form on desktop, so that I can always see the QR code.
19. As a user, I want the Auracast logo displayed in the centre of the QR code by default, so that the code is immediately recognisable as an Auracast code.
20. As a user, I want to choose between three centre image options: Auracast logo, None, or a custom uploaded image, so that I can adapt the QR code for different branding contexts.
21. As a user, I want any custom image I upload to be automatically centred and resized within the QR code, so that I don't need to pre-crop my image.
22. As a user, I want custom image uploads to be handled entirely in the browser with no image data sent to the server, so that my assets remain private.
23. As a user, I want an "Advanced Styling" accordion section that is collapsed by default, so that the basic form stays clean for non-technical users.
24. As a user, I want to change the QR code foreground colour in the Advanced Styling section, so that I can match it to my brand.
25. As a user, I want to change the QR code background colour in the Advanced Styling section, so that I can place the code on a coloured background.
26. As a user, I want to choose the dot shape of the QR code (square, rounded, dots, and more) in the Advanced Styling section, so that I can create a more visually distinctive code.
27. As a user, I want to choose the corner/eye style of the QR code in the Advanced Styling section, so that I can further customise the appearance.
28. As a user, I want to apply gradient fills to the QR code in the Advanced Styling section, so that I can create visually rich codes for premium deployments.
29. As a user, I want to select the error correction level (L / M / Q / H) in the Advanced Styling section, defaulting to H, so that I can trade off density vs. robustness based on my use case.
30. As a user, I want to select the export resolution (1024 / 2048 / 4096 px) in the Advanced Styling section, defaulting to 2048px, so that I can control the file size and print quality of my output.

### Download

31. As a venue operator, I want to download my QR code as a zip file containing both an SVG and a PNG, so that I have the right format for both digital and print use.
32. As a venue operator, I want the downloaded zip to be named after my Broadcast Name (e.g. `auracast-qr-hockey.zip`), so that files are easy to identify.
33. As a venue operator, I want the PNG to be exported at 2048×2048px by default (with higher resolution options available), so that it is suitable for most print applications without an unnecessarily large file.
34. As a venue operator, I want the SVG export to be a true vector file, so that it can be scaled to any size for large-format print without quality loss.
35. As a venue operator, I want any centre image (including custom uploads) to be embedded directly in the exported files, so that the files are self-contained and the image is not missing when I share them.
36. As a venue operator, I want the zip to be generated entirely in the browser with no server round-trip, so that my data stays private.

### URL State & Shareability

37. As a user, I want all form field values (except uploaded images) to be reflected in the URL query string, so that I can bookmark my configuration.
38. As a user, I want to share a URL with a colleague and have them open the same pre-filled form, so that we can collaborate on a QR code configuration.
39. As a user, I want the URL to update as I change form values without causing a full page reload, so that navigation feels smooth.
40. As a user, I want to see a clear indication in the UI when a custom image is active but not persisted in the URL, so that I understand the image will need to be re-uploaded if I share the link.

### Branding & General UX

41. As a user, I want the app to use Audeara's brand colours and Noto Sans font, so that it feels like an official Audeara product.
42. As a user, I want to see "Powered by Audeara" in the footer with a link to audeara.com, so that the tool's origin is clear.
43. As a user, I want the page title to be "Auracast QR Generator", so that the browser tab is clearly labelled.
44. As a user, I want the tool to be accessible without logging in, so that I can use it immediately.
45. As a user, I want the tool to work well on mobile, so that I can generate QR codes on any device.

---

## Implementation Decisions

### Modules

**URI Encoder (deep module)**
The most critical testable unit. A pure function that accepts a validated form value object and returns a fully spec-compliant `BLUETOOTH:UUID:184F;...;;` URI string. Responsibilities:
- Base64-encode the Broadcast Name (UTF-8)
- Format Broadcast ID as uppercase hex
- Strip colon separators from Device Address and uppercase the result
- Map the Quality dropdown to `SQ` and/or `HQ` bit flags
- Null-pad the Broadcast Code to 16 bytes and Base64-encode it
- Conditionally include `BC` only when Encrypted is true
- Conditionally include `AT`/`AD` only when Device Address is provided
- Terminate the URI with `;;`

**Form Schema (deep module)**
A Zod schema that defines all field constraints:
- `BN`: string, min 4, max 32 UTF-8 characters
- `BI`: string, 1–6 uppercase hex characters
- `AD`: string, exactly 12 hex characters after stripping colons (displayed as MAC format)
- `AT`: enum `0` (Public) | `1` (Random)
- Quality: enum `none` | `sq` | `hq` | `both`
- Encrypted: boolean
- `BC`: string, max 16 characters, required-if Encrypted

**ZIP Exporter (deep module)**
A function that accepts an SVG string, a PNG Blob, and a filename stem; uses `jszip` to produce a downloadable zip Blob. No UI coupling. Browser-native `URL.createObjectURL` triggers the download.

**QR Generator**
Wraps `qr-code-styling`. Accepts a URI string, style configuration object, and a centre image data URI (or null). Returns an SVG string and a PNG Blob at the configured resolution. Browser-dependent; not unit-testable in isolation.

**Image Handler**
Converts a user-uploaded `File` to a data URI via `FileReader`. Serves the bundled Auracast logo SVG (as an inline data URI) when the default option is selected. Returns `null` when "None" is selected. Ensures the QR generator always receives a data URI or null regardless of image source.

**URL State**
`nuqs` parameter configuration that maps each form field to a typed URL search parameter. All text/enum fields are included. The uploaded image is explicitly excluded — only the *selection* (auracast-logo / none / custom) is stored in the URL. A UI notice is shown when `custom` is selected indicating the image is not persisted.

### Architecture

- Standard Next.js app (App Router) deployed to Vercel. No API routes required for the initial version; the server exists to leave the door open for future features (analytics, preset saving).
- All QR generation, URI encoding, image handling, and zip export run entirely client-side. No form data, images, or QR output is transmitted to the server.
- `react-hook-form` manages form state with a Zod resolver. Validation mode is `onBlur` with `reValidateMode: onChange`.
- `nuqs` syncs form values to URL params using `useQueryStates`. The form is initialised from URL params on mount.
- `qr-code-styling` is the QR rendering library (supports custom dot shapes, gradients, centre image, SVG/PNG export).
- `jszip` handles client-side zip creation.

### Key Interactions

- QR preview updates on every `watch` cycle from `react-hook-form` (debounced ~150ms to avoid thrashing).
- Placeholder (a neutral graphic with instructional text) is shown when `BN` has fewer than 4 characters.
- The Device Address input auto-inserts colon separators after every 2 hex characters. The raw 12-character hex value (no colons) is stored in form state and used in URI encoding.
- The "Encrypted" checkbox uses `react-hook-form`'s `watch` to conditionally render and apply `required` validation to the Broadcast Code field.
- The download button is disabled until the QR code has been successfully generated (i.e. `BN` ≥ 4 chars and no validation errors).
- Custom image uploads are processed immediately on file selection and stored as a data URI in component state (not form state, not URL state). A banner appears when a custom image is active noting it is not included in the shareable URL.

### Brand / Styling

- Tailwind CSS with a custom theme extending Audeara's palette:
  - Primary: `#188383`, Primary active: `#005E63`, Light tint: `#E5EFEF`
  - Background: `#F8F8F8`, Surface: `#FFFFFF`, Text: `#1A1A1A`
  - Error: `#DE2A2A`, Success: `#2E9E7B`
- Font: Noto Sans (loaded via Google Fonts or self-hosted)
- Default QR error correction level: H (30% recovery — required for centre image safety)
- Default PNG export size: 2048×2048px

---

## Testing Decisions

**What makes a good test:** Tests should verify the external behaviour of a module given a set of inputs — not its internal implementation. A good test would assert that the URI Encoder produces a specific string given a specific input, not that it called `btoa()` at a particular point.

### Modules to test

**URI Encoder** — highest priority. Unit tests covering:
- Minimum valid input (BN only) produces correct URI structure
- All fields populated produces correct URI with all segments
- Broadcast Name is correctly Base64-encoded
- Broadcast Code is null-padded to 16 bytes before Base64 encoding
- `BC` segment is absent when Encrypted is false
- `AT`/`AD` segments are absent when Device Address is empty
- Quality dropdown maps correctly: `none` → neither SQ nor HQ, `sq` → `SQ:1`, `hq` → `HQ:1`, `both` → `SQ:1;HQ:1`
- Device Address colons are stripped and result is uppercased
- URI always terminates with `;;`

**Form Schema (Zod)** — high priority. Unit tests covering:
- Valid inputs pass all schema rules
- BN below 4 chars fails
- BN above 32 chars fails
- BC above 16 chars fails
- BC is required when Encrypted is true, optional when false
- AD with colons is correctly validated after normalisation
- BI with non-hex characters fails

**ZIP Exporter** — medium priority. Integration tests (requires browser environment via Vitest + jsdom or Playwright) covering:
- Output is a valid zip containing exactly two files
- Files are named correctly (`.svg` and `.png`)
- File sizes are non-zero

### Prior art
This is a greenfield project; there are no existing tests in the codebase to reference. Tests should be written with Vitest (compatible with Next.js and Zod) for the URI Encoder and Form Schema modules.

---

## Out of Scope

- **User authentication or accounts** — the tool is fully public; no login, no saved history.
- **Server-side QR generation** — all generation is client-side.
- **Advanced BAU fields** — Stream Metadata (`SM`), Advertising SID (`AS`), PA Interval (`PI`), Num Subgroups (`NS`), BIS Sync (`BS`), and Vendor Specific (`VS`) fields are not exposed in the UI.
- **NFC tag encoding** — the spec supports NFC as an OOB method; this tool generates QR codes only.
- **Multiple QR codes in one session** — the tool generates one QR code at a time.
- **Preset saving / history** — no backend storage; URL state is the only persistence mechanism.
- **Analytics** — no usage tracking in the initial version.
- **Internationalisation** — English only.

---

## Further Notes

- The Bluetooth SIG BAU specification is v1.0 (adopted 2024-09-10). If a v2.0 is released, the URI Encoder module is the only place that would need updating for spec compliance.
- The Auracast logo asset is a placeholder (red circle SVG) at build time. It will be replaced with the official Auracast SVG provided by the team before launch.
- The centre image coverage of the QR code should not exceed ~30% of the total area to remain reliably scannable even at error correction level H.
- When a custom image is active, a UI notice should clearly state: "Custom images are not included in the shareable URL — your collaborator will need to re-upload."
- The QR code library (`qr-code-styling`) requires a DOM element to render into; the preview component should handle SSR gracefully using a `dynamic` import with `ssr: false`.
