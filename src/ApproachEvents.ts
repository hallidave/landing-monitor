import { EventBus, PublishPacer, SimVarValueType } from "msfssdk/data";
import { BasePublisher } from "msfssdk/instruments";

export interface ApproachEvents {
    // Vertical speed in feet per minute
    "vertical_speed": number;
    // Height above ground level in feet
    "height_agl": number;
    // Ground speed in knots
    "ground_speed": number;
    // Flight path angle in degrees
    "flight_path_angle": number;
    // Wind direction relative to aircraft in degrees (0-359)
    "wind_direction": number,
    // Wind speed in knots
    "wind_speed": number,
}

export class ApproachPublisher extends BasePublisher<ApproachEvents> {

    public constructor(bus: EventBus, pacer: PublishPacer<ApproachEvents> | undefined = undefined) {
        super(bus, pacer);
    }

    public onUpdate(): void {
        super.onUpdate();

        this.publish("vertical_speed", SimVar.GetSimVarValue("VELOCITY WORLD Y", SimVarValueType.FPM));
        this.publish("height_agl", Simplane.getAltitudeAboveGround());
        const groundSpeed = Simplane.getGroundSpeed();
        this.publish("ground_speed", groundSpeed);
        const fpa = groundSpeed < 10 ? 0 : Simplane.getFlightPathAngleY();
        this.publish("flight_path_angle", fpa);
        const heading = Simplane.getHeadingMagnetic();
        const windDirection = Simplane.getWindDirection();
        this.publish("wind_direction", (windDirection - heading + 360) % 360);
        this.publish("wind_speed", Simplane.getWindStrength());
    }
}
