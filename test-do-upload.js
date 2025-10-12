
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

(async () => {
  try {
    const s3Client = new S3Client({
      endpoint: "https://fra1.digitaloceanspaces.com",
      region: "fra1",
      credentials: {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
      },
    });

    const fileContent = fs.readFileSync("README.md");

    const data = await s3Client.send(new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: "test-upload.md",
      Body: fileContent,
      ACL: "public-read",
    }));

    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
})();
