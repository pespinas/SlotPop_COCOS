
import {EventTarget,input, Input, EventTouch } from 'cc';
import { NameEvent } from './NameEvent';
export type EventCallback<T = unknown> = (data?: T) => void;

const bus = new EventTarget();

export class EventManager {

    private static isInitialized = false;
    public static initGlobalInputs() {
        if (this.isInitialized) return;
        input.on(Input.EventType.TOUCH_START, (event: EventTouch) => {
            this.emit(NameEvent.TOUCH_START, event);
        });
        this.isInitialized = true;
    }

    static emit<T = unknown>(nameEvent: NameEvent, data?: T) {
        bus.emit(nameEvent, data);
    }

    static on<T = unknown>(nameEvent: NameEvent, callback: EventCallback<T>, target?: any) {
        bus.on(nameEvent, callback, target);
    }

    static off<T = unknown>(nameEvent: NameEvent, callback: EventCallback<T>, target?: any) {
        bus.off(nameEvent, callback, target);
    }
}