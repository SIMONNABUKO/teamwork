CREATE TABLE articles (
  ID SERIAL PRIMARY KEY,
  article TEXT,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO articles (article, title)
VALUES  ('This is gonnna be a ery long article', 'How to code in Node js');