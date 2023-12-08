
## Getting Started

init package

```bash
npm init

sequelize init

- run migrations: 
npx sequelize-cli db:migrate

- run seeder:
npx sequelize-cli db:seed:all

- start:
npm start

```

*Note: máy tính cài phải sequelize; thay đổi nội dung file config/config.son và .env: 

- config/config.son:
```
{
  "development": {
    "username": [your username],
    "password": [your password],
    "database": "giasu_api",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": [your username],
    "password": [your password],
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": [your username],
    "password": [your password],
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

- .env:

```
PORT=3000
ACCESS_TOKEN_SECRET="anything"
REFRESH_TOKEN_SECRET="anything"
ACCESS_TOKEN_EXP="3h"
REFRESH_TOKEN_EXP="7d"
```
