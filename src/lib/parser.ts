/**
 * File parser for RAG (Retrieval Augmented Generation)
 * Supports: .txt, .md, .pdf, and other text-based files
 */

export interface ParseResult {
  success: boolean;
  content: string;
  error?: string;
  fileName: string;
  fileType: string;
}

/**
 * Parse a file and extract its text content
 */
export async function parseFile(file: File): Promise<ParseResult> {
  const fileName = file.name;
  const fileType = file.type || getFileTypeFromExtension(fileName);

  try {
    // Handle PDFs
    if (fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
      return await parsePDF(file);
    }

    // Handle text-based files
    if (isTextBasedFile(fileType, fileName)) {
      return await parseTextFile(file);
    }

    // Unsupported file type
    return {
      success: false,
      content: "",
      error: `Unsupported file type: ${fileType}`,
      fileName,
      fileType,
    };
  } catch (error) {
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Failed to parse file",
      fileName,
      fileType,
    };
  }
}

/**
 * Parse a text-based file (txt, md, json, etc.)
 */
async function parseTextFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve({
        success: true,
        content: content || "",
        fileName: file.name,
        fileType: file.type,
      });
    };

    reader.onerror = () => {
      resolve({
        success: false,
        content: "",
        error: "Failed to read file",
        fileName: file.name,
        fileType: file.type,
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Parse a PDF file using PDF.js
 */
async function parsePDF(file: File): Promise<ParseResult> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist");
    
    // Configure PDF.js worker
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    const numPages = pdf.numPages;

    // Extract text from all pages
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return {
      success: true,
      content: fullText.trim(),
      fileName: file.name,
      fileType: "application/pdf",
    };
  } catch (error) {
    return {
      success: false,
      content: "",
      error: `PDF parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      fileName: file.name,
      fileType: "application/pdf",
    };
  }
}

/**
 * Check if a file is text-based
 */
function isTextBasedFile(mimeType: string, fileName: string): boolean {
  // Check MIME type
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/xml" ||
    mimeType === "application/javascript"
  ) {
    return true;
  }

  // Check file extension
  const textExtensions = [
    ".txt",
    ".md",
    ".markdown",
    ".json",
    ".xml",
    ".csv",
    ".log",
    ".html",
    ".htm",
    ".css",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".sh",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".conf",
    ".cfg",
  ];

  const lowerFileName = fileName.toLowerCase();
  return textExtensions.some((ext) => lowerFileName.endsWith(ext));
}

/**
 * Get file type from extension when MIME type is not available
 */
function getFileTypeFromExtension(fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  
  const typeMap: Record<string, string> = {
    pdf: "application/pdf",
    txt: "text/plain",
    md: "text/markdown",
    markdown: "text/markdown",
    json: "application/json",
    xml: "application/xml",
    csv: "text/csv",
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "application/javascript",
    ts: "text/typescript",
  };

  return typeMap[ext || ""] || "application/octet-stream";
}

/**
 * Format parsed content for AI context
 */
export function formatFileContext(parseResult: ParseResult, userMessage: string): string {
  if (!parseResult.success || !parseResult.content) {
    return userMessage;
  }

  const fileInfo = `[File: ${parseResult.fileName}]\n\n${parseResult.content}\n\n---\n\n`;
  
  // If user provided a message, append it. Otherwise, use a default prompt
  if (userMessage.trim()) {
    return `${fileInfo}${userMessage}`;
  } else {
    return `${fileInfo}Please analyze the content of this file and provide insights.`;
  }
}
