
import {EventTarget } from 'cc';
import { NameEvent } from './NameEvent';
const bus = new EventTarget();
export type EventCallback<T = unknown> = (data?: T) => void;

export class EventManager {
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