FROM node:lts
EXPOSE 3000

# set working directory

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies

# add app
COPY ./budgetapp.frontend ./app
WORKDIR /app

RUN  npm i --silent

RUN npm run build
RUN apt-get update && apt-get install -y openssl
RUN openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout app_key.pem -out app_cert.pem -subj "/CN=localhost" -days 3650
RUN openssl pkcs12 -export -out app_key_cert.p12 -inkey app_key.pem -in app_cert.pem -nodes -passout pass:
RUN openssl pkcs12 -in app_key_cert.p12 -out app_key2.pem -nodes -passin pass:
RUN cp app_cert.pem /usr/local/share/ca-certificates/
RUN cp app_key2.pem /usr/local/share/ca-certificates/
# RUN cat app_cert.pem && cat app_key2.pem &&  exit -1
RUN chmod 644 /usr/local/share/ca-certificates/app_cert.pem && chmod 644 /usr/local/share/ca-certificates/app_key2.pem
RUN update-ca-certificates

# RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
# RUN chown appuser /usr/local/share/ca-certificates/app_cert.pem && chown appuser /usr/local/share/ca-certificates/app_key2.pem

# USER appuser
RUN npm install serve -g --silent

# start app
CMD ["serve", "-s", "build", "--ssl-cert", "/usr/local/share/ca-certificates/app_cert.pem", "--ssl-key", "/usr/local/share/ca-certificates/app_key2.pem", "-C", "-l", "3000"]