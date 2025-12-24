export interface WishData {
  id: number;
  name: string;
  quote: string;
  message: string[];
  signature: string;
  isSpecial?: boolean; // For the birthday logic
  // Key is the index of the message line that triggers the danmu
  // Value is the list of strings to fly across the screen
  danmuConfig?: Record<number, string[]>; 
}

export interface GoldenWishData {
  title: string;
  quote: string;
  message: string[];
  signature: string;
}