import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { SUDOKU_POOLS } from './startingBoards';
import { checkIsInvalid, checkWinCondition } from './sudokuUtils';

export default function App() {
  const grid_layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // our memory slot. It will track { row: X, col: Y}
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [initialBoard, setInitialBoard] = useState(SUDOKU_POOLS.easy);
  const [board, setBoard] = useState(SUDOKU_POOLS.easy.map(r => [...r]));
  const [selectedCell, setSelectedCell] = useState<{row:number, col:number} | null>(null)

  // Track elapsed seconds
  const [seconds, setSeconds] = useState(0);
  const loadNewDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    const selectedPool = SUDOKU_POOLS[level];
    setDifficulty(level);
    setInitialBoard(selectedPool);
    setBoard(selectedPool.map(r => [...r]));
    setSelectedCell(null);
    setSeconds(0);
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

    const { row, col } = selectedCell;
    
    // Create the clean array copy first
    const newBoard = board.map(r => [...r]);

    // Modify the specific slot inside our new copy
    newBoard[row][col] = num;
    // Save the updated board back into our live state
    setBoard(newBoard);

    // Check if this final move solved puzzle
    if (checkWinCondition(newBoard)) {
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
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.timerText}>⏱️ Time: {formatTime(seconds)}</Text>
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

        <TouchableOpacity
            style={styles.resetButton}
            onPress={() => loadNewDifficulty(difficulty)}
        >
            <Text style={styles.resetButtonText}>🔄 Reset Board</Text>
        </TouchableOpacity>
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
  resetButton: {
    marginTop: 25,
    backgroundColor: '#1e293b', // Sleek slate gray/black
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
});
