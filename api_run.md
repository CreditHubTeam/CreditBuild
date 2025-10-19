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

🚀 Các Lệnh Chạy Docker CreditBuild:

1. Stop containers cũ (nếu có):

```bash
cd "W:/WorkSpace_IT/_hackathon/ss_2/be_test/CreditBuild"
docker-compose -f docker/docker-compose.yml down
```

2. Build Docker image (với --no-cache để đảm bảo code mới):

```bash
docker-compose -f docker/docker-compose.yml build --no-cache
```

3. Start containers:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

4. Xem logs để kiểm tra:

```bash
# Xem logs của app container
docker-compose -f docker/docker-compose.yml logs app

# Hoặc theo dõi logs real-time
docker-compose -f docker/docker-compose.yml logs -f app
```

5. Test APIs:

```bash
# Test dashboard API
curl -X GET "http://localhost:3000/api/dashboard?address=0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00" -H "Content-Type: application/json"

# Test fan-clubs API
curl -X GET "http://localhost:3000/api/fan-clubs" -H "Content-Type: application/json"

# Test challenges API
curl -X GET "http://localhost:3000/api/challenges" -H "Content-Type: application/json"
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
