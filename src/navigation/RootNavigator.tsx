import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { HistoryDrawer } from '../components/HistoryDrawer';
import { SearchScreen } from '../screens/SearchScreen';
import { WordDetailScreen } from '../screens/WordDetailScreen';
import { colors, radii, spacing } from '../theme/styles';

export type MainStackParamList = {
  Search: undefined;
  WordDetail: undefined;
};

export type RootDrawerParamList = {
  Main: undefined;
};

const navTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

type StackNav = {
  navigate: (screen: 'Search') => void;
  goBack: () => void;
  canGoBack: () => boolean;
  getParent: () => { openDrawer: () => void } | undefined;
};

function DrawerToggle({ navigation }: { navigation: StackNav }) {
  return (
    <Pressable
      onPress={() => navigation.getParent()?.openDrawer()}
      style={styles.headerButton}
      accessibilityLabel="Open search history"
    >
      <Ionicons name="menu" size={22} color={colors.primary} />
    </Pressable>
  );
}

function BackToSearchButton({ navigation }: { navigation: StackNav }) {
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Search');
    }
  };

  return (
    <Pressable
      onPress={handleBack}
      style={[styles.headerButton, styles.backButton]}
      accessibilityLabel="Back to search"
    >
      <Ionicons name="arrow-back" size={22} color={colors.text} />
    </Pressable>
  );
}

function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation }) => ({
          title: 'Dictionary',
          headerLeft: () => <DrawerToggle navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="WordDetail"
        component={WordDetailScreen}
        options={({ navigation }) => ({
          title: 'Word Details',
          headerLeft: () => <BackToSearchButton navigation={navigation} />,
          headerRight: () => <DrawerToggle navigation={navigation} />,
          headerRightContainerStyle: { paddingRight: spacing.md },
          gestureEnabled: true,
        })}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <HistoryDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            width: '82%',
            borderTopRightRadius: radii.xl,
            borderBottomRightRadius: radii.xl,
          },
          overlayColor: colors.overlay,
        }}
      >
        <Drawer.Screen name="Main" component={MainStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginLeft: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
