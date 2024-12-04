import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Title, Card } from 'react-native-paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import LoadingComp from '../../components/myComp/LoadingComp';
import { initiatePayment, finalizePayment, clearCart, getCartItems } from '../../components/api/api';

const Checkout = ({navigation}) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [orderId, setOrderId] = useState('');
  const [wsUrl, setWsUrl] = useState('');
  const [isScanned, setIsScanned] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdownText, setCountdownText] = useState("Time remaining");
  const [countdown, setCountdown] = useState(120);

  const paymentMutation = useMutation({
    mutationFn: initiatePayment,
    onSuccess: async (response) => {
      const data = response.data.data;

      setOrderId(data.prn);
      setWsUrl(data.wsUrl);

      if (data.qrMessage) {
        setQrCodeData(data.qrMessage);
        
        const ws = new WebSocket(data.wsUrl);
        
        ws.onmessage = async (event) => {
          const jsonData = JSON.parse(event.data);
          console.log("Received WebSocket message:", jsonData);
          
          if (jsonData.transactionStatus) {
            const status = JSON.parse(jsonData.transactionStatus);
            console.log("Parsed transaction status:", status);
        
            if (status.qrVerified) {
              setIsScanned(true);
              console.log("QR code has been scanned.");
            }
            
            console.log(status.paymentSuccess);
        
            if (status.paymentSuccess) {
              console.log("Payment is successful.");
              setPaymentSuccess(true);
      
              await finalizePayment().then((res) => {
                console.log("Payment finalized successfully", res);
                setPaymentSuccess(true);
                setCountdownText("Returning to home in")
                setCountdown(5)
                setTimeout(async () => {
                  navigation.push('/');
                }, 5000);
              }).catch((error) => {
                console.error("Error finalizing payment:", error);
              });
            } else {
              console.log("Payment was not successful.");
            }
          } else {
            console.log("QR code scanned without payment information.");
            setIsScanned(true);
          }
        };
        
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };

      } else {
        console.error("QR message is not available.");
        alert("QR message is not available.");
      }
    },
    onError: (error) => {
      console.error("Error initiating payment:", error.message);
      alert("Error initiating payment.");
    },
  });

  const {
    data: cartItems,
    isLoading: cartLoading,
    error: cartError,
    refetch: cartRefetch
  } = useQuery({ 
    queryKey: ["cartItems"],
    queryFn: async () => {
      const machineId = "66d80057da82f664156f58b0";
      return getCartItems(machineId);
    }
  });

  useEffect(() => {
    paymentMutation.mutate();
    
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    const timeout = setTimeout(async () => {
      await clearCart();
      navigation.push('/');
    }, 120000);
  
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Button
              icon={() => <ArrowLeft color="#000" size={24} />}
              onPress={() => navigation.push("/carts")}
            />
            <Button mode="contained" onPress={() => navigation.push("/")}>
              Home
            </Button>
          </View>
          <Title style={styles.orderId}>Order Id: {orderId || 'Loading...'}</Title>
          <Text>We Accept</Text>
          <Image
            style={styles.paymentLogo}
            source={{ uri: "https://login.fonepay.com/assets/img/fonepay_payments_fatafat.png" }}
            resizeMode="contain"
          />
          <Title style={styles.amount}>
            Nrs. {paymentMutation?.data?.data?.data?.amount}
          </Title>
          <Text style={styles.countdown}>
            {countdownText}: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
          </Text>

          {paymentSuccess ? (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>Payment Successful!</Text>
              <Text>Thank you for the purchase!</Text>
              <Text>Have a good day.</Text>
              <Text>Returning to home in {countdown}</Text>
            </View>
          ) : isScanned ? (
            <View style={styles.scannedMessage}>
              <Text style={styles.scannedText}>QR Code Scanned! Processing payment...</Text>
              <QRCode
                value={qrCodeData}
                size={400}
              />
            </View>
          ) : qrCodeData ? (
            <View style={styles.qrContainer}>
              <Text>
                Scan the QR to pay.
                Dispense will start automatically after successful payment. 
              </Text>
              <QRCode
                value={qrCodeData}
                size={400}
              />
            </View>
          ) : (
            <LoadingComp />
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  orderId: {
    color: '#f97316',
    marginVertical: 10,
  },
  paymentLogo: {
    height: 48,
    width: '100%',
    marginVertical: 10,
  },
  amount: {
    color: '#f97316',
    fontSize: 24,
    marginVertical: 10,
  },
  countdown: {
    color: 'red',
    fontSize: 18,
    marginVertical: 10,
  },
  successMessage: {
    marginTop: 20,
  },
  successText: {
    color: 'green',
    fontSize: 18,
  },
  scannedMessage: {
    marginTop: 20,
    alignItems: 'center',
  },
  scannedText: {
    color: 'green',
    fontSize: 18,
    marginBottom: 10,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Checkout;