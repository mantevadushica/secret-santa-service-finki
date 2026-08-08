# Firebase setup за Secret Santa FINKI

## 1. Креирај Firebase Web App
Во Firebase Console креирај проект и Web App. Од Project settings > Your apps земи ја Firebase конфигурацијата.

## 2. Environment variables
Копирај `.env.example` во `.env`:

```bash
copy .env.example .env
```

Потоа замени ги вредностите во `.env` со оние од Firebase Console.

## 3. Authentication
Во Firebase Console отвори **Authentication > Sign-in method** и овозможи **Email/Password**.

## 4. Firestore
Отвори **Firestore Database** и креирај база. Проектот користи:

- `users/{uid}`
- `users/{uid}/wishlist/{itemId}`
- `events/{eventId}`
- `events/{eventId}/participants/{uid}`
- `events/{eventId}/assignments/{giverUid}`

## 5. Security Rules
Во Firestore > Rules ископирај ја содржината од `firestore.rules` и Publish.

Ако користите Firebase CLI, `firebase.json` е веќе подготвен и правилата може да се deploy-ираат со Firebase CLI.

## 6. Стартување
Не копирај `node_modules` од друг компјутер. Во root на проектот пушти:

```bash
npm install
npm run dev
```

## Како функционира апликацијата
1. Корисник се регистрира преку Firebase Authentication.
2. Неговиот профил се зачувува во Firestore `users`.
3. Корисник може да креира Secret Santa event и станува organizer.
4. Event автоматски добива 6-знаковен join code.
5. Други најавени корисници се приклучуваат со кодот.
6. Organizer го активира извлекувањето кога има најмалку 3 членови.
7. Секој член може да го прочита само својот assignment преку Firestore Rules.
8. Receiver wishlist се прикажува во `Мој Secret Santa`.

## За автоматски e-mail покани
Core апликацијата не бара платен/надворешен mail provider. За автоматски invitation e-mail треба дополнително да конфигурирате mail provider (на пример преку Firebase backend/extension или Cloud Function). Тоа бара SMTP/API credentials што не треба да се commit-ираат во GitHub.
