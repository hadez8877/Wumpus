import { GuildMember } from "discord.js";
import Permissions from "../api/permissions";
import APIPermissions from "../types/permssions";

const checkPermissions = (
  member: GuildMember,
  permissions: APIPermissions[]
): { hasPermissions: boolean; missingPermissions: APIPermissions[] } => {
  const missingPermissions = permissions.filter((p) => {
    if (p === "manageAccess") {
      const developers = ["1173072980000112671"];

      return !developers.includes(member.id);
    }

    const requiredFlag = Permissions[p];

    return requiredFlag ? !member.permissions.has(requiredFlag) : false;
  });

  return {
    hasPermissions: missingPermissions.length === 0,
    missingPermissions
  };
};

export default checkPermissions;
