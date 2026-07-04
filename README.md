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
---

## 🛠️ Tech Stack

* **Framework:** React Native (Expo Workflow)
* **Language:** TypeScript
* **State Management:** React Hooks (`useState`)
* **Styling:** React Native `StyleSheet` (Flexbox Engine)

---

## 💻 How To Run the Project Locally

Follow these steps to spin up the development environment on your own machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/dhwan-lee/SudokuApp](https://github.com/dhwan-lee/SudokuApp.git)