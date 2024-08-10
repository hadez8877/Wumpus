import kleur from "kleur";

const labelType = {
  INFO: `${kleur.bgBlue().bold(" INFO ")}`,
  ERROR: `${kleur.bgRed().bold(" ERROR ")}`,
  WARN: `${kleur.bgYellow().bold(" WARN ")}`,
  DEBUG: `${kleur.bgMagenta().bold(" DEBUG ")}`,
  SUCCESS: `${kleur.bgGreen().bold(" SUCCESS ")}`,
  ONLINE: `${kleur.bgBlue().bold(" ONLINE ")}`,
  OFFLINE: `${kleur.bgRed().bold(" OFFLINE ")}`
};

export default labelType;
