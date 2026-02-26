export const funEmojis = ["●", "☆", "△"];

export function getRandomEmoji() {
  return funEmojis[Math.floor(Math.random() * funEmojis.length)];
}
