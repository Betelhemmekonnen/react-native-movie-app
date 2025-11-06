import React, { createContext, ReactNode, useContext } from 'react';
import { useFavorites } from '../hooks/use-favorites';
import { Movie } from '../types/movie';

// Define the context value type
interface FavoritesContextType {
	favorites: import('../services/storage/favorites').FavoriteMovie[];
	favoriteIds: number[];
	loading: boolean;
	error: string | null;
	addFavorite: (movie: Movie) => Promise<boolean>;
	removeFavorite: (movieId: number) => Promise<boolean>;
	toggleFavorite: (movie: Movie) => Promise<boolean>;
	isFavorite: (movieId: number) => Promise<boolean>;
	refreshFavorites: () => Promise<void>;
	clearAllFavorites: () => Promise<boolean>;
	favoritesCount: number;
}

// Create the context with default values
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Create a provider component
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const {
		favorites,
		favoriteIds,
		loading,
		error,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		refreshFavorites,
		clearAllFavorites,
		favoritesCount,
	} = useFavorites();

	// Provide all the values to the context
	const contextValue: FavoritesContextType = {
		favorites,
		favoriteIds,
		loading,
		error,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		refreshFavorites,
		clearAllFavorites,
		favoritesCount,
	};

	return (
		<FavoritesContext.Provider value={contextValue}>
			{children}
		</FavoritesContext.Provider>
	);
};

// Create a custom hook to use the favorites context
export const useFavoritesContext = (): FavoritesContextType => {
	const context = useContext(FavoritesContext);

	if (context === undefined) {
		throw new Error('useFavoritesContext must be used within a FavoritesProvider');
	}

	return context;
};