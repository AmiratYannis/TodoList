FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3500
ENV MONGO_URI=mongodb://mongo:27017/todolist
CMD ["npm", "start"]
