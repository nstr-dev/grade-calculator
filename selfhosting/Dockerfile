FROM node:18-alpine

WORKDIR /app
COPY / /app

ENV SELFHOSTED=1
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache curl libc6-compat && npm ci && npm run build;

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
