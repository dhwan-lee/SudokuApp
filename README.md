# 🧩 React Native Sudoku Game

A modern, interactive $9 \times 9$ Sudoku puzzle game built from scratch using React Native, Expo, and TypeScript. 

---

## 🚀 Features Built So Far

- **Milestone 1:** Designed a full $9 \times 9$ layout with responsive sizing.
- **Milestone 1.5:** Dynamic Flexbox grids with bold, customized borders creating distinct $3 \times 3$ sub-grids and a prominent outer board frame.
- **Milestone 2:** Integrated `useState` short-term memory hooks and `TouchableOpacity` triggers to dynamically highlight selected cells in light blue upon tapping.
- **Milestone 3:** Separated static puzzle data into an independent matrix module (`startingBoards.ts`) and engineered a dynamic 2D array grid-rendering loop.
- **Milestone 4:** Developed a fully interactive on-screen custom circular Number Pad controller with immutable state clone handling.
- **Milestone 5:** Enforced strict game rules by rendering original numbers as read-only, distinct bold black assets, while isolating user-inputted numbers into a distinct player-blue color scheme.
- **Milestone 6:** Integrated a dedicated custom cell erasing controller (`⌫`) targeting unmapped entries.
- **Milestone 7:** Abstracted complex game logic into a modular algorithmic utility library (`sudokuUtils.ts`) featuring real-time row, column, and $3 \times 3$ sub-grid conflict tracking.
- **Milestone 8:** Engineered an automated, cross-platform win detector using React Native's `Platform` manager to handle native mobile notifications and web browser alerts seamlessly.
- **Milestone 9 (Unified State Reset):** Integrated a clean "Reset Board" layout option that flushes current user grids, resets highlighting maps, and re-initializes memory matrices perfectly.
- **Milestone 10 (Premium UX & Performance Optimization):** 
  - *Identical Digit Focus:* Softly illuminates every identical value on the grid when a cell is selected, facilitating fast-scanning UX.
  - *Performance Tracker:* Implemented an optimized background interval tick loop via `useEffect` with built-in character padding (`MM:SS`) to prevent character width layout shifting.
  - *Multi-Tier Level Profiles:* Structured dynamic state machines allowing users to toggle on-demand between Easy, Medium, and Hard layout pools seamlessly.
- **Milestone 11 (Recursive Backtracking AI Engine):** Engineered an automated constraint-satisfaction solver module using a Depth-First Search (DFS) recursive backtracking algorithm. The processor evaluates board logic states, manages algorithmic call-stacks, and solves empty grids instantly while handling unsolvable conflict grids cleanly.
- **Milestone 12 (Adaptive Core Systems & Storage Integration):** 
  - *Adaptive Strike System:* Added context-aware game-over barriers tailored dynamically to your chosen difficulty level (Easy: 10 lives, Medium: 5 lives, Hard: 3 lives).
  - *Smart Hint Generation:* Created an algorithmic lookahead constraint calculation module capable of instantly solving and filling a single targeted cell when a player is stuck.
  - *Persistent High Scores:* Installed and integrated `@react-native-async-storage/async-storage` to cache, read, and display personal best times safely across app reboots and device restarts.
- **Milestone 13 (Dynamic Infinite Board Generation):** Developed a complete randomized board synthesizer. It utilizes a Fisher-Yates shuffle algorithm to generate completely unique, valid completed boards, then carves out empty cells dynamically depending on the selected difficulty tier—eliminating the need for static matrix blueprints entirely.
- **Milestone 14 (Frictionless Silent Cloud Authentication):** Integrated Firebase Anonymous Authentication to silently provision unique cloud identities ($uid$) on application boot. Configured a smart platform-split architecture that routes through standard browser memory hooks on Web (`localhost`) while binding native hardware persistence on iOS/Android via AsyncStorage pipelines.
- **Milestone 15 (Real-Time Cloud Synchronization & Security Isolation):** Structured a real-time data sync channel connecting the app directly to Cloud Firestore. Configured the persistence engine to push verified high scores and multi-tier difficulty performance benchmarks automatically upon board completion. Deployed declarative database security rules enforcing document isolation paths matching incoming auth signatures (`/users/{userId}`).
---

## 🛠️ Tech Stack

- **Framework:** React Native (Expo Workflow)
- **Language:** TypeScript (Strictly typed array matrices & hooks)
- **Styling:** StyleSheet (Flexbox, Conditional Element Overlays)
- **Logic:** Decoupled functional utility algorithms
- **Storage:** AsyncStorage (Local Key-Value Caching System)
---

## 💻 How To Run the Project Locally

Follow these steps to spin up the development environment on your own machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/dhwan-lee/SudokuApp](https://github.com/dhwan-lee/SudokuApp.git)