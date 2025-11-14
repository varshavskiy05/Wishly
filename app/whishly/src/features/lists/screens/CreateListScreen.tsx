import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';
import type { Category } from '../../../core/types/domain';
import { useAuthStore } from '../../../core/store/authStore';

export function CreateListScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);
    
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

    
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await apiClient.get<Category[]>('/categories');
            return res.data;
        }
    });

    
    const createMutation = useMutation({
        mutationFn: async (newList: { name: string; categoryId?: string; userId: string }) => {
            return await apiClient.post('/lists', newList);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            
            navigation.goBack();
        }
    });

    const handleCreate = () => {
        if (!name.trim()) {
            alert('Введите название списка');
            return;
        }

        if (!user) {
            alert('Пользователь не авторизован');
            return;
        }

        createMutation.mutate({
            name: name.trim(),
            categoryId,
            userId: user.id
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Создать список</Text>
            
            <TextInput
                placeholder="Название списка"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            {categories && categories.length > 0 && (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Button
                            title={item.name}
                            onPress={() => setCategoryId(item.id)}
                        />
                    )}
                />
            )}

            <Button
                title={createMutation.isPending ? "Создание..." : "Создать"}
                onPress={handleCreate}
                disabled={createMutation.isPending}
            />

            {createMutation.isError && (
                <Text style={styles.error}>
                    Ошибка: {createMutation.error?.message || 'Не удалось создать список'}
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
        borderRadius: 5
    },
    error: {
        color: 'red',
        marginTop: 10
    }
});