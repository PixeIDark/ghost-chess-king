type Listener<V> = (data: V) => void;

export class EventManager<T extends Record<string, unknown>> {
  private listeners: Map<keyof T, Set<Listener<unknown>>> = new Map();

  public on<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());

    const listenerSet = this.listeners.get(event)!;
    listenerSet.add(listener as Listener<unknown>);
  }

  public off<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    const listenerSet = this.listeners.get(event);
    if (listenerSet) listenerSet.delete(listener as Listener<unknown>);
  }

  public emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) eventListeners.forEach((listener) => listener(data));
  }

  public clear(): void {
    this.listeners.clear();
  }
}
