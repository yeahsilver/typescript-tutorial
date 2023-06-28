// Cloud Functions와 트리거를 생성하기 위한 Firebase SDK를 불러오기
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// Firebase Admin SDK를 사용하여 Cloud Firestore에 접근
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// text 매개 변수를 http endpoint에서 받아 '/messages/:documentId/original' 경로를 가지고 있는 Firestore에 삽입
exports.addmessage = onRequest(async (req: any, res: any) => {
  const original = req.query.text;
  logger.log(original);


  // Firebase Admin SDK를 사용하여 Firestore에 접근 후 새로운 메시지 푸시
  const writeResult = await getFirestore().collection("messages").add({original: original});

  logger.log(writeResult.id);

  // 보낸 메시지를 다시 받기
  res.json({result: "Message with ID: ${writeResult.id} added."});
});

// exports.addmessage = onCall((request: any) => {
//   // 클라이언트로부터 받은 텍스트
//   const text = request.text;

//   // request를 보낸 사용자의 authentication 정보 변수화
//   const uid = request.auth.id;
//   const name = request.auth.token.name || null;
//   const picture = request.auth.token.picture || null;
//   const email = request.auth.token.email || null;

//   const sanitizedMessage = sanitizer.sanitizeText(text);

//   return getDatabase().ref("/messages").push({
//     text: sanitizedMessage,
//     author: {uid, name, picture, email},
//   }).then(() => {
//     logger.info("New Message written");

//     return {text: sanitizedMessage};
//   }).catch((error) => {
//     throw new HttpsError("unknown", error.message, error);
//   });
// });

// /messages/:documentId/original에 새로운 메시지가 추가되는지 Listen
// 메시지르 받으면 uppercase 버전의 메시지를 /messages/:documentId/uppercase에 저장 
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event: any) => {
  const original = event.data.data().original;

  logger.log('Uppercasing', event.params.documentId, original);
  const uppercase = original.toUpperCase();

  return event.data.ref.set({uppercase}, {merge: true});
});