import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../../core/store/authStore';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { HomeScreen } from '../../features/lists/screens/HomeScreen';
import { CreateListScreen } from '../../features/lists/screens/CreateListScreen';
import { ListDetailsScreen } from '../../features/items/screens/ListDetailsScreen';
import { EditItemScreen } from '../../features/items/screens/EditItemScreen';
import { CategoriesScreen } from '../../features/categories/screens/CategoriesScreen';
import { CreateCategoryScreen } from '../../features/categories/screens/CreateCategoryScreen';
import { SharedListScreen } from '../../features/shared/screens/SharedListScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AppTabs() {
    return (
        <Tabs.Navigator>
            <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Списки' }} />
            <Tabs.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Категорії' }} />
            {/* TODO: Shared */}
        </Tabs.Navigator>
    );
}

export function RootNavigator() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="AppTabs" component={AppTabs} />
                        <Stack.Screen 
                            name="CreateList" 
                            component={CreateListScreen} 
                            options={{ 
                                presentation: 'modal',
                                headerShown: true,
                                title: 'Створити список'
                            }} 
                        />
                        <Stack.Screen 
                            name="ListDetails" 
                            component={ListDetailsScreen} 
                            options={{ 
                                headerShown: true,
                                title: 'Елементи списку'
                            }} 
                        />
                        <Stack.Screen 
                            name="EditItem" 
                            component={EditItemScreen} 
                            options={{ 
                                presentation: 'modal',
                                headerShown: true,
                                title: 'Додати елемент'
                            }} 
                        />
                        <Stack.Screen 
                            name="CreateCategory" 
                            component={CreateCategoryScreen} 
                            options={{ 
                                presentation: 'modal',
                                headerShown: true,
                                title: 'Створити категорію'
                            }} 
                        />
                        <Stack.Screen 
                            name="SharedList" 
                            component={SharedListScreen} 
                            options={{ 
                                headerShown: true,
                                title: 'Публічний список'
                            }} 
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        {/* Публичный просмотр доступен без авторизации */}
                        <Stack.Screen 
                            name="SharedList" 
                            component={SharedListScreen} 
                            options={{ 
                                headerShown: true,
                                title: 'Публічний список'
                            }} 
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
