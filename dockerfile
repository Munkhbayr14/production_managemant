# 1. Аль Node.js хувилбарыг ашиглах вэ
FROM node:18-alpine

# 2. Контейнер доторх ажлын хавтас
WORKDIR /usr/src/app

# 3. Хамааралтай сангуудыг хуулах (Package.json)
COPY package*.json ./

# 4. Сангуудыг суулгах
RUN npm install

# 5. Бүх кодоо хуулах
COPY . .

# 6. Кодоо Build хийх (Dist хавтас үүсгэх)
RUN npm run build

# 7. Аппликэйшн асах тушаал
CMD ["npm", "run", "start"]