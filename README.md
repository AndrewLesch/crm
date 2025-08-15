# CRM Project

## Цель
Сайт для хранения личных данных клиентов и их услуг.

## Функционал
- Клиенты: создание, редактирование, просмотр, фильтры по услугам, полу, статусу, дате рождения/регистрации  
- Услуги: список, даты активности, связь с клиентами  
- Сортировка клиентов по дате регистрации

## Технологии
- Backend: NestJS, Prisma, PostgreSQL  
- Auth: JWT + Guards (USER — просмотр, EDITOR — полный доступ)  
- Frontend: React (SPA, формы и фильтры) -> реализация в другом проекте
- API: REST

## Тестовые пользователи
- **Editor:** `editor@example.com` / `editor123`  
- **User:** `user@example.com` / `user123`  

## Запуск
npm install
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run start:dev
