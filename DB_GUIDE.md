# Database Guide

This guide explains how to update your database when you modify Prisma schema fields.

## 📋 Quick Reference

| Action | Command | Use Case |
|--------|---------|----------|
| **Development** | `docker compose -f docker/docker-compose.yml exec app npx prisma db push` | Quick schema changes, prototyping |
| **Production** | `docker compose -f docker/docker-compose.yml exec app npx prisma migrate dev` | Create migration files |
| **Deploy** | `docker compose -f docker/docker-compose.yml exec app npx prisma migrate deploy` | Apply migrations in production |

## 🔄 Workflow

### 1. **Development Mode** (Recommended for testing)

When you modify `prisma/schema.prisma`:

```bash
# Push schema changes directly to database
docker compose -f docker/docker-compose.yml exec app npx prisma db push

# Regenerate Prisma client
docker compose -f docker/docker-compose.yml exec app npx prisma generate
```

### 2. **Production Mode** (Create migration files)

When you're ready to commit changes:

```bash
# Create a migration file
docker compose -f docker/docker-compose.yml exec app npx prisma migrate dev --name your_migration_name

# Example: Adding a new field
docker compose -f docker/docker-compose.yml exec app npx prisma migrate dev --name add_user_email_field
```

## 📝 Common Scenarios

### Adding a New Field

1. Edit `prisma/schema.prisma`
2. Run: `npx prisma db push` (dev) or `npx prisma migrate dev --name add_new_field` (prod)

### Modifying Existing Field

1. Edit `prisma/schema.prisma`
2. Run: `npx prisma db push` (dev) or `npx prisma migrate dev --name modify_field_name` (prod)

### Deleting a Field

1. Remove field from `prisma/schema.prisma`
2. Run: `npx prisma db push` (dev) or `npx prisma migrate dev --name remove_field_name` (prod)

## 🚨 Important Notes

- **Always backup your database** before major schema changes
- Use `db push` for development/testing
- Use `migrate dev` to create migration files for version control
- Use `migrate deploy` for production deployments
- After schema changes, always run `prisma generate` to update the client

## 🛠️ Troubleshooting

### If you get sync errors

```bash
# Reset database (⚠️ DELETES ALL DATA)
docker compose -f docker/docker-compose.yml exec app npx prisma migrate reset

# Or force push changes
docker compose -f docker/docker-compose.yml exec app npx prisma db push --force-reset
```

### If client is not updated

```bash
# Regenerate Prisma client
docker compose -f docker/docker-compose.yml exec app npx prisma generate

# Restart app container
docker compose -f docker/docker-compose.yml restart app
```

## 📁 File Structure

```
prisma/
├── schema.prisma       # Your database schema
├── migrations/         # Migration files (auto-generated)
└── seed.mjs           # Seed data script
```

## 🎯 Best Practices

1. **Development**: Use `db push` for rapid prototyping
2. **Before commits**: Create migrations with `migrate dev`
3. **Production**: Only use `migrate deploy`
4. **Team work**: Always commit migration files to version control
5. **Testing**: Run seed after major schema changes

---

💡 **Pro Tip**: Always test schema changes in development before applying to production!
