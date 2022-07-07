import { EventBus, PublishPacer, SimVarDefinition, SimVarValueType } from "msfssdk/data";
import { SimVarPublisher } from "msfssdk/instruments";

export interface LandingStatusEvents {
    /* true if we are touching the ground */
    on_ground: boolean;
}

export class LandingStatusPublisher extends SimVarPublisher<LandingStatusEvents> {
    private static simvars = new Map<keyof LandingStatusEvents, SimVarDefinition>([
        ['on_ground', { name: 'SIM ON GROUND', type: SimVarValueType.Bool }],
    ]);

    public constructor(bus: EventBus, pacer: PublishPacer<LandingStatusEvents> | undefined = undefined) {
        super(LandingStatusPublisher.simvars, bus, pacer);
    }
}
