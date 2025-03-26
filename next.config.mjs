/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_USERS: JSON.stringify([
        { name: 'Giancarlo Uzzo', dailyHours: 7 },
        { name: 'Guglielmo Salvo', dailyHours: 7 },
        { name: 'Raimondo Meli', dailyHours: 7 }, 
        { name: 'Juri Gentili', dailyHours: 7 },
        { name: 'Fabrizio Lo Re', dailyHours: 7 },
        { name: 'Guido Conforti', dailyHours: 7 },
        { name: 'Luca De Baptistis', dailyHours: 7 },
        { name: 'Danilo Lutti', dailyHours: 7 },
        { name: 'Nicola Fabiani', dailyHours: 7 },
        { name: 'Veronica Minaudo', dailyHours: 4 },
        { name: 'Samuele Meli', dailyHours: 7 },
        { name: 'Paolo Purpura', dailyHours: 7 },
        { name: 'Simone Garofalo', dailyHours: 7 },
        { name: 'Valentina Crocetti', dailyHours: 7 }
      ])
    }
  }

export default nextConfig;
