import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text, Badge, useTheme } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { addToCart } from "../api/api";
import { ShoppingCart } from "lucide-react-native";

function ProductCard({ product, myCart, setMyCart, setIsChanged, refetch }) {
  const theme = useTheme();
  const isOutOfStock = product.stock === 0;

  const { mutate: addToCartMutate, isLoading: isPending } = useMutation({
    mutationFn: () => addToCart(product._id),
    onSuccess: async () => {
      setIsChanged(true);
      product.stock -= 1;
      const updatedCart = [...myCart];
      const cartItem = updatedCart.find((item) => item.productId === product._id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        updatedCart.push({ productId: product._id, quantity: 1 });
      }
      setMyCart(updatedCart);
      refetch();
    },
  });

  const buttonLabel = isOutOfStock ? "Out of Stock" : isPending ? "Adding..." : "Add to Cart";

  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: product.image_url }} style={styles.image} />
      <Badge style={styles.productNumberBadge}>{product.productNumber}</Badge>
      <Card.Title
        title={product.name}
        titleStyle={styles.productName}
        titleNumberOfLines={2}
      />
      <Card.Content>
        <View style={styles.priceAndStock}>
          <Text style={styles.price}>Rs. {product.price}</Text>
          <Text style={styles.stock}>In Stock: {product.stock}</Text>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="contained"
          onPress={() => addToCartMutate()}
          disabled={isOutOfStock || isPending}
          style={[
            styles.button,
            isOutOfStock || isPending ? styles.disabledButton : null,
          ]}
          labelStyle={styles.buttonLabel}
          icon={({ size, color }) => (
            <ShoppingCart size={size} color={color} />
          )}
        >
          {buttonLabel}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    height: 150,
  },
  productNumberBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontSize: 20,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceAndStock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f97316',
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    justifyContent: 'center',
    alignItems:"center",
    paddingTop: 8,
  },
  button: {
    borderRadius: 20,
    alignSelf:"center",
    marginLeft:"auto",
    marginRight:"auto",
    paddingHorizontal: 16,
    backgroundColor:"#f26c18",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductCard;