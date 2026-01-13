/**
 * Logger centralisé pour l'application Web Spider
 * 
 * Usage:
 * ```typescript
 * import { logger } from '@/utils/logger';
 * 
 * logger.info('Message informatif', { data: 'optionnelle' });
 * logger.warn('Avertissement');
 * logger.error('Erreur critique', error);
 * logger.debug('Debug détaillé', { state: {...} });
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  includeTimestamp: boolean;
  colorize: boolean;
}

class Logger {
  private config: LoggerConfig;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
    this.config = {
      enabled: this.isDevelopment,
      level: this.isDevelopment ? 'debug' : 'error',
      includeTimestamp: true,
      colorize: true
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const timestamp = this.config.includeTimestamp 
      ? `[${new Date().toLocaleTimeString('fr-FR')}]` 
      : '';
    
    const prefix = `${timestamp} [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  /**
   * Log de débogage (seulement en dev)
   */
  debug(message: string, ...args: unknown[]): void {
    this.formatMessage('debug', message, ...args);
  }

  /**
   * Log informatif
   */
  info(message: string, ...args: unknown[]): void {
    this.formatMessage('info', message, ...args);
  }

  /**
   * Avertissement
   */
  warn(message: string, ...args: unknown[]): void {
    this.formatMessage('warn', message, ...args);
  }

  /**
   * Erreur critique
   * En production, peut être envoyée à un service externe (Sentry, LogRocket)
   */
  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    this.formatMessage('error', message, error, ...args);

    // En production, envoyer à Sentry ou autre service de monitoring
    if (!this.isDevelopment && typeof window !== 'undefined') {
      // TODO: Intégrer Sentry
      // Sentry.captureException(error, { extra: { message, args } });
    }
  }

  /**
   * Log de groupe (pour structurer les logs)
   */
  group(label: string, callback: () => void): void {
    if (!this.shouldLog('debug')) return;
    
    console.group(label);
    callback();
    console.groupEnd();
  }

  /**
   * Timer pour mesurer les performances
   */
  time(label: string): void {
    if (!this.shouldLog('debug')) return;
    console.time(label);
  }

  /**
   * Fin du timer
   */
  timeEnd(label: string): void {
    if (!this.shouldLog('debug')) return;
    console.timeEnd(label);
  }

  /**
   * Table (pour afficher des données structurées)
   */
  table(data: unknown): void {
    if (!this.shouldLog('debug')) return;
    console.table(data);
  }
}

// Instance singleton
export const logger = new Logger();

// Export du type pour typage
export type { LogLevel };
