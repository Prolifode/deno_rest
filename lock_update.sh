#!/bin/bash

echo "Updating lock file.."
deno cache --lock=deno.lock --lock-write --unstable ./deps.ts

exit 0
