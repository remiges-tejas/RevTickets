-- RevTickets Mock Data
-- This script populates the database with sample data

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM shows;
-- DELETE FROM screens;
-- DELETE FROM theaters;
-- DELETE FROM movies;
-- DELETE FROM users;

-- =============================================
-- USERS (password is 'password123' for all users)
-- BCrypt hash for 'password123'
-- =============================================
INSERT INTO users (email, password, full_name, phone, created_at, updated_at) VALUES
('admin@revtickets.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGxMwBaF/lA6p8C5qG.rLCBfu', 'Admin User', '9876543210', NOW(), NOW()),
('john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGxMwBaF/lA6p8C5qG.rLCBfu', 'John Doe', '9876543211', NOW(), NOW()),
('jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGxMwBaF/lA6p8C5qG.rLCBfu', 'Jane Smith', '9876543212', NOW(), NOW()),
('mike@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGxMwBaF/lA6p8C5qG.rLCBfu', 'Mike Johnson', '9876543213', NOW(), NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Add admin role
INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_ADMIN' FROM users WHERE email = 'admin@revtickets.com'
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- Add user roles
INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_USER' FROM users WHERE email IN ('john@example.com', 'jane@example.com', 'mike@example.com')
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- =============================================
-- MOVIES
-- =============================================
INSERT INTO movies (id, title, description, duration, rating, certificate, release_date, poster_url, banner_url, trailer_url, status, languages, created_at, updated_at) VALUES
(1, 'Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future.', 166, 8.8, 'PG-13', '2024-03-01', 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', 'https://www.youtube.com/watch?v=Way9Dexny3w', 'now_showing', 'English,Hindi', NOW(), NOW()),

(2, 'Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.', 180, 8.9, 'R', '2023-07-21', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg', 'https://www.youtube.com/watch?v=uYPbbksJxIg', 'now_showing', 'English,Hindi', NOW(), NOW()),

(3, 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 148, 8.8, 'PG-13', '2010-07-16', 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg', 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'now_showing', 'English,Hindi', NOW(), NOW()),

(4, 'The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 152, 9.0, 'PG-13', '2008-07-18', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'now_showing', 'English,Hindi', NOW(), NOW()),

(5, 'Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 169, 8.7, 'PG-13', '2014-11-07', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'now_showing', 'English,Hindi', NOW(), NOW()),

(6, 'Avatar: The Way of Water', 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na''vi race to protect their home.', 192, 7.6, 'PG-13', '2022-12-16', 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg', 'https://www.youtube.com/watch?v=d9MyW72ELq0', 'now_showing', 'English,Hindi,Telugu', NOW(), NOW()),

(7, 'Spider-Man: No Way Home', 'With Spider-Man''s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.', 148, 8.2, 'PG-13', '2021-12-17', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg', 'https://www.youtube.com/watch?v=JfVOs4VSpmA', 'now_showing', 'English,Hindi', NOW(), NOW()),

(8, 'Top Gun: Maverick', 'After more than thirty years of service as one of the Navy''s top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.', 130, 8.3, 'PG-13', '2022-05-27', 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', 'https://image.tmdb.org/t/p/original/AaV1YIdWKThTnDZ4bD6J6hNhNla.jpg', 'https://www.youtube.com/watch?v=qSqVVswa420', 'now_showing', 'English,Hindi', NOW(), NOW()),

(9, 'The Batman', 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city''s hidden corruption and question his family''s involvement.', 176, 7.8, 'PG-13', '2022-03-04', 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez9xq6cXtXNNuZ.jpg', 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', 'https://www.youtube.com/watch?v=mqqft2x_Aa4', 'now_showing', 'English,Hindi', NOW(), NOW()),

(10, 'John Wick: Chapter 4', 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.', 169, 7.7, 'R', '2023-03-24', 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg', 'https://www.youtube.com/watch?v=qEVUtrk8_B4', 'now_showing', 'English,Hindi', NOW(), NOW()),

(11, 'Deadpool & Wolverine', 'Deadpool''s peaceful existence comes crashing down when the Time Variance Authority recruits him to help safeguard the multiverse. He soon unites with his would-be pal, Wolverine, to complete the mission.', 127, 8.0, 'R', '2024-07-26', 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg', 'https://www.youtube.com/watch?v=73_1biulkYk', 'coming_soon', 'English,Hindi', NOW(), NOW()),

(12, 'Joker: Folie a Deux', 'Arthur Fleck is institutionalized at Arkham awaiting trial for his crimes as Joker. While struggling with his dual identity, Arthur not only stumbles upon true love, but also finds the music that has always been inside him.', 138, 5.5, 'R', '2024-10-04', 'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg', 'https://image.tmdb.org/t/p/original/hV5CiTS5YPRGcLRwN0DHZFe5HxN.jpg', 'https://www.youtube.com/watch?v=_OKAwz2MsJs', 'coming_soon', 'English,Hindi', NOW(), NOW()),

(13, 'Gladiator II', 'Lucius, the son of Lucilla, must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome.', 148, 0.0, 'R', '2024-11-22', 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg', 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg', 'https://www.youtube.com/watch?v=4rgYUipGJNo', 'coming_soon', 'English,Hindi', NOW(), NOW()),

(14, 'Wicked', 'The story of how a green-skinned woman framed by the Wizard of Oz becomes the Wicked Witch of the West.', 160, 0.0, 'PG', '2024-11-27', 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg', 'https://image.tmdb.org/t/p/original/uKb22E0nlzr914bA9KyA5CVDl5Y.jpg', 'https://www.youtube.com/watch?v=6COmYeLsz4c', 'coming_soon', 'English', NOW(), NOW()),

(15, 'Moana 2', 'Moana journeys to the far seas of Oceania after receiving an unexpected call from her wayfinding ancestors.', 100, 0.0, 'PG', '2024-11-27', 'https://image.tmdb.org/t/p/w500/m0SbwFNCa9epW1X60deLqTHiP7x.jpg', 'https://image.tmdb.org/t/p/original/tElnmtQ6yz1PjN1kePNl8yMrmxQ.jpg', 'https://www.youtube.com/watch?v=hDZ7y8RP5HE', 'coming_soon', 'English,Hindi', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Add genres for movies
INSERT INTO movie_genres (movie_id, genre) VALUES
(1, 'Sci-Fi'), (1, 'Adventure'), (1, 'Drama'),
(2, 'Biography'), (2, 'Drama'), (2, 'History'),
(3, 'Sci-Fi'), (3, 'Action'), (3, 'Thriller'),
(4, 'Action'), (4, 'Crime'), (4, 'Drama'),
(5, 'Sci-Fi'), (5, 'Adventure'), (5, 'Drama'),
(6, 'Sci-Fi'), (6, 'Adventure'), (6, 'Action'),
(7, 'Action'), (7, 'Adventure'), (7, 'Sci-Fi'),
(8, 'Action'), (8, 'Drama'),
(9, 'Action'), (9, 'Crime'), (9, 'Drama'),
(10, 'Action'), (10, 'Crime'), (10, 'Thriller'),
(11, 'Action'), (11, 'Comedy'), (11, 'Sci-Fi'),
(12, 'Crime'), (12, 'Drama'), (12, 'Musical'),
(13, 'Action'), (13, 'Adventure'), (13, 'Drama'),
(14, 'Fantasy'), (14, 'Musical'),
(15, 'Animation'), (15, 'Adventure'), (15, 'Family')
ON DUPLICATE KEY UPDATE genre = VALUES(genre);

-- Add cast for movies
INSERT INTO movie_cast (movie_id, cast_member) VALUES
(1, 'Timothee Chalamet'), (1, 'Zendaya'), (1, 'Rebecca Ferguson'), (1, 'Josh Brolin'),
(2, 'Cillian Murphy'), (2, 'Emily Blunt'), (2, 'Matt Damon'), (2, 'Robert Downey Jr.'),
(3, 'Leonardo DiCaprio'), (3, 'Joseph Gordon-Levitt'), (3, 'Ellen Page'), (3, 'Tom Hardy'),
(4, 'Christian Bale'), (4, 'Heath Ledger'), (4, 'Aaron Eckhart'), (4, 'Michael Caine'),
(5, 'Matthew McConaughey'), (5, 'Anne Hathaway'), (5, 'Jessica Chastain'), (5, 'Michael Caine'),
(6, 'Sam Worthington'), (6, 'Zoe Saldana'), (6, 'Sigourney Weaver'), (6, 'Kate Winslet'),
(7, 'Tom Holland'), (7, 'Zendaya'), (7, 'Benedict Cumberbatch'), (7, 'Tobey Maguire'),
(8, 'Tom Cruise'), (8, 'Miles Teller'), (8, 'Jennifer Connelly'), (8, 'Jon Hamm'),
(9, 'Robert Pattinson'), (9, 'Zoe Kravitz'), (9, 'Paul Dano'), (9, 'Colin Farrell'),
(10, 'Keanu Reeves'), (10, 'Donnie Yen'), (10, 'Bill Skarsgard'), (10, 'Laurence Fishburne'),
(11, 'Ryan Reynolds'), (11, 'Hugh Jackman'), (11, 'Emma Corrin'), (11, 'Matthew Macfadyen'),
(12, 'Joaquin Phoenix'), (12, 'Lady Gaga'), (12, 'Brendan Gleeson'), (12, 'Zazie Beetz'),
(13, 'Paul Mescal'), (13, 'Denzel Washington'), (13, 'Pedro Pascal'), (13, 'Connie Nielsen'),
(14, 'Cynthia Erivo'), (14, 'Ariana Grande'), (14, 'Michelle Yeoh'), (14, 'Jeff Goldblum'),
(15, 'Auli''i Cravalho'), (15, 'Dwayne Johnson'), (15, 'Alan Tudyk')
ON DUPLICATE KEY UPDATE cast_member = VALUES(cast_member);

-- =============================================
-- THEATERS
-- =============================================
INSERT INTO theaters (id, name, address, city, state, pincode, phone, email, total_screens, facilities, created_at, updated_at) VALUES
(1, 'PVR Cinemas - Phoenix Mall', 'Phoenix Marketcity, LBS Marg, Kurla West', 'Mumbai', 'Maharashtra', '400070', '022-12345678', 'phoenix@pvr.com', 6, 'Parking,Food Court,Wheelchair Access,Dolby Atmos', NOW(), NOW()),
(2, 'INOX - R City Mall', 'R City Mall, LBS Marg, Ghatkopar West', 'Mumbai', 'Maharashtra', '400086', '022-87654321', 'rcity@inox.com', 5, 'Parking,Food Court,IMAX,4DX', NOW(), NOW()),
(3, 'Cinepolis - Andheri', 'Fun Republic Mall, Off New Link Road, Andheri West', 'Mumbai', 'Maharashtra', '400053', '022-11223344', 'andheri@cinepolis.com', 4, 'Parking,Food Court,Dolby Atmos,Recliner Seats', NOW(), NOW()),
(4, 'PVR Cinemas - Infinity Mall', 'Infinity Mall, Link Road, Malad West', 'Mumbai', 'Maharashtra', '400064', '022-55667788', 'infinity@pvr.com', 5, 'Parking,Food Court,IMAX,Premium Lounge', NOW(), NOW()),
(5, 'INOX - Nariman Point', 'NCPA Marg, Nariman Point', 'Mumbai', 'Maharashtra', '400021', '022-99887766', 'nariman@inox.com', 3, 'Valet Parking,Gourmet Food,Luxury Seating', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =============================================
-- SCREENS
-- =============================================
INSERT INTO screens (id, theater_id, name, screen_type, total_seats, rows_count, columns_count, created_at, updated_at) VALUES
-- PVR Phoenix Mall Screens
(1, 1, 'Audi 1', 'IMAX', 280, 14, 20, NOW(), NOW()),
(2, 1, 'Audi 2', 'Dolby Atmos', 200, 10, 20, NOW(), NOW()),
(3, 1, 'Audi 3', 'Standard', 180, 9, 20, NOW(), NOW()),
(4, 1, 'Audi 4', 'Standard', 180, 9, 20, NOW(), NOW()),
(5, 1, 'Audi 5', '4DX', 120, 8, 15, NOW(), NOW()),
(6, 1, 'Audi 6', 'Gold Class', 50, 5, 10, NOW(), NOW()),

-- INOX R City Screens
(7, 2, 'Screen 1', 'IMAX', 300, 15, 20, NOW(), NOW()),
(8, 2, 'Screen 2', '4DX', 100, 10, 10, NOW(), NOW()),
(9, 2, 'Screen 3', 'Standard', 200, 10, 20, NOW(), NOW()),
(10, 2, 'Screen 4', 'Standard', 180, 9, 20, NOW(), NOW()),
(11, 2, 'Screen 5', 'Dolby Atmos', 220, 11, 20, NOW(), NOW()),

-- Cinepolis Andheri Screens
(12, 3, 'Hall A', 'Dolby Atmos', 250, 10, 25, NOW(), NOW()),
(13, 3, 'Hall B', 'Standard', 200, 10, 20, NOW(), NOW()),
(14, 3, 'Hall C', 'Recliner', 80, 8, 10, NOW(), NOW()),
(15, 3, 'Hall D', 'Standard', 180, 9, 20, NOW(), NOW()),

-- PVR Infinity Mall Screens
(16, 4, 'Audi 1', 'IMAX', 320, 16, 20, NOW(), NOW()),
(17, 4, 'Audi 2', 'Standard', 200, 10, 20, NOW(), NOW()),
(18, 4, 'Audi 3', 'Premium', 100, 10, 10, NOW(), NOW()),
(19, 4, 'Audi 4', 'Standard', 180, 9, 20, NOW(), NOW()),
(20, 4, 'Audi 5', 'Dolby Atmos', 220, 11, 20, NOW(), NOW()),

-- INOX Nariman Point Screens
(21, 5, 'Insignia 1', 'Luxury', 60, 6, 10, NOW(), NOW()),
(22, 5, 'Insignia 2', 'Luxury', 60, 6, 10, NOW(), NOW()),
(23, 5, 'Insignia 3', 'Premium', 80, 8, 10, NOW(), NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =============================================
-- SHOWS (for next 7 days)
-- =============================================
-- Generate shows for multiple movies across theaters

-- Dune: Part Two shows
INSERT INTO shows (movie_id, theater_id, screen_id, show_date, show_time, price, available_seats, status, created_at, updated_at) VALUES
(1, 1, 1, CURDATE(), '10:00:00', 450.00, 280, 'available', NOW(), NOW()),
(1, 1, 1, CURDATE(), '14:00:00', 450.00, 280, 'available', NOW(), NOW()),
(1, 1, 1, CURDATE(), '18:00:00', 500.00, 280, 'available', NOW(), NOW()),
(1, 1, 1, CURDATE(), '21:30:00', 500.00, 280, 'available', NOW(), NOW()),
(1, 2, 7, CURDATE(), '11:00:00', 480.00, 300, 'available', NOW(), NOW()),
(1, 2, 7, CURDATE(), '15:00:00', 480.00, 300, 'available', NOW(), NOW()),
(1, 2, 7, CURDATE(), '19:00:00', 520.00, 300, 'available', NOW(), NOW()),
(1, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', 450.00, 280, 'available', NOW(), NOW()),
(1, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', 450.00, 280, 'available', NOW(), NOW()),
(1, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', 500.00, 280, 'available', NOW(), NOW()),
(1, 2, 7, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 480.00, 300, 'available', NOW(), NOW()),
(1, 2, 7, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', 520.00, 300, 'available', NOW(), NOW()),

-- Oppenheimer shows
(2, 1, 2, CURDATE(), '09:30:00', 350.00, 200, 'available', NOW(), NOW()),
(2, 1, 2, CURDATE(), '13:30:00', 350.00, 200, 'available', NOW(), NOW()),
(2, 1, 2, CURDATE(), '17:30:00', 400.00, 200, 'available', NOW(), NOW()),
(2, 1, 2, CURDATE(), '21:00:00', 400.00, 200, 'available', NOW(), NOW()),
(2, 3, 12, CURDATE(), '10:30:00', 380.00, 250, 'available', NOW(), NOW()),
(2, 3, 12, CURDATE(), '14:30:00', 380.00, 250, 'available', NOW(), NOW()),
(2, 3, 12, CURDATE(), '18:30:00', 420.00, 250, 'available', NOW(), NOW()),
(2, 1, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:30:00', 350.00, 200, 'available', NOW(), NOW()),
(2, 1, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:30:00', 400.00, 200, 'available', NOW(), NOW()),
(2, 3, 12, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:30:00', 380.00, 250, 'available', NOW(), NOW()),

-- Inception shows
(3, 1, 3, CURDATE(), '10:00:00', 300.00, 180, 'available', NOW(), NOW()),
(3, 1, 3, CURDATE(), '14:00:00', 300.00, 180, 'available', NOW(), NOW()),
(3, 1, 3, CURDATE(), '18:00:00', 350.00, 180, 'available', NOW(), NOW()),
(3, 1, 3, CURDATE(), '21:30:00', 350.00, 180, 'available', NOW(), NOW()),
(3, 4, 17, CURDATE(), '11:00:00', 320.00, 200, 'available', NOW(), NOW()),
(3, 4, 17, CURDATE(), '15:00:00', 320.00, 200, 'available', NOW(), NOW()),
(3, 4, 17, CURDATE(), '19:00:00', 380.00, 200, 'available', NOW(), NOW()),
(3, 1, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', 300.00, 180, 'available', NOW(), NOW()),
(3, 1, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', 350.00, 180, 'available', NOW(), NOW()),

-- The Dark Knight shows
(4, 2, 9, CURDATE(), '10:30:00', 280.00, 200, 'available', NOW(), NOW()),
(4, 2, 9, CURDATE(), '14:30:00', 280.00, 200, 'available', NOW(), NOW()),
(4, 2, 9, CURDATE(), '18:30:00', 320.00, 200, 'available', NOW(), NOW()),
(4, 2, 9, CURDATE(), '22:00:00', 320.00, 200, 'available', NOW(), NOW()),
(4, 5, 21, CURDATE(), '12:00:00', 600.00, 60, 'available', NOW(), NOW()),
(4, 5, 21, CURDATE(), '16:00:00', 600.00, 60, 'available', NOW(), NOW()),
(4, 5, 21, CURDATE(), '20:00:00', 700.00, 60, 'available', NOW(), NOW()),

-- Interstellar shows
(5, 1, 4, CURDATE(), '09:00:00', 320.00, 180, 'available', NOW(), NOW()),
(5, 1, 4, CURDATE(), '13:00:00', 320.00, 180, 'available', NOW(), NOW()),
(5, 1, 4, CURDATE(), '17:00:00', 380.00, 180, 'available', NOW(), NOW()),
(5, 1, 4, CURDATE(), '21:00:00', 380.00, 180, 'available', NOW(), NOW()),
(5, 3, 13, CURDATE(), '10:00:00', 300.00, 200, 'available', NOW(), NOW()),
(5, 3, 13, CURDATE(), '14:00:00', 300.00, 200, 'available', NOW(), NOW()),
(5, 3, 13, CURDATE(), '18:00:00', 350.00, 200, 'available', NOW(), NOW()),

-- Avatar: The Way of Water shows
(6, 2, 7, CURDATE(), '09:00:00', 500.00, 300, 'available', NOW(), NOW()),
(6, 2, 7, CURDATE(), '13:00:00', 500.00, 300, 'available', NOW(), NOW()),
(6, 4, 16, CURDATE(), '10:00:00', 520.00, 320, 'available', NOW(), NOW()),
(6, 4, 16, CURDATE(), '14:00:00', 520.00, 320, 'available', NOW(), NOW()),
(6, 4, 16, CURDATE(), '18:00:00', 580.00, 320, 'available', NOW(), NOW()),
(6, 4, 16, CURDATE(), '22:00:00', 580.00, 320, 'available', NOW(), NOW()),

-- Spider-Man: No Way Home shows
(7, 1, 5, CURDATE(), '11:00:00', 400.00, 120, 'available', NOW(), NOW()),
(7, 1, 5, CURDATE(), '15:00:00', 400.00, 120, 'available', NOW(), NOW()),
(7, 1, 5, CURDATE(), '19:00:00', 450.00, 120, 'available', NOW(), NOW()),
(7, 2, 8, CURDATE(), '12:00:00', 420.00, 100, 'available', NOW(), NOW()),
(7, 2, 8, CURDATE(), '16:00:00', 420.00, 100, 'available', NOW(), NOW()),
(7, 2, 8, CURDATE(), '20:00:00', 480.00, 100, 'available', NOW(), NOW()),

-- Top Gun: Maverick shows
(8, 3, 14, CURDATE(), '10:00:00', 500.00, 80, 'available', NOW(), NOW()),
(8, 3, 14, CURDATE(), '14:00:00', 500.00, 80, 'available', NOW(), NOW()),
(8, 3, 14, CURDATE(), '18:00:00', 550.00, 80, 'available', NOW(), NOW()),
(8, 3, 14, CURDATE(), '22:00:00', 550.00, 80, 'available', NOW(), NOW()),
(8, 4, 18, CURDATE(), '11:00:00', 480.00, 100, 'available', NOW(), NOW()),
(8, 4, 18, CURDATE(), '15:00:00', 480.00, 100, 'available', NOW(), NOW()),
(8, 4, 18, CURDATE(), '19:00:00', 520.00, 100, 'available', NOW(), NOW()),

-- The Batman shows
(9, 2, 11, CURDATE(), '10:00:00', 380.00, 220, 'available', NOW(), NOW()),
(9, 2, 11, CURDATE(), '14:00:00', 380.00, 220, 'available', NOW(), NOW()),
(9, 2, 11, CURDATE(), '18:00:00', 420.00, 220, 'available', NOW(), NOW()),
(9, 2, 11, CURDATE(), '22:00:00', 420.00, 220, 'available', NOW(), NOW()),
(9, 5, 22, CURDATE(), '13:00:00', 650.00, 60, 'available', NOW(), NOW()),
(9, 5, 22, CURDATE(), '17:00:00', 650.00, 60, 'available', NOW(), NOW()),
(9, 5, 22, CURDATE(), '21:00:00', 750.00, 60, 'available', NOW(), NOW()),

-- John Wick: Chapter 4 shows
(10, 4, 20, CURDATE(), '10:30:00', 400.00, 220, 'available', NOW(), NOW()),
(10, 4, 20, CURDATE(), '14:30:00', 400.00, 220, 'available', NOW(), NOW()),
(10, 4, 20, CURDATE(), '18:30:00', 450.00, 220, 'available', NOW(), NOW()),
(10, 4, 20, CURDATE(), '22:30:00', 450.00, 220, 'available', NOW(), NOW()),
(10, 5, 23, CURDATE(), '11:00:00', 550.00, 80, 'available', NOW(), NOW()),
(10, 5, 23, CURDATE(), '15:00:00', 550.00, 80, 'available', NOW(), NOW()),
(10, 5, 23, CURDATE(), '19:00:00', 600.00, 80, 'available', NOW(), NOW())
ON DUPLICATE KEY UPDATE movie_id = VALUES(movie_id);
