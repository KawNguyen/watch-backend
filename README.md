# Reset database

npx prisma migrate reset

# Create a new migration

npx prisma migrate dev --name update_user_role_and_avatar

# Apply migrations to database

npx prisma migrate deploy

# Push schema changes directly to database (without migrations)

npx prisma db push

# Run seed script

npx prisma db seed

# (Optional) View your database in Prisma Studio

npx prisma studio
