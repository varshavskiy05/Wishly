
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '../../../core/store/authStore';

export function LoginScreen() {
    const [email, setEmail] = useState('');
    const setAuth = useAuthStore((s) => s.setAuth);

    const handleLogin = () => {
        setAuth({
            id: '1',
            email,
            password: '',          
            createdAt: new Date(), 
            updatedAt: new Date(), 
        }, 'mock-token');
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <Button title="Войти" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});
