import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PresencialInfoScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Contenido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requisitos y Pasos</Text>
                    <Text style={styles.text}>
                        Para postular de forma presencial, debes acercarte a la sede del IIAP y presentar tus documentos en Mesa de Partes.
                    </Text>

                    <Text style={styles.subTitle}>1. Prepara tus documentos</Text>
                    <Text style={styles.text}>
                        Asegúrate de tener tu CV documentado y la ficha de inscripción llenada correctamente. Todo debe estar en un sobre manila cerrado.
                    </Text>

                    <Text style={styles.subTitle}>2. Acércate al IIAP</Text>
                    <Text style={styles.text}>
                        Dirígete a la oficina de Mesa de Partes en el horario de atención (Lunes a Viernes de 8:00 am a 4:00 pm).
                    </Text>

                    <Text style={styles.subTitle}>3. Entrega tu expediente</Text>
                    <Text style={styles.text}>
                        Entrega tu sobre y solicita tu cargo de recepción. Conserva este cargo para cualquier consulta posterior.
                    </Text>
                </View>

                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>Nota Importante</Text>
                    <Text style={styles.noteText}>
                        Recuerda que la postulación presencial es válida solo si se realiza dentro del plazo establecido en la convocatoria.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#005f56',
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
    },
    noteContainer: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 4,
    },
    noteText: {
        fontSize: 14,
        color: '#5D4037',
        lineHeight: 20,
    },
});
