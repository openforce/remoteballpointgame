FROM node:12.14.1-alpine AS build
WORKDIR /app
COPY ./WebContent ./

ARG ANALYTICS_KEY
ENV ANALYTICS_KEY=${ANALYTICS_KEY}
RUN echo "ANALYTICS_KEY=$ANALYTICS_KEY"

RUN npm ci
RUN npx tsc --p ./static/src/tsconfig.json -w false
RUN npx webpack --config webpack.config.js
 
CMD ["npm", "start"]

EXPOSE 5000