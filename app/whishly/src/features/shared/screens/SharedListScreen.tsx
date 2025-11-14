import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { apiClient } from '../../../core/api/client';
import type { List, Item } from '../../../core/types/domain';

export function SharedListScreen() {
    const route = useRoute();
    
    // Получаем shareId из параметров навигации
    const { shareId } = route.params as { shareId: string };
    
    // Загружаем список по shareId
    // В json-server можно использовать фильтр: /lists?shareId=xxx
    const { data: lists, isLoading } = useQuery({
        queryKey: ['sharedList', shareId],
        queryFn: async () => {
            const res = await apiClient.get<List[]>(`/lists?shareId=${shareId}`);
            return res.data;
        }
    });

    // Если список найден, загружаем его элементы
    const list = lists?.[0];
    const { data: items } = useQuery({
        queryKey: ['sharedItems', list?.id],
        queryFn: async () => {
            if (!list?.id) return [];
            const res = await apiClient.get<Item[]>(`/items?listId=${list.id}`);
            return res.data;
        },
        enabled: !!list?.id
    });

    if (isLoading) return <Text>Завантаження...</Text>;

    if (!list) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Список не знайдено або посилання недійсне</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.subtitle}>Публічний перегляд (тільки перегляд)</Text>
            
            <FlatList
                data={items || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.description && (
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        )}
                        {item.link && (
                            <Text style={styles.itemLink}>{item.link}</Text>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text>Немає елементів у списку</Text>}
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
        marginBottom: 10
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10
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
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50
    }
});

