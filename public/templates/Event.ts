import { Events } from "discord.js";
import Event from "../../src/lib/events/Event";

class NameEvent extends Event {
    constructor() {
        super("name", {
            once: false
        });
    }

    async run(/* Event variables */) {
        // The logic of the event...
    }
};

export default NameEvent;