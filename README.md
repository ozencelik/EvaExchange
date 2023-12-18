# EvaExchange
 This project is built in the context of eva coding interview.

## Commands for sequelize
```bash
# Creates the database
npx sequelize-cli db:create

# Drops the database
npx sequelize-cli db:drop


# Generate migrations
npx sequelize-cli migration:generate --name [name_of_your_migration]

# Load migrations
npx sequelize-cli db:migrate

# Undo migrations
npx sequelize-cli db:migrate:undo:all


# Generate seeders
npx sequelize-cli seed:generate --name [name_of_your_migration]

# Load seeders
npx sequelize-cli db:seed:all

# Undo seeders
npx sequelize-cli db:seed:undo:all

