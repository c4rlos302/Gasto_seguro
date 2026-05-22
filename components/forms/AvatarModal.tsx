import { darkColors, lightColors } from "@/constants/theme";
import { useTheme } from "@/src/context/ThemeContext";
import {
    Modal,
    View,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
} from "react-native";

interface Props {
    visible: boolean;
    onClose: () => void;
    avatars: any[];
    onSelect: (url: string) => void;
}

export default function AvatarModal({
    visible,
    onClose,
    avatars,
    onSelect,
}: Props) {
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>

                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, { backgroundColor: colors.fondo }]}>

                            <Text style={[styles.title, { color: colors.text }]}>
                                Selecciona un avatar
                            </Text>

                            <FlatList
                                data={avatars}
                                numColumns={3}
                                keyExtractor={(item) => item.name}
                                contentContainerStyle={styles.list}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.avatarContainer}
                                        onPress={() => onSelect(item.url)}
                                    >
                                        <Image
                                            source={{ uri: item.url }}
                                            style={styles.avatar}
                                        />
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.empty}>
                                        No hay avatars
                                    </Text>
                                }
                            />

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
        justifyContent: "flex-end",
    },

    modal: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        height: "60%",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
    },

    list: {
        paddingBottom: 20,
    },

    avatarContainer: {
        flex: 1,
        alignItems: "center",
        marginBottom: 20,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },

    empty: {
        textAlign: "center",
        marginTop: 50,
    },
});