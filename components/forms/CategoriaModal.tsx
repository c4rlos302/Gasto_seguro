import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';

import { useEffect, useState } from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { darkColors, lightColors } from '@/constants/theme';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (
        nombre: string,
        tipo: 'gasto' | 'ingreso'
    ) => void;
    categorias: any[];
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
    categorias,
    tipoCategoria,
    activo = true,
    loading = false,
    categoria,
    modoEdicion,
}: Props) {
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState<'gasto' | 'ingreso'>('gasto');

    const normalizarTexto = (texto: string) => {
        return texto
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    const guardar = () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "Escribe un nombre a la categoría")
            return;
        }
        const existeCategoria = categorias.some((cat) => {
            if (modoEdicion && categoria?.id === cat.id) {
                return false;
            }

            return (
                normalizarTexto(cat.nombre) ===
                normalizarTexto(nombre) && cat.tipo === tipo
            );
        });

        if (existeCategoria) {
            Alert.alert("Error", `Ya existe una categoría de ${tipo} con ese nombre`);
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
                <View style={[styles.fondo, { backgroundColor: colors.overlay }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.contenedor, { backgroundColor: colors.secundario }]}>
                            <Text style={[styles.tituloModal, { color: colors.text }]}>
                                {modoEdicion
                                    ? "Editar Categoría"
                                    : "Nueva Categoría"}
                            </Text>

                            <TextInput
                                placeholder="Nombre"
                                placeholderTextColor={colors.text}
                                value={nombre}
                                onChangeText={setNombre}
                                style={
                                    [styles.input,
                                    { color: colors.text, borderColor: colors.principal, backgroundColor: colors.fondo }]
                                }
                            />

                            <View style={styles.botones}>
                                <TouchableOpacity
                                    disabled={!activo}
                                    style={
                                        [styles.botonTipo,
                                        { backgroundColor: colors.fondo, borderColor: colors.fondo },
                                        tipo === 'gasto' && { backgroundColor: colors.principal }]
                                    }
                                    onPress={() => setTipo('gasto')}
                                >
                                    <Text style={{ color: colors.text }}>Gasto</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={!activo}
                                    style={
                                        [styles.botonTipo,
                                        { backgroundColor: colors.fondo, borderColor: colors.fondo },
                                        tipo === 'ingreso' && { backgroundColor: colors.principal }]
                                    }
                                    onPress={() => setTipo('ingreso')}
                                >
                                    <Text style={{ color: colors.text }}>Ingreso</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={
                                    [styles.botonGuardar,
                                    { backgroundColor: colors.principal, borderColor: colors.fondo }]
                                }
                                onPress={guardar}
                                disabled={loading}
                            >
                                <Text style={{ color: colors.text }}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },

    contenedor: {
        padding: 20,
        borderRadius: 20,
        gap: 15,
    },

    tituloModal: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
    },

    botones: {
        flexDirection: 'row',
        gap: 10,
    },

    botonTipo: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
    },

    botonGuardar: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
});