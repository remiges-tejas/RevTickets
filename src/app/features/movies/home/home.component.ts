import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../shared/models';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent, SkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  nowShowing = signal<Movie[]>([]);
  comingSoon = signal<Movie[]>([]);
  isLoading = signal(true);
  featuredMovie = signal<Movie | null>(null);

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    // Load now showing
    this.movieService.getNowShowing().subscribe(movies => {
      this.nowShowing.set(movies);
      if (movies.length > 0) {
        this.featuredMovie.set(movies[0]);
      }
    });

    // Load coming soon
    this.movieService.getComingSoon().subscribe(movies => {
      this.comingSoon.set(movies);
      this.isLoading.set(false);
    });
  }
}
