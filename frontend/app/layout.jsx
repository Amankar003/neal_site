export const metadata = {
  title: 'Neal Driving School, Dhanbad | Car driving classes',
  description: 'Car driving classes in Dhaiya, Dhanbad. Manual and automatic cars, patient instructors, special training for ladies and first-time learners.',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffd21a' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Mukta:wght@400;500;700;800&family=Teko:wght@500;600;700&family=Hind:wght@400;500;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
