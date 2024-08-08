import BaseModule from "@/lib/BaseModule";

interface EventData {
  once?: boolean
}

abstract class Event extends BaseModule {
  once?: boolean;

    constructor(id: string, { once }: EventData) {
      super(id, { once });
      this.once = once || false;
    }

    abstract run(...args: any[]): void;
}

export default Event;
