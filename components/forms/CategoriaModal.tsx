import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { useEffect, useState } from 'react';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (
        nombre: string,
        tipo: 'gasto' | 'ingreso'
    ) => void;
    tipoCategoria?: 'gasto' | 'ingreso';
    activo?: boolean;
    loading?: boolean;
    categoria?: any;
    modoEdicion?: boolean;
}

export default function CategoriaModal({
    visible,
    onClose,
    onSave,
    tipoCategoria,
    activo = true,
    loading = false,
    categoria,
    modoEdicion,
}: Props) {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState<'gasto' | 'ingreso'>(
        'gasto');

    const handleSave = () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "Escribe un nombre a la categoría")
            return;
        }
        onSave(nombre, tipo);

        setNombre("");
    };

    useEffect(() => {
        if (categoria) {
            setNombre(categoria.nombre);
            setTipo(categoria.tipo);
        }
    }, [categoria]);

    useEffect(() => {
        if (visible) {
            if (categoria) {
                setNombre(categoria.nombre);
                setTipo(categoria.tipo);
            } else {
                setNombre('');
                setTipo(tipoCategoria || 'gasto');
            }
        }
    }, [visible, categoria]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <Text style={styles.title}>
                                {modoEdicion
                                    ? "Editar Categoría"
                                    : "Nueva Categoría"}
                            </Text>

                            <TextInput
                                placeholder="Nombre"
                                value={nombre}
                                onChangeText={setNombre}
                                style={styles.input}
                            />

                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    disabled={!activo}
                                    style={[styles.tipoBtn, tipo === 'gasto' && styles.tipoBtnActivo]}
                                    onPress={() => setTipo('gasto')}
                                >
                                    <Text>Gasto</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={!activo}
                                    style={[styles.tipoBtn, tipo === 'ingreso' && styles.tipoBtnActivo]}
                                    onPress={() => setTipo('ingreso')}
                                >
                                    <Text>Ingreso</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSave}
                                disabled={loading}
                            >

                                <Text style={{ color: "#fff" }}>
                                    Guardar
                                </Text>

                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },

    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        gap: 15,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
    },

    buttons: {
        flexDirection: 'row',
        gap: 10,
    },

    tipoBtn: {
        flex: 1,
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 10,
        alignItems: 'center',
    },

    tipoBtnActivo: {
        backgroundColor: "#AACDDC",
    },

    saveBtn: {
        backgroundColor: '#81A6C6',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
});