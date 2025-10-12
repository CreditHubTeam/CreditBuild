# 🔄 Lệnh Đầy Đủ (All-in-one)

``` bash
# Chuyển vào thư mục project
cd "W:/WorkSpace_IT/_hackathon/ss_2/be_test/CreditBuild"

# Stop containers cũ
docker-compose -f docker/docker-compose.yml down

# Build lại image
docker-compose -f docker/docker-compose.yml build --no-cache

# Start containers
docker-compose -f docker/docker-compose.yml up -d

# Xem logs
docker-compose -f docker/docker-compose.yml logs -f app

```

# 🛠️ Lệnh Quản Lý Thêm

``` bash
# Stop containers
docker-compose -f docker/docker-compose.yml down

# Restart containers
docker-compose -f docker/docker-compose.yml restart

# Chạy seed lại trong container
docker-compose -f docker/docker-compose.yml exec app npm run db:seed

# Xem status containers
docker-compose -f docker/docker-compose.yml ps

```
