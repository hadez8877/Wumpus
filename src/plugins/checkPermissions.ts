import { GuildMember } from "discord.js";
import Permissions from "@/utils/permissions";
import APIPermissions from "@/types/permssions";

const checkPermissions = (
  member: GuildMember,
  permissions: APIPermissions[],
): { hasPermissions: boolean; missingPermissions: APIPermissions[] } => {
  const missingPermissions = permissions.filter((permission) => {
    if (permission === "developer") {
      const developers = ["1173072980000112671"];

      return !developers.includes(member.id);
    }

    const requiredFlag = Permissions[permission];

    return requiredFlag ? !member.permissions.has(requiredFlag) : false;
  });

  return {
    hasPermissions: missingPermissions.length === 0,
    missingPermissions,
  };
};

export default checkPermissions;
