import { EventBus, PublishPacer, SimVarDefinition, SimVarValueType } from "msfssdk/data";
import { SimVarPublisher } from "msfssdk/instruments";

export interface TouchdownEvents {
    /* vertical speed in feet/minute */
    touchdown_vertical_speed: number;
    /* bank angle - left bank is positive */
    touchdown_roll_angle: number;
    /* pitch angle - node down is positive */
    touchdown_pitch_angle: number;
    /* magnetic heading in degrees */
    touchdown_heading: number;
}

export class TouchdownPublisher extends SimVarPublisher<TouchdownEvents> {
    private static simvars = new Map<keyof TouchdownEvents, SimVarDefinition>([
        ["touchdown_vertical_speed", { name: "PLANE TOUCHDOWN NORMAL VELOCITY", type: SimVarValueType.FPM }],
        ["touchdown_roll_angle", { name: "PLANE TOUCHDOWN BANK DEGREES", type: SimVarValueType.Degree }],
        ["touchdown_pitch_angle", { name: "PLANE TOUCHDOWN PITCH DEGREES", type: SimVarValueType.Degree }],
        ["touchdown_heading", { name: "PLANE TOUCHDOWN HEADING DEGREES MAGNETIC", type: SimVarValueType.Degree }],
    ]);

    public constructor(bus: EventBus, pacer: PublishPacer<TouchdownEvents> | undefined = undefined) {
        super(TouchdownPublisher.simvars, bus, pacer);
    }
}
