/// <reference types="msfstypes/JS/common" />
/// <reference types="msfstypes/JS/simvar" />
/// <reference types="msfstypes/JS/simplane" />

import { FSComponent } from "msfssdk";
import { EventBus } from "msfssdk/data";
import { ApproachPublisher } from "./ApproachEvents";
import { LandingStatus } from "./LandingStatus";
import { LandingStatusPublisher } from "./LandingStatusEvents";
import "./LandingMonitor.css";
import { TouchdownPublisher } from "./TouchdownEvents";

// Wait for simvar initialization to complete
function simvarIsReady() : boolean {
    try {
        return SimVar.IsReady()
    } catch (err) {
        if (err instanceof ReferenceError && err.message === "Can't find variable: simvar") {
            return false;
        }
        throw err;
    }
}

class LandingMonitor extends TemplateElement {

    private readonly bus: EventBus;
    private readonly landingStatusPublisher: LandingStatusPublisher;
    private readonly approachPublisher: ApproachPublisher;
    private readonly touchdownPublisher: TouchdownPublisher;

    private readonly mainloopFunc: () => void;
    private isRunning: boolean;
    private isFirstUpdate: boolean;

    constructor() {
        super();
        this.bus = new EventBus();
        this.landingStatusPublisher = new LandingStatusPublisher(this.bus);
        this.approachPublisher = new ApproachPublisher(this.bus);
        this.touchdownPublisher = new TouchdownPublisher(this.bus);

        this.isRunning = false;
        this.isFirstUpdate = false;
        this.mainloopFunc = this.mainloop.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        console.log("connected");
        this.isRunning = true;
        this.isFirstUpdate = true;
        this.init();
        this.startMainloop();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.isRunning = false;
        console.log("disconnected");
    }

    startMainloop() {
        console.log("start mainloop");
        requestAnimationFrame(this.mainloopFunc);
    }

    mainloop() {
        if (!this.isRunning) {
            console.log("exit mainloop");
            return;
        }
        try {
            if (simvarIsReady()) {
                if(this.isFirstUpdate) {
	                FSComponent.render(<LandingStatus bus={this.bus} />, document.getElementById("LandingContent"));
	                this.isFirstUpdate = false;
                }
                this.update();
            }
        } catch (err) {
            console.error(err);
        }
        requestAnimationFrame(this.mainloopFunc);
    }

    // Called when we are connected
    init() {
        this.landingStatusPublisher.startPublish();
        this.approachPublisher.startPublish();
        this.touchdownPublisher.startPublish();
    }

    // Called each frame
    update() {
        this.landingStatusPublisher.onUpdate();
        this.approachPublisher.onUpdate();
        this.touchdownPublisher.onUpdate();
    }

}

window.customElements.define('hallidave-landing-panel', LandingMonitor);
checkAutoload();
