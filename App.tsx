import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { SUDOKU_POOLS } from './startingBoards';
import { checkIsInvalid, checkWinCondition, solveSudokuMatrix } from './sudokuUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const grid_layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // our memory slot. It will track { row: X, col: Y}
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [initialBoard, setInitialBoard] = useState(SUDOKU_POOLS.easy);
  const [board, setBoard] = useState(SUDOKU_POOLS.easy.map(r => [...r]));
  const [selectedCell, setSelectedCell] = useState<{row:number, col:number} | null>(null)

  // Track elapsed seconds
  const [seconds, setSeconds] = useState(0);
  // Track the user's mistake count
  const [mistakes, setMistakes] = useState(0);
  // Track personal best time for each difficulty (0 means no record yet)
  const [bestTimes, setBestTimes] = useState<{ easy: number; medium: number; hard: number }>({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  // Load saved high scores from the device storage on boot
  const loadSavedBestTimes = async() => {
    try {
        const savedData = await AsyncStorage.getItem('SUDOKU_BEST_TIMES');
        if (savedData) {
            setBestTimes(JSON.parse(savedData));
        }
    } catch (error) {
        console.log('Error loading high scores:', error);
    }
  };

  // Run this once when the application boot up
  useEffect(() => {
    loadSavedBestTimes();
  }, []);

  // Helper function to check and save a new high score record
  const checkAndSaveHighScore = async (finalTime: number) => {
    const currentRecord = bestTimes[difficulty];

    // If there's no record yet, or the new time is faster (less seconds)
    if (currentRecord === 0 || finalTime < currentRecord) {
        const updatedRecords = {
            ...bestTimes,
            [difficulty]: finalTime,
        };
      
        setBestTimes(updatedRecords);
        try {
            await AsyncStorage.setItem('SUDOKU_BEST_TIMES', JSON.stringify(updatedRecords));
            if (Platform.OS === 'web') {
            alert(`🏆 New Personal Best Record for ${difficulty.toUpperCase()}!`);
            }
        } catch (error) {
            console.log('Error saving high score:', error);
        }
    }
  };

  // Helper function to determine the max allowed strikes dynamically
  const getMaxMistakes = (level: 'easy' | 'medium' | 'hard'): number => {
    if (level === 'easy') return 10;
    if (level === 'medium') return 5;
    return 3;
  };

  const loadNewDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    const selectedPool = SUDOKU_POOLS[level];
    setDifficulty(level);
    setInitialBoard(selectedPool);
    setBoard(selectedPool.map(r => [...r]));
    setSelectedCell(null);
    setSeconds(0);
    setMistakes(0);
  };

  // Set up the background clock tick interval loop
  useEffect(() => {
    const interval = setInterval(() => {
        setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to convert raw seconds to "MM:SS" layout string
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    const pad = (num: number) => num < 10 ? `0${num}` : num;
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const handleNumberPress = (num: number) => {
    // If no cell is selected, do absolutely nothing
    if (!selectedCell) return;

    // Lock input if they've already hit Game Over limits
    const maxAllowed = getMaxMistakes(difficulty);
    if (mistakes >= maxAllowed) return;
    const { row, col } = selectedCell;
    
    // Create the clean array copy first
    const newBoard = board.map(r => [...r]);

    // Modify the specific slot inside our new copy
    newBoard[row][col] = num;
    // Save the updated board back into our live state
    setBoard(newBoard);

    // Check if this input move violates Sudoku rules
    const isInvalidMove = num !== 0 && checkIsInvalid(row, col, num, board);

    if (isInvalidMove) {
      const updatedMistakes = mistakes + 1;
      setMistakes(updatedMistakes);

      // Check if they just hit their limit
      if (updatedMistakes >= maxAllowed) {
        setTimeout(() => {
          if (Platform.OS === 'web') {
            alert("❌ Game Over! You've exceeded the allowed mistakes for this difficulty.");
          } else {
            Alert.alert("❌ Game Over", "You've exceeded the allowed mistakes for this difficulty.");
          }
          loadNewDifficulty(difficulty); // Force a clean reset
        }, 100);
        return;
      }
    }

    setTimeout(() => {
        // Check if this final move solved puzzle
        if (checkWinCondition(newBoard)) {
            // Check and log high score instantly!
            checkAndSaveHighScore(seconds);
            if (Platform.OS === 'web') {
                // Web browser fallback layout
                alert("🎉 Congratulations! You have successfully solved the Sudoku puzzle perfectly!");
            } else {
                // Native mobile popup layout
                Alert.alert(
                    "🎉 Congratulations!",
                    "You have successfully solved the Sudoku puzzle perfectly!",
                    [{ text: "Awesome!" }]
                );
            }
        }
    }, 50);
  };

  // AI Solver Action Trigger
  const triggerAutoSolver = () => {
    // Clone the current state to avoid direct state manipulation side-effects
    const solverBoardCopy = board.map(r => [...r]);

    if (solveSudokuMatrix(solverBoardCopy)) {
      setBoard(solverBoardCopy);
      setSelectedCell(null); // Clear active selections
      
      // Let the UI finish drawing the filled grid before popping the solver notification
      setTimeout(() => {
        if (Platform.OS === 'web') {
          alert("🤖 AI Solver: Puzzle completed successfully using recursive backtracking!");
        } else {
          Alert.alert("🤖 AI Solver", "Puzzle completed successfully using recursive backtracking!");
        }
      }, 100);
    } else {
      if (Platform.OS === 'web') {
        alert("❌ AI Solver: This puzzle has conflicting inputs and is mathematically unsolvable!");
      } else {
        Alert.alert("❌ AI Solver", "This puzzle has conflicting inputs and is mathematically unsolvable!");
      }
    }
  };

  // Smart Hint Action Trigger
  const triggerSmartHint = () => {
    // Figure out which cell needs a hint (use selected cell, fallback to first empty cell)
    let targetRow: number | undefined = selectedCell?.row;
    let targetCol: number | undefined = selectedCell?.col;

    if (targetRow === undefined || targetCol === undefined) {
      // Fallback: Scan the board to find the first empty slot
      let foundEmpty = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            targetRow = r;
            targetCol = c;
            foundEmpty = true;
            break;
          }
        }
        if (foundEmpty) break;
      }

      // If no empty cell exists, the board is full!
      if (!foundEmpty) {
        if (Platform.OS === 'web') alert("🎉 The board is already fully solved!");
        return;
      }
    }

    // Double check that we aren't trying to overwrite an initial puzzle cell
    if (initialBoard[targetRow!][targetCol!] !== 0) {
      if (Platform.OS === 'web') alert("💡 That cell is a starting puzzle number!");
      return;
    }

    // Clone the board and run our backtracking solver behind the scenes to find the solution matrix
    const solverBoardCopy = board.map(r => [...r]);
    
    if (solveSudokuMatrix(solverBoardCopy)) {
      // 📍 FIX: Use the non-null assertion operator (!) to guarantee TypeScript these are numbers
      const finalRow = targetRow!;
      const finalCol = targetCol!;
      
      const correctNumber = solverBoardCopy[finalRow][finalCol];
      
      // Safely update just that single target cell on the live board layout
      const updatedBoard = board.map(r => [...r]);
      updatedBoard[finalRow][finalCol] = correctNumber;
      setBoard(updatedBoard);
      
      // Keep it selected so they can see what changed!
      setSelectedCell({ row: finalRow, col: finalCol });
    } else {
      if (Platform.OS === 'web') {
        alert("❌ Your current board has conflicts. Clear your mistakes before asking for a hint!");
      } else {
        Alert.alert("❌ Hint Error", "Your current board has conflicts. Clear your mistakes before asking for a hint!");
      }
    }
  };
    
  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.timerText}>⏱️ Time: {formatTime(seconds)}</Text>
            {bestTimes[difficulty] > 0 && (
              <Text style={styles.bestTimeText}>
                🏆 Best: {formatTime(bestTimes[difficulty])}
              </Text>
            )}
            <Text style={[
                styles.mistakeText,
                mistakes > 0 && mistakes >= getMaxMistakes(difficulty) - 1 ? styles.criticalMistakeText : null
            ]}>
                ⚠️ Mistakes: {mistakes} / {getMaxMistakes(difficulty)}
            </Text>
        </View>
        <View style={styles.difficultyContainer}>
            {(['easy', 'medium', 'hard'] as const).map((level) => (
                <TouchableOpacity
                    key={level}
                    style={[
                        styles.diffButton,
                        difficulty === level && styles.activeDiffButton
                    ]}
                    onPress={() => loadNewDifficulty(level)}
                >
                    <Text style={[
                        styles.diffButtonText,
                        difficulty === level && styles.activeDiffButtonText
                    ]}>
                        {level.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
        <View style={styles.board}>
            {grid_layout.map((row) => (
                <View key={row} style={styles.row}>
                    {grid_layout.map((col) => {
                        // a 3x3 boundary line
                        const isThickBottom = row === 2 || row === 5;
                        const isThickRight = col === 2 || col === 5;
                        // This is specific loop index currently selected in memory
                        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                        // Grab the real value out of your board data matrix
                        const cellValue = board[row][col]

                        // Check if this cell is part of the original puzzle setup
                        const isInitial = initialBoard[row][col] != 0;
                        const isInvalid = checkIsInvalid(row, col, cellValue, board);

                        // Get the value of the currently highlighted cell (if any)
                        const selectedCellValue = selectedCell ? board[selectedCell.row][selectedCell.col] : 0;

                        // Highlight this cell if its number matches the selected cell's number
                        const isMatchingNumber = selectedCellValue !== 0 && cellValue === selectedCellValue && !isSelected;
                
                        return (
                            <TouchableOpacity 
                                key={col} 
                                style={[
                                    styles.cell,
                                    isThickBottom && styles.thickBottom,
                                    isThickRight && styles.thickRight,
                                    isSelected && styles.selectedCellBg,
                                    isMatchingNumber && styles.matchingNumberBg,
                                ]}
                                onPress={() => {
                                    // Check if this cell started as a number, then lock it
                                    if (isInitial) return;

                                    // Otherwise, it's an editable cell, so select it!
                                    setSelectedCell({ row, col })}}
                            >
                                <Text style={[
                                    styles.cellText,
                                    isInitial ? styles.initialText: styles.userText,
                                    isInvalid ? styles.errorText: null,
                                ]}>
                                    {cellValue === 0 ? "" : cellValue}
                                </Text>
                            </TouchableOpacity>  
                        );
                    })}
                </View>
            ))}
        </View>

        <View style={styles.numPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                    key={num}
                    style={styles.numButton}
                    onPress={() => handleNumberPress(num)}
                >
                    <Text style={styles.numButtonText}>{num}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                style={[styles.numButton, styles.eraserButton]}
                onPress={() => handleNumberPress(0)}
            >
                <Text style={styles.numButtonText}>⌫</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.buttonActionRow}>
            <TouchableOpacity
                style={styles.resetButton}
                onPress={() => loadNewDifficulty(difficulty)}
            >
                <Text style={styles.resetButtonText}>🔄 Reset Board</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.hintButton}
                onPress={triggerSmartHint}
            >
                <Text style={styles.hintButtonText}>💡 Get Hint</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.solveButton}
                onPress={triggerAutoSolver}
            >
                <Text style={styles.solveButtonText}>🤖 AI Auto-Solve</Text>
            </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  thickBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  thickRight: {
    borderRightWidth: 2,
    borderRightColor: '#000',
  },
  selectedCellBg: {
    backgroundColor: '#e0f2fe',
  },
  numPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  numButton: {
    width: 45,
    height: 45,
    backgroundColor: '#3b82f6',
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    // Adds a subtle drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 10,
  },
  numButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  initialText: {
    color: '#000000',
    fontWeight: '900',
  },
  userText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  eraserButton: {
    backgroundColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444', 
    fontWeight: 'bold',
  },
  matchingNumberBg: {
    backgroundColor: '#f0fdf4', // A soft, clean mint green or light slate blue tint
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155', // Slate color
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Uniform character width sizing
  },
  mistakeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  criticalMistakeText: {
    color: '#ef4444',
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  diffButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeDiffButton: {
    backgroundColor: '#3b82f6',
  },
  diffButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  activeDiffButtonText: {
    color: '#fff',
  },
  buttonActionRow: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 12,                  // Clean, equal spacing between buttons
    width: 400,               // Matches the exact total width of your 9x9 board!
    justifyContent: 'space-between',
  },
  resetButton: {
    flex: 1,                  // Forces equal width allocation
    height: 44,               // Perfect, uniform touch target height
    backgroundColor: '#1e293b', 
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  hintButton: {
    flex: 1,                  // Forces equal width allocation
    height: 44,               // Matches height perfectly
    backgroundColor: '#d97706', 
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  solveButton: {
    flex: 1,                  // Forces equal width allocation
    height: 44,               // Matches height perfectly
    backgroundColor: '#6366f1', 
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  // Ensure the text styles are perfectly centered and uniform
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  solveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bestTimeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b45309', // Deep trophy bronze/gold color
    marginTop: 2,
  },
});
