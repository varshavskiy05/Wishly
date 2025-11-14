import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';
import type { List } from '../../../core/types/domain';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';


type RootStackParamList = {
    AppTabs: undefined;
    CreateList: undefined;
    ListDetails: { listId: string };
    Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete(`/lists/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        }
    });

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Видалити список?',
            `Ви впевнені, що хочете видалити "${name}"? Цю дію неможливо скасувати.`,
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
                        <TouchableOpacity 
                            style={styles.listItemContent}
                            onPress={() => navigation.navigate('ListDetails', { listId: item.id })}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                        </TouchableOpacity>
                        <Button 
                            title="Видалити" 
                            onPress={() => handleDelete(item.id, item.name)} 
                            color="red"
                        />
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
    listItem: { 
        padding: 15, 
        borderBottomWidth: 1, 
        borderColor: '#ccc',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listItemContent: {
        flex: 1,
    },
    listItemText: {
        fontSize: 16
    },
    error: { color: 'red', marginBottom: 10 }
});
