# Stage 1: Build the backend
FROM node:18 AS builder

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Create a non-root user (UID 1001)
RUN addgroup --system appgroup && adduser --system --uid 1001 --ingroup appgroup appuser

# Set permissions
RUN chown -R appuser:appgroup /app

# Final image
FROM node:18

WORKDIR /app

COPY --from=builder /app /app

# Use non-root user
USER 1001

CMD ["node", "index.js"]
