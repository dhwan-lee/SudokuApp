import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { INITIAL_SUDOKU_BOARD } from './startingBoards';

export default function App() {
  const grid_layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // our memory slot. It will track { row: X, col: Y}
  const [board, setBoard] = useState(INITIAL_SUDOKU_BOARD)
  const [selectedCell, setSelectedCell] = useState<{row:number, col:number} | null>(null)
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
  };

  return (
    <View style={styles.container}>
        <View style={styles.board}>
            {grid_layout.map((row) => (
                <View key={row} style={styles.row}>
                    {grid_layout.map((col) => {
                        // a 3x3 boundary line
                        const isThickBottom = row === 2 || row === 5;
                        const isThickRight = col === 2 || col === 5;
                        // This is specific loop index currently selected in memory
                        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                        //  Grab the real value out of your board data matrix
                        const cellValue = board[row][col]
                
                        return (
                            <TouchableOpacity 
                                key={col} 
                                style={[
                                    styles.cell,
                                    isThickBottom && styles.thickBottom,
                                    isThickRight && styles.thickRight,
                                    isSelected && styles.selectedCellBg,
                                ]}
                                onPress={() => setSelectedCell({ row, col })}
                            >
                                <Text style={styles.cellText}>
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
  }
});
