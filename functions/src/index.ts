const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage : GoogleCloudStorage} = require('@google-cloud/storage');
const storage = new GoogleCloudStorage();

admin.initializeApp();

exports.deleteOldFiles = functions.pubsub.schedule('every 24 hours').onRun(async (context: any) => {
    const bucketName = 'your-bucket-name'; // Firebase Storage 버킷 이름
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles();

    const now = Date.now();
    const cutoff = now - (60 * 1000);
    // const cutoff = now - (30 * 24 * 60 * 60 * 1000); // 30일 기준

    const deletions = files.map(async (file: { getMetadata: () => [any] | PromiseLike<[any]>; delete: () => any; name: any; }) => {
        const [metadata] = await file.getMetadata();
        const updated = new Date(metadata.updated).getTime();

        if (updated < cutoff) {
            await file.delete();
            console.log(`Deleted file: ${file.name}`);
        }
    });

    await Promise.all(deletions);
    console.log('Old files cleanup completed.');
});
