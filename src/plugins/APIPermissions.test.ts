import { GuildMember, PermissionsBitField } from "discord.js";
import checkPermissions from "../plugins/checkPermissions";
import test from "ava";
import type APIPermissions from "../types/permssions";

const mockGuildMember = (permissions: bigint): GuildMember =>
  ({
    permissions: new PermissionsBitField(permissions),
    id: "1234567890"
  }) as GuildMember;

test("should return true when the member has all the required permissions", (t) => {
  const permissions: APIPermissions[] = ["sendMessages", "manageRoles"];
  const member = mockGuildMember(PermissionsBitField.Flags.SendMessages | PermissionsBitField.Flags.ManageRoles);

  const result = checkPermissions(member, permissions);

  t.true(result.hasPermissions);
  t.deepEqual(result.missingPermissions, []);
});

test("should return false and list the missing permissions when the member lacks required permissions", (t) => {
  const permissions: APIPermissions[] = ["sendMessages", "manageRoles"];
  const member = mockGuildMember(PermissionsBitField.Flags.SendMessages);

  const result = checkPermissions(member, permissions);

  t.false(result.hasPermissions);
  t.deepEqual(result.missingPermissions, ["manageRoles"]);
});

test("should return false when the member is not a developer and the required permission is developer", (t) => {
  const permissions: APIPermissions[] = ["manageAccess"];
  const member = mockGuildMember(PermissionsBitField.Flags.Administrator);

  const result = checkPermissions(member, permissions);

  t.false(result.hasPermissions);
  t.deepEqual(result.missingPermissions, ["manageAccess"]);
});

test("should return true when the member is a developer and the required permission is developer", (t) => {
  const permissions: APIPermissions[] = ["manageAccess"];
  const member = {
    ...mockGuildMember(PermissionsBitField.Flags.Administrator),
    id: "1173072980000112671"
  } as GuildMember;

  const result = checkPermissions(member, permissions);

  t.true(result.hasPermissions);
  t.deepEqual(result.missingPermissions, []);
});
