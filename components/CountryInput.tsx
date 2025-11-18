// src/components/CountryInput.tsx
import { useTheme } from '@/app/providers/ThemeProvider';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import countries from '../src/constants/countries.json'; // Ruta correcta según tu estructura

type CountryInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const CountryInput = ({ value, onChangeText, placeholder = "Buscar país..." }: CountryInputProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState(value);
  const [filtered, setFiltered] = useState<string[]>([]);

  const handleChange = (text: string) => {
    setQuery(text);
    onChangeText(text);

    if (text.trim()) {
      const matches = countries
        .filter(c => c.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 6);
      setFiltered(matches);
    } else {
      setFiltered([]);
    }
  };

  const selectCountry = (country: string) => {
    setQuery(country);
    onChangeText(country);
    setFiltered([]);
  };

  return (
    <View>
      <TextInput
        style={[styles.input, { 
          backgroundColor: isDark ? '#333' : '#f9f9f9',
          color: isDark ? '#FFF' : '#000',
          borderColor: isDark ? '#555' : '#ccc'
        }]}
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#999' : '#777'}
        autoCapitalize="words"
        autoCorrect={false}
      />
      {filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.item, { backgroundColor: isDark ? '#222' : '#fff' }]} onPress={() => selectCountry(item)}>
              <Text style={{ color: isDark ? '#FFF' : '#000' }}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  list: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default CountryInput;