import React, { createContext, ReactNode, useContext } from 'react';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

// Define the context value type
interface ThemeContextType {
	colorScheme: 'light' | 'dark';
	isDark: boolean;
	colors: typeof Colors.light & typeof Colors.dark;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const colorScheme = useColorScheme() ?? 'light';

	const isDark = colorScheme === 'dark';

	// Merge colors based on the current scheme
	const colors = {
		...Colors.light,
		...(isDark ? Colors.dark : {}),
	};

	// Provide all the values to the context
	const contextValue: ThemeContextType = {
		colorScheme,
		isDark,
		colors,
	};

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};

// Create a custom hook to use the theme context
export const useThemeContext = (): ThemeContextType => {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}

	return context;
};