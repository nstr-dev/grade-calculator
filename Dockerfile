FROM node:18-alpine

ARG NEXT_PUBLIC_MOCK_OAUTH_WELLKNOWN_URL
ARG NEXT_PUBLIC_CUSTOM_OAUTH_NAME

ENV NEXT_PUBLIC_MOCK_OAUTH_WELLKNOWN_URL=${NEXT_PUBLIC_MOCK_OAUTH_WELLKNOWN_URL}
ENV NEXT_PUBLIC_CUSTOM_OAUTH_NAME=${NEXT_PUBLIC_CUSTOM_OAUTH_NAME}

WORKDIR /app
COPY / /app

RUN apk add --no-cache bash curl libc6-compat && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add --no-cache infisical=0.36.18 && chmod +x ./run.sh \
&& npm ci && npm run build;

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
ENV PORT=3000

CMD ["bash", "./run.sh"]
