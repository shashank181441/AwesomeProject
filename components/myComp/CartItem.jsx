import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Text, ActivityIndicator } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeCartItem, updateCartItem } from '../api/api';

const CartItem = ({ product, cartsLoading, cartItems }) => {
  const initialStock = product?.productId?.stock || 0;
  const initialQuantity = product?.quantity || 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [hasChanged, setHasChanged] = useState(false);
  const queryClient = useQueryClient();

  const changeQuantity = (change) => {
    const newQuantity = quantity + change;

    if (change === 1) {
      let sum = cartItems.reduce((acc, cart) => acc + cart.quantity, 0);
      if (sum + quantity - initialQuantity >= 5) {
        alert("Product limit reached. No more allowed.");
        return;
      }
    }

    if (newQuantity > 0 && newQuantity <= initialStock + initialQuantity) {
      setQuantity(newQuantity);
      setHasChanged(true);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (quantity > 0) {
        let sum = cartItems.reduce((acc, cart) => acc + cart.quantity, 0);
        if (sum + quantity - initialQuantity > 5) {
          alert("Product limit reached. No more allowed.");
          setQuantity(initialQuantity);
          return;
        }
      }
      return await updateCartItem(product._id, quantity);
    },
    onSuccess: async () => {
      setHasChanged(false);
      await queryClient.invalidateQueries(['cartItems']);
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => await removeCartItem(product._id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['cartItems']);
    },
    onError: (error) => {
      console.error("Error removing cart item:", error);
    },
  });

  if (!product || !product.productId) {
    return <Text>Invalid product data</Text>;
  }

  if (cartsLoading) return <ActivityIndicator animating={true} />;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={{ uri: product.productId.image_url }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Title>{product.productId.name}</Title>
          <Paragraph>Rs. {product.productId.price * quantity}</Paragraph>
          <View style={styles.quantityContainer}>
            <Text>Qty: {quantity}</Text>
            <View style={styles.quantityButtons}>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => changeQuantity(1)}
              />
              <IconButton
                icon="minus"
                size={20}
                onPress={() => changeQuantity(-1)}
              />
            </View>
          </View>
          <View style={styles.actionButtons}>
            {hasChanged && (
              <Button
                mode="contained"
                onPress={() => updateMutation.mutate()}
                disabled={updateMutation.isLoading}
                style={styles.updateButton}
              >
                {updateMutation.isLoading ? "Updating..." : "Update"}
              </Button>
            )}
            <Button
              mode="outlined"
              onPress={() => removeMutation.mutate()}
              disabled={removeMutation.isLoading}
              style={styles.removeButton}
            >
              {removeMutation.isLoading ? "Removing..." : "Remove"}
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardContent: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityButtons: {
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  updateButton: {
    marginRight: 8,
  },
  removeButton: {
    borderColor: 'red',
  },
});

export default CartItem;
