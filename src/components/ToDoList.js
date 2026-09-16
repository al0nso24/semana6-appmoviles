import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ToDoList() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [filtro, setFiltro] = useState("Todas");

    useEffect(() => {
        const cargar = async () => {
            const data = await AsyncStorage.getItem("tasks");
            if (data) {
                const tareasGuardadas = JSON.parse(data);
                setTasks(
                    tareasGuardadas.map((tarea) => ({
                        ...tarea,
                        completed: Boolean(tarea.completed),
                    }))
                );
            }
        };
        cargar();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const agregarTarea = () => {
        if (task.trim() === "") {
            return;
        }

        const nuevaTarea = {
            id: Date.now().toString(),
            text: task.trim(),
            createdAt: new Date().toISOString(),
            completed: false,
        };

        setTasks((prev) => [...prev, nuevaTarea]);
        setTask("");
    };

    const eliminarTarea = (id) => {
        setTasks((prev) => prev.filter((tarea) => tarea.id !== id));
    };

    const toggleTarea = (id) => {
        setTasks((prev) =>
            prev.map((tarea) =>
                tarea.id === id ? { ...tarea, completed: !tarea.completed } : tarea
            )
        );
    };

    const tareasFiltradas = tasks.filter((tarea) => {
        if (filtro === "Pendientes") return !tarea.completed;
        if (filtro === "Completadas") return tarea.completed;
        return true;
    });

    return (
        <View style={styles.contenedor}>
            <TextInput
                value={task}
                onChangeText={setTask}
                style={styles.input}
                placeholder="Escribe una tarea"
            />

            <TouchableOpacity style={styles.agregar} onPress={agregarTarea}>
                <Text style={styles.textoBoton}>Agregar</Text>
            </TouchableOpacity>

            {tasks.length > 5 && (
                <Text style={styles.alertaTexto}>Demasiadas tareas por hacer :'v</Text>
            )}

            <View style={styles.filtrosRow}>
                {['Todas', 'Pendientes', 'Completadas'].map((opcion) => (
                    <TouchableOpacity
                        key={opcion}
                        style={[
                            styles.filtro,
                            filtro === opcion && styles.filtroActivo,
                        ]}
                        onPress={() => setFiltro(opcion)}
                    >
                        <Text
                            style={[
                                styles.filtroTexto,
                                filtro === opcion && styles.filtroTextoActivo,
                            ]}
                        >
                            {opcion}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                style={styles.lista}
                data={tareasFiltradas}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.vacio}>No hay tareas en este filtro</Text>}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.tareaContainer,
                            item.completed && styles.tareaCompletada,
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.tareaContenido}
                            onPress={() => toggleTarea(item.id)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.tarea,
                                    item.completed && styles.tareaTextoTachado,
                                ]}
                            >
                                {item.text}
                            </Text>
                            <Text style={styles.fecha}>
                                {new Date(item.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.eliminar}
                            onPress={() => eliminarTarea(item.id)}
                        >
                            <Text style={styles.textoBoton}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        paddingTop: 131,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },

    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 15,
        width: "80%",
        backgroundColor: "#fff",
    },

    agregar: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 40
    },

    textoBoton: {
        color: "#fff",
        fontWeight: "bold",
    },

    alertaTexto: {
        color: "#B91C1C",
        fontWeight: "bold",
        marginBottom: 40,
    },

    filtrosRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 12,
    },

    filtro: {
        backgroundColor: "#E5E7EB",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },

    filtroActivo: {
        backgroundColor: "#111827",
    },

    filtroTexto: {
        color: "#111827",
        fontWeight: "bold",
    },

    filtroTextoActivo: {
        color: "#fff",
    },

    lista: {
        width: "90%",
    },

    vacio: {
        color: "#6B7280",
        textAlign: "center",
        marginTop: 18,
    },

    tareaContainer: {
        marginTop: 8,
        backgroundColor: "#E5E7EB",
        padding: 10,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    tareaCompletada: {
        backgroundColor: "#DCFCE7",
    },

    tareaContenido: {
        flex: 1,
        marginRight: 8,
    },

    tarea: {
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },

    tareaTextoTachado: {
        textDecorationLine: "line-through",
        color: "#4B5563",
    },

    fecha: {
        fontSize: 10,
        color: "#374151",
    },

    eliminar: {
        backgroundColor: "#DC2626",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
});