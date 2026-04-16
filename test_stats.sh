TOKEN=$(curl -sX POST http://localhost:8080/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"admin@dhakapapers.com","password":"password123"}' | jq -r .token)
curl -s http://localhost:8080/api/v1/stats -H "Authorization: Bearer $TOKEN" | jq .
