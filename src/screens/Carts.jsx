import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Title,
  Paragraph,
  Text,
} from "react-native-paper";
import { ArrowLeft } from "lucide-react-native";
import {
  clearCart,
  getCartItems,
} from "../../components/api/api";
import CartItem from "../../components/myComp/CartItem";
import LoadingComp from "../../components/myComp/LoadingComp";
import { Link } from "@react-navigation/native";
// import { Link, useRouter } from "expo-router";

export default function Carts({navigation}) {
  const queryClient = useQueryClient();
  const [total, setTotal] = useState(0);
//   const router = useRouter();

  const {
    data: cartItems,
    isLoading: cartsLoading,
    error: CartFetchError,
    refetch,
  } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      let response = await getCartItems();
      return response?.data?.data;
    },
    cacheTime: 0,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: true,
  });

  useEffect(() => {
    queryClient.invalidateQueries(["cartItems"]);
    refetch();
    return () => {
      queryClient.invalidateQueries(["cartItems"]);
      queryClient.clear();
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const newTotal = cartItems.reduce((acc, item) => {
        return acc + (item.productId?.price ?? 0) * (item.quantity ?? 0);
      }, 0);
      setTotal(newTotal);
    }
  }, [cartItems]);

  const handleClearCart = () => {
    clearCart().then(() => {
      queryClient.invalidateQueries(["cartItems"]);
      navigation.push("/");
    });
  };

  if (cartsLoading) return <LoadingComp />;
  if (CartFetchError) return <Text>Error: {CartFetchError.message}</Text>;

  return (
    <SafeAreaView>
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Link href="/" style={styles.homeLink}>
              <ArrowLeft size={24} color="black" />
            </Link>
            <Button
              mode="contained"
              onPress={handleClearCart}
              style={styles.clearButton}
              labelStyle={styles.buttonText}
            >
              Clear Cart
            </Button>
          </View>
          <Title style={styles.title}>Shopping Cart</Title>
          <ScrollView style={styles.cartItemsContainer}>
            {cartItems?.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  product={item}
                  cartsLoading={cartsLoading}
                  cartItems={cartItems}
                />
              ))
            ) : (
              <Text>Empty</Text>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>Subtotal</Text>
              <Text style={styles.subtotalAmount}>Rs. {total}</Text>
            </View>
            <Paragraph style={styles.shippingText}>
              Shipping and taxes calculated at checkout.
            </Paragraph>
            <Button
              mode="contained"
              onPress={() => navigation.push("/")}
              style={styles.checkoutButton}
              labelStyle={styles.checkoutButtonText}
              disabled={!cartItems || cartItems.length === 0}
            >
              Test only (Finalize Payment)
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.push("/checkout")}
              style={styles.checkoutButton}
              labelStyle={styles.checkoutButtonText}
            >
              Checkout
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.push("/")}
              style={styles.continueShoppingButton}
              labelStyle={styles.continueShoppingText}
            >
              Continue Shopping →
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  card: {
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "#E1E1BF",
    margin: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  homeLink: {
    color: "black",
  },
  clearButton: {
    backgroundColor: "#f97316",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  cartItemsContainer: {
    maxHeight: 400,
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shippingText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    width: "100%",
    alignSelf: "center",
    marginBottom: 16,
    elevation: 3,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  continueShoppingButton: {
    alignSelf: "center",
  },
  continueShoppingText: {
    color: "#f97316",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
  },
});