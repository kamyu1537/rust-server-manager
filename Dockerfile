FROM node:lts as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:lts

ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

CMD ["npm", "run", "start"]
