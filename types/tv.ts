// TV Series Interfaces
export interface TVSeries {
	id: number;
	name: string;
	poster_path: string | null;
	vote_average: number;
	first_air_date: string;
	overview: string;
	backdrop_path: string | null;
	genre_ids?: number[];
	popularity: number;
	vote_count: number;
	original_language: string;
	original_name: string;
	origin_country: string[];
  }
  
  export interface TVSeriesDetails extends TVSeries {
	genres: Genre[];
	episode_run_time: number[];
	number_of_episodes: number;
	number_of_seasons: number;
	seasons: Season[];
	status: string;
	tagline: string;
	type: string;
	last_air_date: string;
	homepage: string;
  }
  
  export interface Genre {
	id: number;
	name: string;
  }
  
  export interface Season {
	id: number;
	name: string;
	episode_count: number;
	season_number: number;
	air_date: string;
	overview: string;
	poster_path: string | null;
  }
  
  export interface Episode {
	id: number;
	name: string;
	episode_number: number;
	season_number: number;
	overview: string;
	air_date: string;
	runtime: number;
	vote_average: number;
	vote_count: number;
	still_path: string | null;
  }