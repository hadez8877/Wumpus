import { describe, it, expect } from "vitest";
import { GuildMember, PermissionsBitField } from "discord.js";
import checkPermissions from "@/plugins/checkPermissions";
import type APIPermissions from "@/types/permssions";

const mockGuildMember = (permissions: bigint): GuildMember =>
  ({
    permissions: new PermissionsBitField(permissions),
    id: "1234567890"
  }) as GuildMember;

describe("Check Permissions", () => {
  it("should return true when the member has all the required permissions", () => {
    const permissions: APIPermissions[] = ["sendMessages", "manageRoles"];
    const member = mockGuildMember(PermissionsBitField.Flags.SendMessages | PermissionsBitField.Flags.ManageRoles);

    const result = checkPermissions(member, permissions);

    expect(result.hasPermissions).toBe(true);
    expect(result.missingPermissions).toHaveLength(0);
  });

  it("should return false and list the missing permissions when the member lacks required permissions", () => {
    const permissions: APIPermissions[] = ["sendMessages", "manageRoles"];
    const member = mockGuildMember(PermissionsBitField.Flags.SendMessages);

    const result = checkPermissions(member, permissions);

    expect(result.hasPermissions).toBe(false);
    expect(result.missingPermissions).toEqual(["manageRoles"]);
  });

  it("should return false when the member is not a developer and the required permission is 'developer'", () => {
    const permissions: APIPermissions[] = ["manageAccess"];
    const member = mockGuildMember(PermissionsBitField.Flags.Administrator);

    const result = checkPermissions(member, permissions);

    expect(result.hasPermissions).toBe(false);
    expect(result.missingPermissions).toEqual(["manageAccess"]);
  });

  it("should return true when the member is a developer and the required permission is 'developer'", () => {
    const permissions: APIPermissions[] = ["manageAccess"];
    const member = {
      ...mockGuildMember(PermissionsBitField.Flags.Administrator),
      id: "1173072980000112671"
    } as GuildMember;

    const result = checkPermissions(member, permissions);

    expect(result.hasPermissions).toBe(true);
    expect(result.missingPermissions).toHaveLength(0);
  });
});
