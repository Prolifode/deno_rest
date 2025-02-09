FROM denoland/deno:1.34.3

EXPOSE 9000

WORKDIR /app/deno-rest
COPY deno.lock .
ADD . .
