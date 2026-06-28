import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const grid_layout = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // our memory slot. It will track { row: X, col: Y}
  const [selectedCell, setSelectedCell] = useState<{row:number, col:number} | null>(null)

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
                        <Text style={styles.cellText}>5</Text>
                    </TouchableOpacity>  
                );
            })}
        </View>
      ))}
      {/* <Text>Open up App.tsx to start working on your app!</Text>*/}
      <StatusBar style="auto" />
        </View>
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
});
