-- 1. Insertar datos en users 
INSERT INTO bookapp.dbo.users (username, email, password)
VALUES ('abel', 'abel@example.com', '$2a$10$9u4.iHMo7YBvGPRGnTyKj.lpHKoFXrG/rAmSJ3YSdF1bg9iuRFZ0C');

-- 2. Insertar datos en genres
INSERT INTO bookapp.dbo.genres (name, user_id)
VALUES 
('Programming', 1),
('Java', 1),
('Software Engineering', 1),
('Data Systems', 1),
('Software Architecture', 1);

-- 3. Insertar datos en books
INSERT INTO bookapp.dbo.books (isbn, created_at, published_date, synopsis, title, genre_id, user_id)
VALUES 
('9783161484100', GETDATE(), '2018-01-11', 'A book about writing clean and maintainable code.', 'Clean Code',
 (SELECT id FROM bookapp.dbo.genres WHERE name = 'Programming' AND user_id = 1), 1),

('9780137081073', GETDATE(), '2018-01-11', 'Best practices for Java programming using effective techniques.', 'Effective Java',
 (SELECT id FROM bookapp.dbo.genres WHERE name = 'Java' AND user_id = 1), 1),

('9780132350884', GETDATE(), '1999-10-30', 'Classic advice and techniques for becoming a better programmer.', 'The Pragmatic Programmer',
 (SELECT id FROM bookapp.dbo.genres WHERE name = 'Software Engineering' AND user_id = 1), 1),

('9781491950296', GETDATE(), '2017-03-16', 'Covers fundamentals of building scalable and reliable systems.', 'Designing Data-Intensive Applications',
 (SELECT id FROM bookapp.dbo.genres WHERE name = 'Data Systems' AND user_id = 1), 1),

('9780201633610', GETDATE(), '1994-10-21', 'Defines reusable solutions to common software design problems.', 'Design Patterns',
 (SELECT id FROM bookapp.dbo.genres WHERE name = 'Software Architecture' AND user_id = 1), 1);
