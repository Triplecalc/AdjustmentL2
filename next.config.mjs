/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт для GitHub Pages
  output: 'export',
  
  // Базовый путь - замените 'AdjustmentL2' на название вашего репозитория
  // Если используете username.github.io - оставьте пустым ''
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Для корректной работы ассетов на GitHub Pages
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Добавляем trailing slash для GitHub Pages
  trailingSlash: true,
}

export default nextConfig
