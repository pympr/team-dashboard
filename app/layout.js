
import "./globals.css";

export const metadata = {
  title: "Team Dashboard",
  description: "Team availability tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
