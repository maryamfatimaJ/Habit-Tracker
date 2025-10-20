export const motivationalQuotes = [
  "Discipline turns dreams into reality.",
  "Small steps every day lead to big changes.",
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated daily.",
  "Your future is created by what you do today.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Excellence is not a destination; it is a continuous journey.",
  "You are never too old to set another goal.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Consistency is the key to unlocking your potential.",
  "What you do today can improve all your tomorrows.",
  "The only impossible journey is the one you never begin.",
  "Make each day your masterpiece.",
];

export const getQuoteOfTheDay = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return motivationalQuotes[dayOfYear % motivationalQuotes.length];
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
