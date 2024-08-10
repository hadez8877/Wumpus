import kleur from "kleur";

const labelType = {
  INFO: `${kleur.bgMagenta().bold(" INFO ")}`,
  ERROR: `${kleur.bgRed().bold(" ERROR ")}`,
  WARNING: `${kleur.bgYellow().bold(" WARNING ")}`,
  SUCCESS: `${kleur.bgGreen().bold(" SUCCESS ")}`,
  ONLINE: `${kleur.bgBlue().bold(" ONLINE ")}`,
  OFFLINE: `${kleur.bgRed().bold(" OFFLINE ")}`
};

export default labelType;
