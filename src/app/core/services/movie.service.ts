import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map, catchError } from 'rxjs';
import { Movie, Show, MovieFilters, ShowFilters, PaginatedResponse } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_URL = `${environment.apiUrl}/movies`;
  private useMockData = true; // Set to false when backend is running

  // Mock data with working poster URLs
  private mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BMTQ2NjMwMTE1NF5BMl5BanBnXkFtZTcwMTMxNjEyMw@@._V1_FMjpg_UX1920_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
      duration: 148,
      releaseDate: new Date('2010-07-16'),
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      language: 'English',
      format: ['2D', 'IMAX'],
      cast: [
        { name: 'Leonardo DiCaprio', role: 'Cobb', imageUrl: '' },
        { name: 'Tom Hardy', role: 'Eames', imageUrl: '' },
        { name: 'Joseph Gordon-Levitt', role: 'Arthur', imageUrl: '' }
      ],
      director: 'Christopher Nolan',
      rating: 4.8,
      totalRatings: 15420,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1920_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
      duration: 152,
      releaseDate: new Date('2008-07-18'),
      genres: ['Action', 'Crime', 'Drama'],
      language: 'English',
      format: ['2D', 'IMAX', '4DX'],
      cast: [
        { name: 'Christian Bale', role: 'Batman', imageUrl: '' },
        { name: 'Heath Ledger', role: 'Joker', imageUrl: '' },
        { name: 'Aaron Eckhart', role: 'Harvey Dent', imageUrl: '' }
      ],
      director: 'Christopher Nolan',
      rating: 4.9,
      totalRatings: 23890,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1920_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      duration: 169,
      releaseDate: new Date('2014-11-07'),
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      language: 'English',
      format: ['2D', 'IMAX', 'DOLBY'],
      cast: [
        { name: 'Matthew McConaughey', role: 'Cooper', imageUrl: '' },
        { name: 'Anne Hathaway', role: 'Brand', imageUrl: '' },
        { name: 'Jessica Chastain', role: 'Murph', imageUrl: '' }
      ],
      director: 'Christopher Nolan',
      rating: 4.7,
      totalRatings: 18750,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      title: 'Dune: Part Two',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1920_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      duration: 166,
      releaseDate: new Date('2024-03-01'),
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      language: 'English',
      format: ['2D', '3D', 'IMAX', '4DX'],
      cast: [
        { name: 'Timothée Chalamet', role: 'Paul Atreides', imageUrl: '' },
        { name: 'Zendaya', role: 'Chani', imageUrl: '' },
        { name: 'Rebecca Ferguson', role: 'Lady Jessica', imageUrl: '' }
      ],
      director: 'Denis Villeneuve',
      rating: 4.6,
      totalRatings: 12340,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      title: 'Oppenheimer',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
      duration: 180,
      releaseDate: new Date('2023-07-21'),
      genres: ['Biography', 'Drama', 'History'],
      language: 'English',
      format: ['2D', 'IMAX', 'DOLBY'],
      cast: [
        { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', imageUrl: '' },
        { name: 'Emily Blunt', role: 'Kitty Oppenheimer', imageUrl: '' },
        { name: 'Robert Downey Jr.', role: 'Lewis Strauss', imageUrl: '' }
      ],
      director: 'Christopher Nolan',
      rating: 4.8,
      totalRatings: 19200,
      certificate: 'A',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      title: 'The Matrix',
      description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/vKQi3bBA1y8',
      duration: 136,
      releaseDate: new Date('1999-03-31'),
      genres: ['Action', 'Sci-Fi'],
      language: 'English',
      format: ['2D', '4DX'],
      cast: [
        { name: 'Keanu Reeves', role: 'Neo', imageUrl: '' },
        { name: 'Laurence Fishburne', role: 'Morpheus', imageUrl: '' },
        { name: 'Carrie-Anne Moss', role: 'Trinity', imageUrl: '' }
      ],
      director: 'The Wachowskis',
      rating: 4.7,
      totalRatings: 21500,
      certificate: 'A',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      title: 'Gladiator',
      description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/owK1qxDselE',
      duration: 155,
      releaseDate: new Date('2000-05-05'),
      genres: ['Action', 'Adventure', 'Drama'],
      language: 'English',
      format: ['2D', 'IMAX'],
      cast: [
        { name: 'Russell Crowe', role: 'Maximus', imageUrl: '' },
        { name: 'Joaquin Phoenix', role: 'Commodus', imageUrl: '' },
        { name: 'Connie Nielsen', role: 'Lucilla', imageUrl: '' }
      ],
      director: 'Ridley Scott',
      rating: 4.6,
      totalRatings: 16800,
      certificate: 'A',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8',
      title: 'Avatar: The Way of Water',
      description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
      duration: 192,
      releaseDate: new Date('2022-12-16'),
      genres: ['Action', 'Adventure', 'Fantasy'],
      language: 'English',
      format: ['3D', 'IMAX', '4DX', 'DOLBY'],
      cast: [
        { name: 'Sam Worthington', role: 'Jake Sully', imageUrl: '' },
        { name: 'Zoe Saldana', role: 'Neytiri', imageUrl: '' },
        { name: 'Sigourney Weaver', role: 'Kiri', imageUrl: '' }
      ],
      director: 'James Cameron',
      rating: 4.5,
      totalRatings: 14200,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      title: 'Spider-Man: No Way Home',
      description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/JfVOs4VSpmA',
      duration: 148,
      releaseDate: new Date('2021-12-17'),
      genres: ['Action', 'Adventure', 'Fantasy'],
      language: 'English',
      format: ['2D', '3D', 'IMAX', '4DX'],
      cast: [
        { name: 'Tom Holland', role: 'Spider-Man', imageUrl: '' },
        { name: 'Zendaya', role: 'MJ', imageUrl: '' },
        { name: 'Benedict Cumberbatch', role: 'Doctor Strange', imageUrl: '' }
      ],
      director: 'Jon Watts',
      rating: 4.7,
      totalRatings: 22100,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      title: 'Top Gun: Maverick',
      description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission that demands the ultimate sacrifice.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/embed/giXco2jaZ_4',
      duration: 130,
      releaseDate: new Date('2022-05-27'),
      genres: ['Action', 'Drama'],
      language: 'English',
      format: ['2D', 'IMAX', '4DX', 'DOLBY'],
      cast: [
        { name: 'Tom Cruise', role: 'Maverick', imageUrl: '' },
        { name: 'Miles Teller', role: 'Rooster', imageUrl: '' },
        { name: 'Jennifer Connelly', role: 'Penny', imageUrl: '' }
      ],
      director: 'Joseph Kosinski',
      rating: 4.8,
      totalRatings: 18900,
      certificate: 'UA',
      status: 'now_showing',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '11',
      title: 'Avatar 3',
      description: 'The third installment in the Avatar franchise continues the story of Jake Sully and Neytiri.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
      trailerUrl: '',
      duration: 180,
      releaseDate: new Date('2025-12-19'),
      genres: ['Action', 'Adventure', 'Fantasy'],
      language: 'English',
      format: ['3D', 'IMAX', '4DX', 'DOLBY'],
      cast: [
        { name: 'Sam Worthington', role: 'Jake Sully', imageUrl: '' },
        { name: 'Zoe Saldana', role: 'Neytiri', imageUrl: '' }
      ],
      director: 'James Cameron',
      rating: 0,
      totalRatings: 0,
      certificate: 'UA',
      status: 'coming_soon',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      title: 'Mission: Impossible 8',
      description: 'Ethan Hunt and his IMF team embark on their most dangerous mission yet.',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzFiZjc1YzctMDY3Zi00NGE5LTlmNWEtN2Q3OWFjYjY1NGM2XkEyXkFqcGdeQXVyMTUyMTUzNjQ0._V1_.jpg',
      bannerUrl: 'https://m.media-amazon.com/images/M/MV5BYzFiZjc1YzctMDY3Zi00NGE5LTlmNWEtN2Q3OWFjYjY1NGM2XkEyXkFqcGdeQXVyMTUyMTUzNjQ0._V1_.jpg',
      trailerUrl: '',
      duration: 165,
      releaseDate: new Date('2025-05-23'),
      genres: ['Action', 'Adventure', 'Thriller'],
      language: 'English',
      format: ['2D', 'IMAX', '4DX'],
      cast: [
        { name: 'Tom Cruise', role: 'Ethan Hunt', imageUrl: '' },
        { name: 'Hayley Atwell', role: 'Grace', imageUrl: '' }
      ],
      director: 'Christopher McQuarrie',
      rating: 0,
      totalRatings: 0,
      certificate: 'UA',
      status: 'coming_soon',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '13',
      title: 'Deadpool & Wolverine',
      description: 'Deadpool teams up with Wolverine in an adventure across the multiverse.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      trailerUrl: '',
      duration: 150,
      releaseDate: new Date('2024-07-26'),
      genres: ['Action', 'Comedy', 'Sci-Fi'],
      language: 'English',
      format: ['2D', 'IMAX', '4DX'],
      cast: [
        { name: 'Ryan Reynolds', role: 'Deadpool', imageUrl: '' },
        { name: 'Hugh Jackman', role: 'Wolverine', imageUrl: '' }
      ],
      director: 'Shawn Levy',
      rating: 0,
      totalRatings: 0,
      certificate: 'A',
      status: 'coming_soon',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '14',
      title: 'Joker: Folie à Deux',
      description: 'Arthur Fleck is institutionalized at Arkham awaiting trial for his crimes as Joker. While struggling with his dual identity, Arthur falls in love with Harley Quinn.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg',
      trailerUrl: '',
      duration: 138,
      releaseDate: new Date('2024-10-04'),
      genres: ['Crime', 'Drama', 'Musical'],
      language: 'English',
      format: ['2D', 'IMAX'],
      cast: [
        { name: 'Joaquin Phoenix', role: 'Joker', imageUrl: '' },
        { name: 'Lady Gaga', role: 'Harley Quinn', imageUrl: '' }
      ],
      director: 'Todd Phillips',
      rating: 0,
      totalRatings: 0,
      certificate: 'A',
      status: 'coming_soon',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {}

  getMovies(filters?: MovieFilters): Observable<Movie[]> {
    if (!this.useMockData) {
      let params = new HttpParams();
      if (filters?.status) params = params.set('status', filters.status);
      if (filters?.genres?.length) params = params.set('genres', filters.genres.join(','));
      if (filters?.languages?.length) params = params.set('languages', filters.languages.join(','));
      if (filters?.formats?.length) params = params.set('formats', filters.formats.join(','));
      if (filters?.rating) params = params.set('rating', filters.rating.toString());

      return this.http.get<Movie[]>(this.API_URL, { params }).pipe(
        catchError(() => this.getMockMovies(filters))
      );
    }

    return this.getMockMovies(filters);
  }

  private getMockMovies(filters?: MovieFilters): Observable<Movie[]> {
    let filteredMovies = [...this.mockMovies];

    if (filters) {
      if (filters.status) {
        filteredMovies = filteredMovies.filter(m => m.status === filters.status);
      }
      if (filters.genres && filters.genres.length) {
        filteredMovies = filteredMovies.filter(m =>
          m.genres.some(g => filters.genres!.includes(g))
        );
      }
      if (filters.languages && filters.languages.length) {
        filteredMovies = filteredMovies.filter(m =>
          filters.languages!.includes(m.language)
        );
      }
      if (filters.formats && filters.formats.length) {
        filteredMovies = filteredMovies.filter(m =>
          m.format.some(f => filters.formats!.includes(f))
        );
      }
      if (filters.rating) {
        filteredMovies = filteredMovies.filter(m => m.rating >= filters.rating!);
      }
    }

    return of(filteredMovies).pipe(delay(500));
  }

  getNowShowing(): Observable<Movie[]> {
    return this.getMovies({ status: 'now_showing' });
  }

  getComingSoon(): Observable<Movie[]> {
    return this.getMovies({ status: 'coming_soon' });
  }

  getMovieById(id: string): Observable<Movie | undefined> {
    const movie = this.mockMovies.find(m => m.id === id);
    return of(movie).pipe(delay(300));
  }

  searchMovies(query: string): Observable<Movie[]> {
    const results = this.mockMovies.filter(m =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
    return of(results).pipe(delay(300));
  }

  getGenres(): Observable<string[]> {
    const genres = [...new Set(this.mockMovies.flatMap(m => m.genres))];
    return of(genres.sort());
  }

  getLanguages(): Observable<string[]> {
    const languages = [...new Set(this.mockMovies.map(m => m.language))];
    return of(languages.sort());
  }

  // Admin methods
  createMovie(movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Observable<Movie> {
    const newMovie: Movie = {
      ...movie,
      id: Date.now().toString(),
      // Add defaults for required fields
      format: movie.format && movie.format.length > 0 ? movie.format : ['2D'],
      language: movie.language || 'English',
      genres: movie.genres && movie.genres.length > 0 ? movie.genres : ['Drama'],
      cast: movie.cast && movie.cast.length > 0 ? movie.cast : [],
      rating: movie.rating || 0,
      totalRatings: movie.totalRatings || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockMovies.push(newMovie);
    return of(newMovie).pipe(delay(500));
  }

  updateMovie(id: string, updates: Partial<Movie>): Observable<Movie> {
    const index = this.mockMovies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mockMovies[index] = {
        ...this.mockMovies[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockMovies[index]).pipe(delay(500));
    }
    throw new Error('Movie not found');
  }

  deleteMovie(id: string): Observable<void> {
    const index = this.mockMovies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mockMovies.splice(index, 1);
    }
    return of(void 0).pipe(delay(500));
  }
}
