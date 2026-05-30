# Project Design Rules and Architecture

## 1. Directory Structure
- `src/components`: UI Components, structured by feature or domain (e.g., `Modals`, `Garden`, `LiveBackground`).
- `src/data`: Static data, constants, and structured text (e.g., `adhkar.js`).
- `src/utils`: Helper functions, color maps, theme generation, etc.
- `src/hooks`: Custom React hooks for separating business logic from components.
- `src/assets`: Images, icons, or audio files.

## 2. File Size and Modularity
- **Maximum File Length**: No file should exceed 500 lines of code. If it does, refactor it into smaller, manageable sub-components or extract its logic into custom hooks.
- **Single Responsibility Principle**: Each component should do one thing well. A file should export one main component.

## 3. State Management
- Complex states should be moved out of `App.jsx` and managed either via Context API or localized inside custom hooks (`useDhikrProgress`, `useTheme`, etc.).
- Avoid prop drilling; use Context for globally required state (like theme colors, user settings, sound/vibration preferences).

## 4. UI/UX and Theming
- Continue using Tailwind CSS for styling.
- Maintain the dark/light mode functionality.
- Ensure all components respect the dynamic `colorTheme` variables.
- Keep the aesthetic "premium" and engaging with animations, glassmorphism, and responsive design.

## 5. Performance
- Use `React.lazy` and `Suspense` for heavy components (like `Garden3D.jsx`) to avoid blocking the initial bundle load.
- Optimize images, textures, and 3D objects using low-poly design.
