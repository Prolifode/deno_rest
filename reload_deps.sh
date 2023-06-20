#!/bin/bash

echo "Reloading dependencies and updating lock file..."

deno cache --reload --unstable --lock-write --lock=deno.lock ./deps.ts

exit 0
