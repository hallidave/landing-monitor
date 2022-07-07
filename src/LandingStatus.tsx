import { ComponentProps, DisplayComponent, FSComponent, Subject, VNode } from "msfssdk";
import { EventBus } from "msfssdk/data";
import { ApproachDisplay } from "./ApproachDisplay";
import "./LandingStatus.css";
import { LandingStatusEvents } from "./LandingStatusEvents";
import { TouchdownDisplay } from "./TouchdownDisplay";
import { Translate } from './Translate';

enum State {
    Unknown,
    Touched,
    Bouncing,
    Landed,
    Flying,
}

type StatusText = "FLYING" | "LANDING" | "ON_GROUND";

class LandingController {

    // time on ground to longer be a bounce
    private readonly bounceTime = 3 * 1000;
    private readonly flyingTime = 10 * 1000;

    private state = State.Unknown;
    private bounceCount = 0;
    private onGround: boolean = true;
    private timer: any;
    private isTimerExpired = true;
    private statusText: Subject<StatusText>;
    private bounces: Subject<number>;

    constructor(statusText: Subject<StatusText>, bounces: Subject<number>) {
        this.statusText = statusText;
        this.bounces = bounces;
    }

    setTimer(time: number): void {
        clearTimeout(this.timer);
        this.isTimerExpired = false;
        this.timer = setTimeout(() => { this.eventTimerExpiry(); }, time);
    }

    public eventOnGround(onGroundEvent: boolean): void {
        this.onGround = onGroundEvent;
        this.updateState();
    }

    public eventTimerExpiry(): void {
        this.isTimerExpired = true;
        this.updateState();
    }

    public updateState() {
        switch (this.state) {
            case State.Unknown:
                this.state = this.onGround ? State.Landed : State.Flying;
                break;
            case State.Touched:
                if (this.onGround) {
                    if (this.isTimerExpired) {
                        this.state = State.Landed;
                    }
                } else {
                    this.state = State.Bouncing;
                    this.bounceCount += 1;
                    this.setTimer(this.flyingTime);
                }
                break;
            case State.Bouncing:
                if (this.onGround) {
                    this.state = State.Touched;
                    this.setTimer(this.bounceTime);
                } else {
                    if (this.isTimerExpired) {
                        this.state = State.Flying;
                    }
                }
                break;
            case State.Landed:
                if (!this.onGround) {
                    this.state = State.Flying;
                }
                break;
            case State.Flying:
                if (this.onGround) {
                    this.state = State.Touched;
                    this.setTimer(this.bounceTime);
                    this.bounceCount = 0;
                }
                break;
            default:
                console.error("Invalid state: " + this.state);
        }
        this.updateStatusText();
        this.updateBounces();
    }

    private updateStatusText() {
        switch (this.state) {
            case State.Flying:
                this.statusText.set("FLYING");
                break;
            case State.Touched:
            case State.Bouncing:
                this.statusText.set("LANDING");
                break;
            case State.Unknown:
            case State.Landed:
                this.statusText.set("ON_GROUND");
                break;
            default:
                console.error("Invalid state: " + this.state);
        }
    }

    private updateBounces() {
        this.bounces.set(this.bounceCount);
    }
}

interface LandingProps extends ComponentProps {
    bus: EventBus;
}

export class LandingStatus extends DisplayComponent<LandingProps> {

    private statusText = Subject.create<StatusText>("ON_GROUND");
    private bounces = Subject.create<number>(0);

    private readonly controller = new LandingController(this.statusText, this.bounces);
    private readonly statusRef = FSComponent.createRef<HTMLElement>();
    private readonly approachRef = FSComponent.createRef<HTMLElement>();
    private readonly touchdownRef = FSComponent.createRef<HTMLElement>();

    constructor(props: LandingProps) {
        super(props);

        const tdEvents = props.bus.getSubscriber<LandingStatusEvents>();
        tdEvents.on("on_ground").whenChanged().handle((onGround) => {
            this.controller.eventOnGround(onGround);
        });
    }

    public render(): VNode {
        return (
            <div id="LandingStatus">
                <div ref={this.statusRef} id="Status">
                    {Translate.text(this.statusText.get())}
                </div>
                <div ref={this.approachRef} style="display: none;">
                    <ApproachDisplay bus={this.props.bus} />
                </div>
                <div ref={this.touchdownRef} style="display: block;">
                    <TouchdownDisplay bus={this.props.bus} bounces={this.bounces} />
                </div>
            </div>
        );
    }

    public onAfterRender(node: VNode): void {
        super.onAfterRender(node);
        this.statusText.sub(statusText => {
            if (statusText === "FLYING") {
                this.approachRef.instance.style.display = "block";
                this.touchdownRef.instance.style.display = "none";
            } else {
                this.approachRef.instance.style.display = "none";
                this.touchdownRef.instance.style.display = "block";
            }

            this.statusRef.instance.innerText = Translate.text(statusText);
            if (statusText === "LANDING") {
                this.statusRef.instance.style.animation = "landing 1s";
            } else if (statusText === "FLYING") {
                this.statusRef.instance.style.animation = "flying 1s";
            } else {
                this.statusRef.instance.style.animation = "on-ground 1s";
            }
        });
    }
}
