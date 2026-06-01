import './global.css';
import Providers from './providers';
import Header from './shared/widgets/header';
import{ Poppins, Roboto}from "next/font/google";

export const metadata = {
  title: 'Truskills',
  description: 'Tru-skills is a platform that allows users to create and share their skills with others. It is a great way to learn new skills and connect with other people who have similar interests.',
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700','800', '900'],
  variable: '--font-poppins',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable}`}>
      <body className ={`${roboto.variable} ${poppins.variable}`}>
        <Providers>
        <Header/>
        {children}
        </Providers>
      </body>
    </html>
  )
}
