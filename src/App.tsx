/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView, useColorScheme,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import Home from './screens/Home';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Carts from './screens/Carts';

// const Stack = createNativeStackNavigator()

function App(){
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        {/* <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} options={{
              title:"Home"
            }}/>
            <Stack.Screen name='Profile' component={Profile} options={{
              title:"Trending Profile"
            }} />
          <Stack.Screen name='Carts' component={Carts} options={{
              title:"Carts"
            }} />
          </Stack.Navigator>
          </NavigationContainer> */}
          <Home />
           
      </PaperProvider>
    </QueryClientProvider>
  );
}


export default App;
