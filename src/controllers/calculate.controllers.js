import { asyncHandler } from "../utils/asyncHandler.js";
import { s3Client } from "../lib/aws-s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { PDFDocument } from "pdf-lib";

const cURLHandler = asyncHandler(async (req, res) => {
  const command = new GetObjectCommand({
    Bucket: "3d-developer-task",
    Key: "27486932.pdf",
    ResponseContentType: "application/pdf",
  });
  try {
    const response = await s3Client.send(command);
    const pdfInstance = await response.Body.transformToByteArray();

    const pdfData = new Uint8Array(pdfInstance);
    const pdfDocs = await PDFDocument.load(pdfData);
    const pages = pdfDocs.getPages();
    for (const page of pages) {
      // Get the text content of the page
      const form = await page.doc.getOrCreateForm();
      const pageContent = await page.getTextContent({
        normalizeWhitespace: true,
      });

      console.log("Pages: ", pageContent);
    }

    // console.log("PdfDocs: ", pages);
  } catch (err) {
    console.error(err);
  }
});

export { cURLHandler };

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
