import kleur from "kleur";

const labelType = {
    ERROR: `${kleur.bgRed().bold(" ERROR ")}`,
    WARNING: `${kleur.bgYellow().bold(" WARNING ")}`,
    SUCCESS: `${kleur.bgGreen().bold(" SUCCESS ")}`,
    ONLINE: `${kleur.bgBlue().bold(" ONLINE ")}`,
    OFFLINE: `${kleur.bgRed().bold(" OFFLINE ")}`,
    DEV: `${kleur.bgMagenta().bold(" DEV ")}`
};

export default labelType;