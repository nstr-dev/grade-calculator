#!/bin/bash
INFISICAL_TOKEN=$(infisical login --method=universal-auth --client-id=$INFISICAL_MACHINE_CLIENT_ID --client-secret=$INFISICAL_MACHINE_CLIENT_SECRET --plain --silent)
unset INFISICAL_MACHINE_CLIENT_ID
unset INFISICAL_MACHINE_CLIENT_SECRET
exec infisical run --token $INFISICAL_TOKEN --projectId $PROJECT_ID --env $INFISICAL_SECRET_ENV --domain $INFISICAL_API_URL -- npm start