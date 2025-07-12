import { EventBus, PublishPacer, SimVarDefinition, SimVarValueType, SimVarPublisher } from "@microsoft/msfs-sdk";

export interface LandingStatusEvents {
    /* true if we are touching the ground */
    on_ground: boolean;
    /* G force */
    gforce: number;
}

export class LandingStatusPublisher extends SimVarPublisher<LandingStatusEvents> {
    private static simvars = new Map<keyof LandingStatusEvents, SimVarDefinition>([
        ['on_ground', { name: 'SIM ON GROUND', type: SimVarValueType.Bool }],
        ['gforce', { name: 'G FORCE', type: SimVarValueType.Number }],
    ]);

    public constructor(bus: EventBus, pacer: PublishPacer<LandingStatusEvents> | undefined = undefined) {
        super(LandingStatusPublisher.simvars, bus, pacer);
    }
}
