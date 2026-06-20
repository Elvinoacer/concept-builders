import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "./src/lib/r2-client";

async function setCors() {
  const command = new PutBucketCorsCommand({
    Bucket: R2_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          AllowedOrigins: [
            "http://localhost:3000",
            "https://www.conceptbuilders.co.ke",
            "https://conceptbuilders.co.ke"
          ],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  });

  try {
    await r2Client.send(command);
    console.log("Successfully set CORS configuration for bucket: " + R2_BUCKET_NAME);
  } catch (err) {
    console.error("Error setting CORS configuration:", err);
  }
}

setCors();
