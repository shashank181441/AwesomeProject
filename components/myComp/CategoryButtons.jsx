import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

function CategoryButtons({ categories, onCategorySelect, activeCategory }) {
  const all = { name: "All", slug: "all" };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {[all, ...categories].map((category, index) => (
          <Button
            key={index}
            onPress={() => onCategorySelect(category.slug === 'all' ? '' : category.slug)}
            mode="contained"
            style={[
              styles.button,
              {
                backgroundColor:
                  activeCategory === category.slug || (activeCategory === '' && category.slug === 'all')
                    ? '#f97316'
                    : '#95979b',
              },
            ]}
            labelStyle={styles.buttonLabel}
          >
            {category.name}
          </Button>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50, // Adjust this value as needed
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  button: {
    marginRight: 8,
    borderRadius: 20,
    minWidth: 80, // Ensure buttons have a minimum width
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12, // Adjust font size if needed
  },
});

export default CategoryButtons;