"use server";

import { Account } from "@/db/schema";
import { logger } from "@/lib/logger";
import { catchProblem } from "@/lib/problem";
import { getAccount } from "@/lib/services/user-service";

export async function deleteKeycloakAccount() {
  const account: Account = catchProblem(await getAccount());
  if (account.provider === "nstr-auth")
    return deleteKeycloakAccountById(account.providerAccountId);
  return { success: true };
}

export async function deleteKeycloakAccountById(userId: string) {
  const keycloakHost = "https://auth.atlas.nstr.dev";
  const realm = "public";
  const clientId = "account-deletion";
  const clientSecret = process.env.NSTR_OAUTH_DELETION_TOKEN!;

  if (clientSecret == null) return { success: false };

  logger.info("Getting Keycloak service account token...");

  const tokenResponse = await fetch(
    `${keycloakHost}/realms/${realm}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    }
  );

  if (!tokenResponse.ok) {
    throw new Error("Failed to get access token from Keycloak");
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  logger.info(`Deleting Keycloak account with id: ${userId}`);
  const deleteResponse = await fetch(
    `${keycloakHost}/admin/realms/${realm}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!deleteResponse.ok) {
    const errorText = await deleteResponse.text();
    throw new Error(
      `Failed to delete user: ${deleteResponse.status} ${errorText}`
    );
  }

  return { success: true };
}
