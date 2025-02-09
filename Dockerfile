FROM denoland/deno:2.1.9

EXPOSE 9000

WORKDIR /app/deno-rest
COPY deno.lock .
ADD . .
