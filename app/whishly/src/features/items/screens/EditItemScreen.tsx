import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';

export function EditItemScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const queryClient = useQueryClient();
    
    // Получаем listId из параметров навигации
    const { listId } = route.params as { listId: string };
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

    // Мутация для создания элемента
    const createMutation = useMutation({
        mutationFn: async (newItem: { name: string; description?: string; link?: string; listId: string }) => {
            return await apiClient.post('/items', newItem);
        },
        onSuccess: () => {
            // Обновляем список элементов
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
            // Возвращаемся назад
            navigation.goBack();
        }
    });

    const handleCreate = () => {
        if (!name.trim()) {
            alert('Введіть назву елемента');
            return;
        }

        createMutation.mutate({
            name: name.trim(),
            description: description.trim() || undefined,
            link: link.trim() || undefined,
            listId: listId
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Додати елемент</Text>
            
            <TextInput
                placeholder="Назва елемента *"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Опис (необов'язково)"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
                numberOfLines={3}
            />

            <TextInput
                placeholder="Посилання (необов'язково)"
                value={link}
                onChangeText={setLink}
                style={styles.input}
                keyboardType="url"
                autoCapitalize="none"
            />

            <Button
                title={createMutation.isPending ? "Створення..." : "Створити"}
                onPress={handleCreate}
                disabled={createMutation.isPending}
            />

            {createMutation.isError && (
                <Text style={styles.error}>
                    Помилка: {createMutation.error?.message || 'Не вдалося створити елемент'}
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        fontSize: 16
    },
    error: {
        color: 'red',
        marginTop: 10
    }
});

