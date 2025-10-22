// app/components/NewsCard.tsx
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NewsCardProps{
    title: string;
    dateStart: string; // 👈 Fecha de inicio
    dateEnd: string;   // 👈 Fecha de fin
    description: string;
    status: 'Abierto' | 'Cerrado';
    showPostular?: boolean;
    onDetails: () => void;
    onPostular?: () => void;
}

export default function NewsCard({
    title,
    dateStart,
    dateEnd,
    description,
    status,
    showPostular = false,
    onDetails,
    onPostular,
}: NewsCardProps) {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: 'https://via.placeholder.com/100x100?text=News' }}
                style={styles.image}
            />
            <View style={styles.content}>
                {/* Fechas */}
                <View style={styles.datesRow}>
                    <Text style={styles.date}>{dateStart}</Text>
                    <Text style={styles.date}>{dateEnd}</Text>
                </View>

                {/* Título */}
                <Text style={styles.title} numberOfLines={2}>{title}</Text>

                {/* Descripción */}
                <Text style={styles.description} numberOfLines={2}>{description}</Text>

                {/* Botones */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={onDetails}>
                        <Text style={styles.details}>Detalles</Text>
                    </TouchableOpacity>

                    <View style={styles.statusContainer}>
                        <View style={[styles.status, status === 'Abierto' ? styles.open : styles.closed]}>
                            <Text style={styles.statusText}>{status}</Text>
                        </View>

                        {showPostular && status === 'Abierto' && (
                            <TouchableOpacity
                                style={styles.postularButton}
                                onPress={onPostular}
                            >
                                <Text style={styles.postularText}>Postular</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
        card: {
        width: 300, // ← Ancho fijo para cada card
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        marginRight: 12, // ← Esto separa las cards entre sí
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 8, height: 8 },
        shadowRadius: 4,
        height: 300,
    },
    image: {
        width: '100%',
        height: 100,
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    details: {
        fontSize: 14,
        color: '#4f46e5',
        fontWeight: '600',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    status: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    open: {
        backgroundColor: '#10b981',
    },
    closed: {
        backgroundColor: '#f59e0b',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    postularButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    postularText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
});