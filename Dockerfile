FROM nginx:latest

COPY index.html /usr/share/nginx/html/
COPY pong.js /usr/share/nginx/html/

EXPOSE 80

RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /etc/ssl/private/nginx.key -out /etc/ssl/certs/nginx.crt -subj "/C=FR/ST=Occitanie/L=Perpignan/O=42/CN=localhost";

COPY ./nginx/ /etc/nginx/sites-enabled/nginx

