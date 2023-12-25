# NestJS boilerplate

## Tech Stack

- NestJS
- postgresql
- redis
- Docker
- typeorm
- swagger

## 특징

- 세션기반 로그인
- 유저 권한을 4단계(ADMIN, OWNER, MANAGER, MEMBER)로 세분화

## 서비스 실행 순서

1. DB & REDIS 실행  
   `docker-compose up -d`
2. 패키지 설치  
   `npm install`
3. Migration:generate  
   `npm run db:gen`
4. Migration:run  
   `npm run db:up`
5. Seed  
   `npm run db:seed`
6. API 서버 실행  
   `npm run dev`

## Migrate

1. src/\*\*/\*.entity.ts 작성
2. Migration:generate  
   `npm run db:gen`
3. Migration:run  
   `npm run db:up`
