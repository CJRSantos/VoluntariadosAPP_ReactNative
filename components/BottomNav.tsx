import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={() => router.replace('/')}>
                <Text style={styles.icon}>🏠</Text>
                <Text style={styles.label}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => router.replace('/areas')}>
                <Text style={styles.icon}>📊</Text>
                <Text style={styles.label}>Áreas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => router.replace('/convocatoria')}>
                <Text style={styles.icon}>📢</Text>
                <Text style={styles.label}>Convocatoria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => router.replace('/nosotros')}>
                <Text style={styles.icon}>👥</Text>
                <Text style={styles.label}>Nosotros</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
    },
    icon: {
        fontSize: 24,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
});