export interface Video {
  id: string;
  title: string;
  description: string | null;
  publicId: string;
  compressedSize: string;
  duration: number;
  createdAt: Date;
  orginalSize: string;
  updatedAt: Date;
}