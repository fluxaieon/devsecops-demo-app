FROM node:18

WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install

COPY . .

# Create non-root user
RUN addgroup --system appgroup && adduser --system --uid 1001 --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app
USER 1001

EXPOSE 8080
CMD ["node", "server.js"]
