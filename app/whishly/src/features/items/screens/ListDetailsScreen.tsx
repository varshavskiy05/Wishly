import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { apiClient } from '../../../core/api/client';
import type { Item, Share } from '../../../core/types/domain';

type RootStackParamList = {
    EditItem: { listId: string };
    ListDetails: { listId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ListDetailsScreen() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const queryClient = useQueryClient();
    

    const { listId } = route.params as { listId: string };
    
    const [shareId, setShareId] = useState<string | null>(null);
    
   
    const { data: list } = useQuery({
        queryKey: ['list', listId],
        queryFn: async () => {
            const res = await apiClient.get(`/lists/${listId}`);
            return res.data;
        }
    });
    

    const { data: items, isLoading } = useQuery({
        queryKey: ['items', listId],
        queryFn: async () => {
            const res = await apiClient.get<Item[]>(`/items?listId=${listId}`);
            return res.data;
        }
    });

   
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete(`/items/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
        }
    });


    const shareMutation = useMutation({
        mutationFn: async () => {
            const shareRes = await apiClient.post<Share>('/shares', { listId });
            const shareId = shareRes.data.id;
            
            if (list) {
                await apiClient.patch(`/lists/${listId}`, { shareId });
            }
            
            return shareRes.data;
        },
        onSuccess: async (data) => {
            setShareId(data.id);
            queryClient.invalidateQueries({ queryKey: ['list', listId] });
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            const shareUrl = `whishly://shared/${data.id}`;
            await Clipboard.setStringAsync(shareUrl);
            Alert.alert(
                'Посилання створено та скопійовано!',
                `Посилання скопійовано в буфер обмена:\n${shareUrl}\n\nТепер ви можете поділитися ним.`,
                [{ text: 'OK' }]
            );
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

    const handleShare = async () => {
   
        const currentShareId = list?.shareId || shareId;
        if (currentShareId) {
            const shareUrl = `whishly://shared/${currentShareId}`;
            
            await Clipboard.setStringAsync(shareUrl);
            Alert.alert(
                'Посилання скопійовано!',
                `Посилання скопійовано в буфер обмена:\n${shareUrl}\n\nТепер ви можете поділитися ним.`,
                [{ text: 'OK' }]
            );
        } else {
            // Создаём новую публичную ссылку
            shareMutation.mutate();
        }
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
            <View style={styles.actions}>
                <Button 
                    title="+ Додати елемент" 
                    onPress={() => navigation.navigate('EditItem', { listId })} 
                />
                <Button 
                    title="Поділитися" 
                    onPress={handleShare}
                    color="#0066cc"
                />
            </View>
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
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    }
});

