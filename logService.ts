
type LogType = 'info' | 'error' | 'success' | 'warning';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: LogType;
  message: string;
}

class LogService {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  addLog(type: LogType, message: string) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message,
    };
    this.logs = [entry, ...this.logs].slice(0, 100); // Keep last 100 logs
    this.notify();
    console[type === 'error' ? 'error' : 'log'](`[${type.toUpperCase()}] ${message}`);
  }

  getLogs() {
    return this.logs;
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener(this.logs);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.logs));
  }

  clear() {
    this.logs = [];
    this.notify();
  }
}

export const logService = new LogService();
export type { LogEntry, LogType };
