import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    user: any;
    isDark: boolean;
    t: (key: string, options?: any) => string;
    toggleMenu: () => void;
    localProfileImage?: string | null;
    onImagePress?: () => void;
}

export const Header = React.memo<HeaderProps>(({
    user,
    isDark,
    t,
    toggleMenu,
    localProfileImage,
    onImagePress,
}) => {
    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: isDark ? '#1E1E1E' : '#FFF',
                    borderBottomColor: isDark ? '#333' : '#E0E0E0',
                },
            ]}
        >
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={onImagePress} disabled={!onImagePress}>
                    <Image
                        source={
                            localProfileImage
                                ? { uri: localProfileImage }
                                : user?.photoURL
                                    ? { uri: user.photoURL }
                                    : require('../../assets/images/avatar_default.png')
                        }
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.welcomeText, { color: isDark ? '#AAA' : '#666' }]}>
                        {t('account.welcome', { name: user?.displayName || t('account.user') })}
                    </Text>
                    <Text style={[styles.userName, { color: isDark ? '#FFF' : '#333' }]}>
                        {user?.displayName || t('account.user')}
                    </Text>
                    {user?.email && (
                        <Text style={[styles.userEmail, { color: isDark ? '#AAA' : '#666' }]}>
                            {user.email}
                        </Text>
                    )}
                </View>
            </View>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <Ionicons name="menu" size={28} color={isDark ? '#FFF' : '#333'} />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    welcomeText: {
        fontSize: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 12,
    },
    menuButton: {
        padding: 4,
    },
});
