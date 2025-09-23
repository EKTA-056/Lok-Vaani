import fs from "fs";
import path from "path";
import { ApiError } from "./ApiError";

// PDF upload and base64 storage
export function convertPdfToBase64(file: Express.Multer.File): string {
  if (!file) {
    throw new ApiError(400, "PDF file is required");
  }

  // Read file and convert to base64
  const filePath = path.join(file.destination, file.filename);
  const fileBuffer = fs.readFileSync(filePath);
  const pdfBase64 = fileBuffer.toString("base64");

  return pdfBase64;
}