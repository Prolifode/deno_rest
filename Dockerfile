FROM denoland/deno:latest

EXPOSE 9000

WORKDIR /app/deno-rest

COPY deps.ts .

RUN deno cache --reload --unstable --lock-write --lock=lock.json ./deps.ts

ADD . .

RUN deno cache app.ts

RUN deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon/denon.ts