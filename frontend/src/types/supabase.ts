export interface SignedUrlResponse {
  signedUrl: string,
  path: string,
  token: string,
}

export interface FileUploadResponse {
  path: string,
  fullPath: string,
}