const BACKEND_URL = "https://shop-ease-backend-blush.vercel.app";

export const getImageUrl = (image) => {
  if (!image) {
    return "https://via.placeholder.com/500x500?text=No+Image";
  }

  let imageUrl = String(image).trim();

  // Markdown URL ko normal URL mein convert karta hai
  const markdownMatch = imageUrl.match(/\]\((https?:\/\/[^)]+)\)/);

  if (markdownMatch) {
    imageUrl = markdownMatch[1];
  }

  // Agar URL [https://...] format mein ho
  if (imageUrl.startsWith("[") && imageUrl.endsWith("]")) {
    imageUrl = imageUrl.slice(1, -1);
  }

  // Agar Cloudinary ya koi complete URL hai
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Purani local uploads image ke liye
  if (imageUrl.startsWith("/")) {
    return `${BACKEND_URL}${imageUrl}`;
  }

  return `${BACKEND_URL}/${imageUrl}`;
};