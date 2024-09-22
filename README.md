Firebase の認証、CRUD 機能を備えた Todo アプリ

## Firebase

```
npm install firebase //初期化
npm i react-firebase-hooks //ログイン状態を提供してくれるフック
```

## 注意点

-   Internal error: FirebaseError: Missing or insufficient permissions.(権限エラー)

```
service cloud.firestore {
 match /databases/{database}/documents {
   match /{document=**} {
      <!-- allow read, write: if false; -->
      allow read, write: if request.auth != null;
   }
 }
}
```

はじめは読み書きができないように設定されている。認証済みユーザーのみに権限を与えるように変更する。

-
