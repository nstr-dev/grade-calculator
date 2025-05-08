#!/bin/bash
INFISICAL_TOKEN=$(infisical login --method=universal-auth --client-id=$INFISICAL_MACHINE_CLIENT_ID --client-secret=$INFISICAL_MACHINE_CLIENT_SECRET --plain --silent)
unset INFISICAL_MACHINE_CLIENT_ID
unset INFISICAL_MACHINE_CLIENT_SECRET
export NEXTAUTH_URL=$(infisical secrets get NEXTAUTH_URL --plain --silent --env $INFISICAL_SECRET_ENV || echo $COOLIFY_DOMAIN_URL)
exec infisical run --token $INFISICAL_TOKEN --projectId $PROJECT_ID --env $INFISICAL_SECRET_ENV --domain $INFISICAL_API_URL -- npm start