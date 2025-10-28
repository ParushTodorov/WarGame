import { Application } from "../../Application";
import { GameEvents } from "../utilies/GameEvents";
import { Howl } from "howler";

export class AudioManager {
    private app: Application;
    private isFirstTouch: boolean = false;
    
    private loopAudio: Howl;

    public init() {
        this.app = Application.APP;

        this.app.emitter.on(GameEvents.PLAY_SOUND, this.play, this);
        this.app.emitter.on(GameEvents.PLAY_LOOP, this.playLoop, this);
        this.app.emitter.on(GameEvents.STOP_SOUND, this.stop, this);

        const firstTouch = () => {
            this.isFirstTouch = true;
            document.removeEventListener('pointerdown', firstTouch) 
        }

        document.addEventListener('pointerdown', firstTouch)

        this.app.emitter.on(GameEvents.DOCUMENT_VISIBILITY_CHANGE, this.onVisibilityChange, this);
    }

    public async play(audioName: string, volume: number = 1): Promise<void> {
        try {
            const audio: Howl = await this.app.assetManager.getAudio(audioName);
            audio.volume(volume);

            if (!this.isFirstTouch) return;

            audio.play();
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    public async playLoop(audioName: string, volume: number = 1): Promise<void> {
        try {
            if (this.loopAudio) {
                this.loopAudio.stop();
                this.loopAudio = undefined;
            }

            const audio: Howl = await this.app.assetManager.getAudio(audioName);
            audio.loop(true)
            audio.volume(volume);

            this.loopAudio = audio;

            if (this.isFirstTouch) {
                this.loopAudio.play();
                return;
            }
            
            const playLoop = () => {
                if (!this.isFirstTouch) return;

                this.loopAudio.play();
                this.app.pixiApp.ticker.remove(playLoop, this);
            }

            this.app.pixiApp.ticker.add(playLoop, this);
        } catch (error) {
            console.warn(error);
        }
    }

    public async stop(audioName: string) {
        try {
            const audio: Howl = await this.app.assetManager.getAudio(audioName);
            audio.stop();
        } catch (error) {
            console.warn(error);
        }
    }

    public async toggleAudioVolume(muted: boolean) {
        Howler.mute(muted);
    }

    private onVisibilityChange(visibilityState: "hidden" | "visible") {
        if (visibilityState == "hidden") {
            this.toggleAudioVolume(true);
            return;
        }

        this.toggleAudioVolume(false);
    }
}