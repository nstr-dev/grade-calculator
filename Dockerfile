FROM node:18-alpine

RUN apk add --no-cache libc6-compat bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical=0.36.18

WORKDIR /app
COPY / /app

RUN npm ci && npm run build;

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
ENV PORT=3000

CMD ["./run.sh"]
