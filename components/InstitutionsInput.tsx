// src/components/InstitutionsInput.tsx
import { useTheme } from '@/app/providers/ThemeProvider';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import institutions from '../src/constants/Institutions.json'; // Asegura la ruta correcta

type InstitutionsInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

const InstitutionsInput = ({ value, onChangeText, placeholder = "Buscar institución..." }: InstitutionsInputProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [query, setQuery] = useState(value);
    const [filtered, setFiltered] = useState<string[]>([]);

    const handleChange = (text: string) => {
        setQuery(text);
        onChangeText(text);

        if (text.trim()) {
            const matches = institutions
                .filter(inst => inst.toLowerCase().includes(text.toLowerCase()))
                .slice(0, 6);
            setFiltered(matches);
        } else {
            setFiltered([]);
        }
    };

    const selectInstitution = (institution: string) => {
        setQuery(institution);
        onChangeText(institution);
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
                autoCapitalize="none"
                autoCorrect={false}
            />

            {filtered.length > 0 && (
                <View style={styles.list}>
                    {filtered.map((item, index) => (
                        <TouchableOpacity
                            key={`${item}-${index}`} // 👈 Clave única
                            style={[styles.item, { backgroundColor: isDark ? '#222' : '#fff' }]}
                            onPress={() => selectInstitution(item)}
                        >
                            <Text style={{ color: isDark ? '#FFF' : '#000' }}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
        backgroundColor: 'white', // 👈 Añadido para evitar fondo transparente
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});

export default InstitutionsInput;