// Movie-related type definitions

export interface Movie {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	adult: boolean;
	genre_ids: number[];
	original_language: string;
	original_title: string;
	popularity: number;
	video: boolean;
  }
  
  export interface MovieDetails extends Movie {
	budget: number;
	genres: Genre[];
	homepage: string;
	imdb_id: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
  }
  
  export interface Genre {
	id: number;
	name: string;
  }
  
  export interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
  }
  
  export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
  }
  
  export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
  }
  
  export interface Cast {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	cast_id: number;
	character: string;
	credit_id: string;
	order: number;
  }
  
  export interface Crew {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	credit_id: string;
	department: string;
	job: string;
  }
  
  export interface MovieCredits {
	id: number;
	cast: Cast[];
	crew: Crew[];
  }
  
  export interface Video {
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	key: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	published_at: string;
	id: string;
  }
  
  export interface MovieVideos {
	id: number;
	results: Video[];
  }
  
  export interface Review {
	author: string;
	author_details: {
	  name: string;
	  username: string;
	  avatar_path: string | null;
	  rating: number | null;
	};
	content: string;
	created_at: string;
	id: string;
	updated_at: string;
	url: string;
  }
  
  export interface MovieReviews {
	id: number;
	page: number;
	results: Review[];
	total_pages: number;
	total_results: number;
  }
  
  // TV Show types
  export interface TVShow {
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	adult: boolean;
	genre_ids: number[];
	original_language: string;
	original_name: string;
	popularity: number;
	video: boolean;
	origin_country: string[];
  }
  
  export interface TVShowDetails extends TVShow {
	created_by: Array<{
	  id: number;
	  credit_id: string;
	  name: string;
	  gender: number;
	  profile_path: string | null;
	}>;
	episode_run_time: number[];
	genres: Genre[];
	homepage: string;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: {
	  id: number;
	  name: string;
	  overview: string;
	  vote_average: number;
	  vote_count: number;
	  air_date: string;
	  episode_number: number;
	  episode_type: string;
	  production_code: string;
	  runtime: number;
	  season_number: number;
	  show_id: number;
	  still_path: string | null;
	};
	next_episode_to_air: {
	  id: number;
	  name: string;
	  overview: string;
	  vote_average: number;
	  vote_count: number;
	  air_date: string;
	  episode_number: number;
	  episode_type: string;
	  production_code: string;
	  runtime: number;
	  season_number: number;
	  show_id: number;
	  still_path: string | null;
	};
	networks: Array<{
	  id: number;
	  logo_path: string | null;
	  name: string;
	  origin_country: string;
	}>;
	number_of_episodes: number;
	number_of_seasons: number;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	seasons: Array<{
	  air_date: string;
	  episode_count: number;
	  id: number;
	  name: string;
	  overview: string;
	  poster_path: string | null;
	  season_number: number;
	  vote_average: number;
	}>;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	type: string;
  }
  