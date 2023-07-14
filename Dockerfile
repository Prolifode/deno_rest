FROM denoland/deno:1.35.0

EXPOSE 9000

WORKDIR /app/deno-rest

COPY deps.ts .
COPY deno.lock .
COPY import_map.json .

ADD . .

RUN deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon/denon.ts
