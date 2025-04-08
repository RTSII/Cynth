export interface InspirationItem {
  id: string;
  type: 'image' | 'video' | 'quote';
  title: string;
  tags?: string[];
  
  // For images
  source?: any; // image source
  description?: string;
  
  // For videos
  thumbnail?: any; // video thumbnail
  
  // For quotes
  quote?: string;
  author?: string;
  backgroundColor?: string;
}
