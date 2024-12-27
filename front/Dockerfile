FROM node

WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . /client/
EXPOSE 5174
CMD ["npm", "run", "dev"]