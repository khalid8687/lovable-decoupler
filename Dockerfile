FROM node:20

# Set environment variables
ENV PORT=7860

WORKDIR /app

# Install standard system tools needed for building (like git or curl if required)
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

# Copy package configuration and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

CMD ["npm", "start"]
