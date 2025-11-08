import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';
import type { List } from '../../../core/types/domain';

export function HomeScreen() {
    const { data: lists, isLoading } = useQuery({
        queryKey: ['lists'],
        queryFn: async () => {
            const res = await apiClient.get<List[]>('/lists');
            return res.data;
        }
    });

    if (isLoading) return <Text>Загрузка...</Text>;

    return (
        <View style={styles.container}>
            <FlatList
                data={lists}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
            <Button title="+ Создать список" onPress={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    listItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }
});
