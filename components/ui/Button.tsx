import React from 'react'
import { CardView } from './Card'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface BotonAccionProps {
    texto?: string
    icono?: keyof typeof Ionicons.glyphMap
    onPress?: () => void,
    disabled?: boolean,
    
}
export function BotonAccion({ texto, icono, onPress, disabled }: BotonAccionProps) {
    return (
        <CardView>
            <TouchableOpacity
                style={styles.botonAccion}
                onPress={onPress}
                disabled={disabled}
            >
                <Ionicons name={icono} size={20} color="#81A6C6" />
                <Text style={styles.textoBotonAccion} >{texto}</Text>
                <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
            </TouchableOpacity>
        </CardView>
    )
}

const styles = StyleSheet.create({
    botonAccion: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textoBotonAccion: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "500",
    },
})
