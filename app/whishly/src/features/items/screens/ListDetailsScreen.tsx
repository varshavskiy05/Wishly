import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '../../../core/api/client';
import type { Item } from '../../../core/types/domain';

type RootStackParamList = {
    EditItem: { listId: string };
    ListDetails: { listId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ListDetailsScreen() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const queryClient = useQueryClient();
    
    // Получаем listId из параметров навигации
    const { listId } = route.params as { listId: string };
    
    // Загружаем элементы списка
    const { data: items, isLoading } = useQuery({
        queryKey: ['items', listId],
        queryFn: async () => {
            const res = await apiClient.get<Item[]>(`/items?listId=${listId}`);
            return res.data;
        }
    });

    // Мутация для удаления элемента
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete(`/items/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
        }
    });

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Видалити елемент?',
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
            <Text style={styles.title}>Елементи списку</Text>
            <FlatList
                data={items || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            {item.description && (
                                <Text style={styles.itemDescription}>{item.description}</Text>
                            )}
                            {item.link && (
                                <Text style={styles.itemLink}>{item.link}</Text>
                            )}
                        </View>
                        <Button 
                            title="Видалити" 
                            onPress={() => handleDelete(item.id, item.name)} 
                            color="red"
                        />
                    </View>
                )}
                ListEmptyComponent={<Text>Немає елементів. Додайте перший!</Text>}
            />
            <Button 
                title="+ Додати елемент" 
                onPress={() => navigation.navigate('EditItem', { listId })} 
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
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemContent: {
        flex: 1
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5
    },
    itemLink: {
        fontSize: 12,
        color: '#0066cc'
    }
});

