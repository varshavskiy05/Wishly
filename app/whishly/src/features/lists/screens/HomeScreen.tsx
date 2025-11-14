import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';
import type { List } from '../../../core/types/domain';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    AppTabs: undefined;
    CreateList: undefined;
    Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data: lists, isLoading, isError, error } = useQuery({
        queryKey: ['lists'],
        queryFn: async () => {
            const res = await apiClient.get<List[]>('/lists');
            return res.data;
        }
    });

    if (isLoading) return <Text>Завантаження...</Text>;
    
    if (isError) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Ошибка загрузки: {error?.message || 'Невідома помилка'}</Text>
                <Button title="Оновити" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={lists || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.name}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>Нет списков. Создайте первый!</Text>}
            />
            <Button title="+ Створити список" onPress={() => navigation.navigate('CreateList')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    listItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
    error: { color: 'red', marginBottom: 10 }
});
