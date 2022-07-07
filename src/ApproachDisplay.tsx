import { ComponentProps, DisplayComponent, FSComponent, Subject, VNode } from "msfssdk";
import { EventBus } from "msfssdk/data";
import "./ApproachDisplay.css";
import { ApproachEvents } from "./ApproachEvents";
import { Translate } from './Translate';

interface ApproachProps extends ComponentProps {
    bus: EventBus;
}

export class ApproachDisplay extends DisplayComponent<ApproachProps> {

    private heightAgl = Subject.create<number>(0);
    private groundSpeed = Subject.create<number>(0);
    private flightPathAngle = Subject.create<number>(0);
    private windDirection = Subject.create<number>(0);
    private windSpeed = Subject.create<number>(0);

    private readonly arrowRef = FSComponent.createRef<SVGElement>();

    constructor(props: ApproachProps) {
        super(props);

        const appEvents = props.bus.getSubscriber<ApproachEvents>();

        appEvents.on("height_agl").withPrecision(0).handle((heightAgl) => {
            this.heightAgl.set(heightAgl);
        });
        appEvents.on("ground_speed").withPrecision(0).handle((groundSpeed) => {
            this.groundSpeed.set(groundSpeed);
        });
        appEvents.on("flight_path_angle").withPrecision(0).handle((flightPathAngle) => {
            this.flightPathAngle.set(flightPathAngle);
        });
        appEvents.on("wind_direction").withPrecision(0).handle((windDirection) => {
            this.windDirection.set(windDirection);
        });
        appEvents.on("wind_speed").withPrecision(0).handle((windSpeed) => {
            this.windSpeed.set(windSpeed);
        });
    }

    public render(): VNode {
        return (
            <div id="ApproachDisplay">
                <table>
                    <tr>
                        <td class="name">{Translate.text("HEIGHT_AGL")}</td>
                        <td class="value">{this.heightAgl}</td>
                        <td class="units">&nbsp;{Translate.text("UNIT_FEET")}</td>
                    </tr>
                    <tr>
                        <td class="name">{Translate.text("GROUND_SPEED")}</td>
                        <td class="value">{this.groundSpeed}</td>
                        <td class="units">&nbsp;{Translate.text("UNIT_KNOTS")}</td>
                    </tr>
                    <tr>
                        <td class="name">{Translate.text("FPA")}</td>
                        <td class="value">{this.flightPathAngle}</td>
                        <td class="units">°</td></tr>
                    <tr>
                        <td class="name">{Translate.text("WIND")}</td>
                        <td class="value">
                            <svg viewBox="0 0 24 24" class="icon">
                                <path ref={this.arrowRef} d="M12 22.575 4.15 14.7 6.35 12.475 10.425 16.575V1.2H13.575V16.575L17.65 12.5L19.875 14.7Z" />
                            </svg>{this.windSpeed}
                        </td>
                        <td class="units">&nbsp;{Translate.text("UNIT_KNOTS")}</td>
                    </tr>
                </table>
            </div>
        );
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);
        this.windDirection.sub(windDirection => {
            this.arrowRef.instance.setAttribute("transform", "rotate(" + String(windDirection) + ", 12, 12)");
        });
    }
}
