FROM node:12.14.1-alpine AS build
WORKDIR /app
COPY ./WebContent ./

RUN npm ci
RUN npx tsc --p ./static/src/tsconfig.json -w false
RUN npx webpack --config webpack.config.js
 
CMD ["npm", "start"]

EXPOSE 5000
EXPOSE 5001