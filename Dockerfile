#FROM node:18-slim
#WORKDIR /app

# Install small tools (curl, netcat) needed for wait-for-it
#RUN apt-get update && apt-get install -y --no-install-recommends \
  #curl \
  #netcat-openbsd \
  #ca-certificates \
  #&& rm -rf /var/lib/apt/lists/*

# get wait-for-it helper
#RUN curl -fsSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it.sh \
  #&& chmod +x /usr/local/bin/wait-for-it.sh

# Copy package first to leverage layer cache
#COPY package*.json ./
#RUN npm install

# copy app
#COPY . .

#ENV NODE_ENV=development
#EXPOSE 3000

# Wait for SQL Server to be reachable then start app
#CMD [ "sh", "-c", "/usr/local/bin/wait-for-it.sh db:1433 --timeout=60 --strict -- npm start" ]

git init
git add docker-compose.yml
git add .env -f

git add migrations/ seeders/ README.md
git commit -m "Add SQL Server container setup"
