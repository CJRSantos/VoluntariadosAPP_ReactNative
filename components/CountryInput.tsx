import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';

// Lista de países en español
const COUNTRIES = [
    "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda",
    "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Belice", "Benín",
    "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil",
    "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya",
    "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Colombia",
    "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica",
    "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador",
    "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos",
    "Estonia", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia",
    "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", "Haití", "Honduras",
    "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall",
    "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán",
    "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano",
    "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Macedonia del Norte",
    "Madagascar", "Malasia", "Malaui", "Maldivas", "Mali", "Malta", "Marruecos", "Mauricio",
    "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro",
    "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega",
    "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea",
    "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana",
    "República Checa", "República del Congo", "República Democrática del Congo", "República Dominicana",
    "Ruanda", "Rumanía", "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas",
    "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona",
    "Singapur", "Siria", "Somalia", "Sri Lanka", "Suazilandia", "Sudáfrica", "Sudán",
    "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán",
    "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía",
    "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Vaticano", "Venezuela",
    "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

type CountryInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

const CountryInput = ({ value, onChangeText, placeholder = "Buscar país..." }: CountryInputProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [query, setQuery] = useState(value);
    const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

    const filterCountries = (text: string) => {
        setQuery(text);
        onChangeText(text);

        if (text) {
            const filtered = COUNTRIES.filter(country =>
                country.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredCountries(filtered);
        } else {
            setFilteredCountries([]);
        }
    };

    const onSelectCountry = (country: string) => {
        setQuery(country);
        onChangeText(country);
        setFilteredCountries([]);
    };

    return (
        <View>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: isDark ? '#333' : '#f9f9f9',
                        color: isDark ? '#FFF' : '#333',
                    }
                ]}
                value={query}
                onChangeText={filterCountries}
                placeholder={placeholder}
                placeholderTextColor={isDark ? '#AAA' : '#999'}
            />
            {filteredCountries.length > 0 && (
                <FlatList
                    data={filteredCountries.slice(0, 6)} // Mostrar solo las primeras 6 sugerencias
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.suggestionItem,
                                { backgroundColor: isDark ? '#222' : '#fff' }
                            ]}
                            onPress={() => onSelectCountry(item)}
                        >
                            <Text style={{ color: isDark ? '#FFF' : '#333' }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                />
            )}
        </View>
    );
};

export default CountryInput;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        paddingHorizontal: 12,
    },
    suggestionsList: {
        maxHeight: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});