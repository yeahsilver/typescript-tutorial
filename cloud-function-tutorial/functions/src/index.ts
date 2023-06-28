const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

exports.addMessage = onRequest(async (req: any, res: any) => {
    const original = req.query.text;
    const writeResult = await getFirestore().collection("messages").add({ original: original });
    logger.log("Write result: ", writeResult);
    res.json({result: "Message with ID: ${writeResult.id} added."});
});

exports.makeUppercase = onDocumentCreated("/messages/{documentId}", (event: any) => {
    const original = event.data().original;
    logger.log("Uppercasing", event.params.documentId, original);

    const upperCase = original.toUpperCase();
    return event.data.ref.set({ upperCase }, { merge: true });
});