FROM node:lts-alpine AS builder

ENV NODE_ENV production

WORKDIR /app

COPY package.json ./

RUN npm install --production


COPY . .

RUN npm run build --production

CMD ["npm", "start"]

FROM nginx:alpine as production

ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]