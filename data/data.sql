DROP TABLE IF exists watch;

CREATE TABLE watch (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(255),
  title VARCHAR(255)
)