const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

(async () => {
  try {
    const s3Client = new S3Client({
      endpoint: "https://digitaloceanspaces.com",
      credentials: {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
      },
    });

    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success. Buckets:", data.Buckets);
  } catch (err) {
    console.log("Error", err);
  }
})();