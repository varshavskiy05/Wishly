import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '../../../core/api/client';
import type { Category } from '../../../core/types/domain';
import { useAuthStore } from '../../../core/store/authStore';


type RootStackParamList = {
    CreateCategory: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function CategoriesScreen() {
    const navigation = useNavigation<NavigationProp>();
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);

    
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await apiClient.get<Category[]>('/categories');
            return res.data;
        }
    });

   
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Видалити категорію?',
            `Ви впевнені, що хочете видалити "${name}"?`,
            [
                { text: 'Скасувати', style: 'cancel' },
                { 
                    text: 'Видалити', 
                    style: 'destructive',
                    onPress: () => deleteMutation.mutate(id)
                }
            ]
        );
    };

    if (isLoading) return <Text>Завантаження...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Категорії</Text>
            <FlatList
                data={categories || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <Button 
                            title="Видалити" 
                            onPress={() => handleDelete(item.id, item.name)} 
                            color="red"
                        />
                    </View>
                )}
                ListEmptyComponent={<Text>Немає категорій. Створіть першу!</Text>}
            />
            <Button 
                title="+ Створити категорію" 
                onPress={() => navigation.navigate('CreateCategory')} 
            />
        </View>
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
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    categoryName: {
        fontSize: 16,
        flex: 1
    }
});

