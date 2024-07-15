# react project build
cd ../frontend
npm run build

# index.html, main.js 복사(이동) : dist -> static
cd ../backend
rm -rf src/main/resources/static
mv ../frontend/dist src/main/resources/static

# spring project build
./gradlew bootJar

# build image
#docker build -t kwonsanta/spacehub .
docker buildx build --platform linux/amd64 -t kwonsanta/spacehub .

# push image
docker push kwonsanta/spacehub

# remote 에서

# 컨테이너 멈추고
ssh -i src/main/resources/secret/EC2_keyfile.pem ubuntu@43.201.65.136 'docker stop spacehub'
# 컨테이너 삭제
ssh -i src/main/resources/secret/EC2_keyfile.pem ubuntu@43.201.65.136 'docker rm spacehub'
# pull image
ssh -i src/main/resources/secret/EC2_keyfile.pem ubuntu@43.201.65.136 'docker pull kwonsanta/spacehub'
# 컨테이너 실행
ssh -i src/main/resources/secret/EC2_keyfile.pem ubuntu@43.201.65.136 'docker run -d -p 8080:8080 --restart always --name spacehub kwonsanta/spacehub'
# 필요없는 이미지 삭제
ssh -i src/main/resources/secret/EC2_keyfile.pem ubuntu@43.201.65.136 'docker image prune -f'