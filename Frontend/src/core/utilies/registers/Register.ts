export class Register <T> {    
    private registryMap = new Map<string, T>();

    public set(key: string, obj: T) {
        this.registryMap.set(key, obj);
    }

    public get(key: string) {
        if (!this.registryMap.has(key)) {
            return undefined;
        };

        return this.registryMap.get(key);
    }

    public getMap() {
        return this.registryMap;
    }
}