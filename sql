-- 3. Crear tabla users
CREATE TABLE bookapp.dbo.users (
    id bigint IDENTITY(1,1) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    CONSTRAINT PK__users__3213E83F2158E5F7 PRIMARY KEY (id),
    CONSTRAINT UK6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email),
    CONSTRAINT UKr43af9ap4edm43mmtq01oddj6 UNIQUE (username)
);

-- 4. Crear tabla books
CREATE TABLE bookapp.dbo.books (
    isbn varchar(255) NOT NULL,
    created_at datetime2(6) NOT NULL,
    genre varchar(255) NOT NULL,
    published_date varchar(255) NOT NULL,
    synopsis text NOT NULL,
    title varchar(255) NOT NULL,
    user_id bigint NOT NULL,
    CONSTRAINT PK__books__99F9D0A562ED4AA8 PRIMARY KEY (isbn),
    CONSTRAINT FKcykkh3hxh89ammmwch0gw5o1s FOREIGN KEY (user_id) REFERENCES bookapp.dbo.users(id)
);

-- 5. Insertar datos en users
INSERT INTO bookapp.dbo.users (username, email, password)
VALUES ('abel', 'abel@example.com', 'abel123');

-- 6. Insertar datos en books
INSERT INTO bookapp.dbo.books (isbn, created_at, genre, published_date, synopsis, title, user_id)
VALUES 
('9783161484100', GETDATE(), 'Programming', '2018-01-11', 'A book about writing clean and maintainable code.', 'Clean Code', 1),
('9780137081073', GETDATE(), 'Java', '2018-01-11', 'Best practices for Java programming using effective techniques.', 'Effective Java', 1),
('9780132350884', GETDATE(), 'Software Engineering', '1999-10-30', 'Classic advice and techniques for becoming a better programmer.', 'The Pragmatic Programmer', 1),
('9781491950296', GETDATE(), 'Data Systems', '2017-03-16', 'Covers fundamentals of building scalable and reliable systems.', 'Designing Data-Intensive Applications', 1),
('9780201633610', GETDATE(), 'Software Architecture', '1994-10-21', 'Defines reusable solutions to common software design problems.', 'Design Patterns', 1);