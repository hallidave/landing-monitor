import { ComponentProps, DisplayComponent, FSComponent, Subject, Subscribable, VNode } from 'msfssdk';
import { EventBus } from 'msfssdk/data';
import { ApproachEvents } from './ApproachEvents';
import "./TouchdownDisplay.css";
import { TouchdownEvents } from './TouchdownEvents';
import { Translate } from './Translate';

interface TouchdownProps extends ComponentProps {
    bus: EventBus;
    bounces: Subscribable<number>;
}

export class TouchdownDisplay extends DisplayComponent<TouchdownProps> {

    private verticalSpeed = Subject.create<number>(0);
    private pitchAngle = Subject.create<number>(0);
    private bankAngle = Subject.create<number>(0);
    private bankAngleAbs = Subject.create<number>(0);
    private windDirection = Subject.create<number>(0);
    private windSpeed = Subject.create<number>(0);

    // Approach wind before touchdown
    private appWindDirection = 0;
    private appWindSpeed = 0;

    private readonly bankRef = FSComponent.createRef<SVGElement>();
    private readonly arrowRef = FSComponent.createRef<SVGElement>();

    constructor(props: TouchdownProps) {
        super(props);

        const appEvents = props.bus.getSubscriber<ApproachEvents>();

        appEvents.on("wind_direction").withPrecision(0).handle(windDirection => {
            this.appWindDirection = windDirection;
        });
        appEvents.on("wind_speed").withPrecision(0).handle(windSpeed => {
            this.appWindSpeed = windSpeed;
        });

        const tdEvents = props.bus.getSubscriber<TouchdownEvents>();
        tdEvents.on("touchdown_vertical_speed").withPrecision(0).handle(verticalSpeed => {
            this.verticalSpeed.set(verticalSpeed);
            // Record approach wind speed before touchdown
            this.windDirection.set(this.appWindDirection);
            this.windSpeed.set(this.appWindSpeed);
        });
        tdEvents.on("touchdown_pitch_angle").withPrecision(0).handle(pitchAngle => {
            this.pitchAngle.set(-pitchAngle);
        });
        tdEvents.on("touchdown_roll_angle").withPrecision(0).handle(rollAngle => {
            this.bankAngle.set(rollAngle);
            const absAngle = Math.abs(rollAngle);
            this.bankAngleAbs.set(absAngle);
        });
    }

    public render(): VNode {
        return (
            <div id="TouchdownDisplay">
                <table>
                    <tr>
                        <td class="name">{Translate.text("VERTICAL_SPEED")}</td>
                        <td class="value">{this.verticalSpeed}</td>
                        <td class="units">&nbsp;{Translate.text("FPM")}</td>
                    </tr>
                    <tr>
                        <td class="name">{Translate.text("PITCH_ANGLE")}</td>
                        <td class="value">{this.pitchAngle}</td>
                        <td class="units">°</td>
                    </tr>
                    <tr>
                        <td class="name">{Translate.text("BANK_ANGLE")}</td>
                        <td class="value">
                            <svg viewBox="0 0 24 24" class="icon">
                                <g ref={this.bankRef} stroke-width="0">
                                    <rect x="3" y="10.5" width="18" height="3" />
                                    <rect x="10.5" y="5.624" width="3" height="5" />
                                </g>
                            </svg>{this.bankAngleAbs}
                        </td>
                        <td class="units">°</td>
                    </tr>
                    <tr>
                        <td class="name">{Translate.text("BOUNCES")}</td>
                        <td class="value">{this.props.bounces}</td>
                        <td class="units"></td>
                    </tr>
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
        this.bankAngle.sub(bankAngle => {
            let rotate = 0;
            if (bankAngle > 0.5) {
                rotate = -15;
            } else if (bankAngle < -0.5) {
                rotate = 15;
            }
            this.bankRef.instance.setAttribute("transform", "rotate(" + String(rotate) + ", 12, 12)");
        });
        this.windDirection.sub(windDirection => {
            this.arrowRef.instance.setAttribute("transform", "rotate(" + String(windDirection) + ", 12, 12)");
        });
    }
}
