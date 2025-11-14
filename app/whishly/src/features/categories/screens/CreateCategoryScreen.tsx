import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';
import { useAuthStore } from '../../../core/store/authStore';

export function CreateCategoryScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);
    
    const [name, setName] = useState('');

    // Мутация для создания категории
    const createMutation = useMutation({
        mutationFn: async (newCategory: { name: string; userId: string }) => {
            return await apiClient.post('/categories', newCategory);
        },
        onSuccess: () => {
            // Обновляем список категорий
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            // Возвращаемся назад
            navigation.goBack();
        }
    });

    const handleCreate = () => {
        if (!name.trim()) {
            alert('Введіть назву категорії');
            return;
        }

        if (!user) {
            alert('Користувач не авторизований');
            return;
        }

        createMutation.mutate({
            name: name.trim(),
            userId: user.id
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Створити категорію</Text>
            
            <TextInput
                placeholder="Назва категорії"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <Button
                title={createMutation.isPending ? "Створення..." : "Створити"}
                onPress={handleCreate}
                disabled={createMutation.isPending}
            />

            {createMutation.isError && (
                <Text style={styles.error}>
                    Помилка: {createMutation.error?.message || 'Не вдалося створити категорію'}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
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
        marginBottom: 20,
        borderRadius: 5,
        fontSize: 16
    },
    error: {
        color: 'red',
        marginTop: 10
    }
});

