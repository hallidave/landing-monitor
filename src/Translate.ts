export class Translate {
    static text(text: string): string {
        return Coherent.translate("@hallidave-tool-landing,TT:LANDING." + text);
    }
}
