# exposed on NAS with port 20003

FROM node:lts-alpine AS builder

# if API is behind a reverse proxy, use relative URLs
ENV REACT_APP_YAHOO_URL=api/yahoo-finance
ENV REACT_APP_EXCHANGE_RATES_URL=api/exchange-rate-ecb

# ENV REACT_APP_YAHOO_URL=https://stockquote-api.lionelschiepers.synology.me/api/yahoo-finance
# ENV REACT_APP_EXCHANGE_RATES_URL=https://stockquote-api.lionelschiepers.synology.me/api/exchange-rate-ecb

ENV NODE_ENV=production

WORKDIR /app

# copy both package.json and package-lock.json to leverage layer cache & reproducible installs
COPY package*.json ./

# prefer npm ci when a lockfile exists (faster, deterministic)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
# RUN npm audit fix

COPY . .

# build with full dependencies present
RUN npm run build

FROM nginx:alpine AS production

RUN apk update
RUN apk upgrade --no-interactive --no-progress

# Copy the built application from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# simple HTTP healthcheck (uses wget from busybox)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]