import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, Button, Text, IconButton } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../../components/api/api';
import { Minus, Plus } from 'lucide-react-native';

export default function ProductRow({ product }) {
  const [localStock, setLocalStock] = useState(product.stock);
  const [isEdited, setIsEdited] = useState(false);
  const queryClient = useQueryClient();

  const updateStockMutation = useMutation({
    mutationFn: async () => {
      const res = await updateProduct(product._id, localStock);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEdited(false);
    },
    onError: (error) => {
      console.log(error);
      setLocalStock(product.stock); // Reset to original value on error
    },
  });

  const handleIncrement = () => {
    if (localStock < product.stockLimit) {
      setLocalStock((prev) => prev + 1);
      setIsEdited(true);
    }
  };

  const handleDecrement = () => {
    if (localStock > 0) {
      setLocalStock((prev) => prev - 1);
      setIsEdited(true);
    }
  };

  const handleUpdate = () => {
    if (isEdited) {
      updateStockMutation.mutate();
    }
  };

  return (
    <DataTable.Row style={styles.tableRow}>
      <DataTable.Cell>{product.productNumber}</DataTable.Cell>
      <DataTable.Cell style={styles.nameCell}>
        <Text numberOfLines={1} style={styles.productName}>
          {product.name}
        </Text>
      </DataTable.Cell>
      <DataTable.Cell>
        <View style={styles.stockControl}>
          <IconButton
            icon={() => <Minus size={16} />}
            size={20}
            onPress={handleDecrement}
            style={styles.stockButton}
          />
          <Text style={styles.stockText}>{localStock}</Text>
          <IconButton
            icon={() => <Plus size={16} />}
            size={20}
            onPress={handleIncrement}
            style={styles.stockButton}
          />
        </View>
      </DataTable.Cell>
      <DataTable.Cell numeric>{product.stockLimit}</DataTable.Cell>
      <DataTable.Cell>
        <Button
          mode="contained"
          onPress={handleUpdate}
          disabled={!isEdited || updateStockMutation.isLoading}
          style={[
            styles.updateButton,
            isEdited ? styles.activeButton : styles.inactiveButton,
          ]}
          labelStyle={styles.buttonLabel}
        >
          {updateStockMutation.isLoading ? 'Updating...' : 'Update'}
        </Button>
      </DataTable.Cell>
    </DataTable.Row>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    minHeight: 60,
    justifyContent:"space-between"
  },
  nameCell: {
    flex: 2,
  },
  productName: {
    fontSize: 14,
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockButton: {
    margin: 0,
  },
  stockText: {
    minWidth: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  updateButton: {
    marginVertical: 4,
    marginHorizontal: "5vw",
    paddingHorizontal: 8,
  },
  activeButton: {
    backgroundColor: '#4f46e5',
  },
  inactiveButton: {
    backgroundColor: '#9ca3af',
  },
  buttonLabel: {
    fontSize: 12,
  },
});
