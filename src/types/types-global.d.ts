// Correction pour TypeScript frontend : expose les objets globaux DOM et méthodes natives
// Ceci force la reconnaissance des types natifs dans les fichiers .ts

interface Window {
  selectedAnnouncement?: { id: string };
}

declare const window: Window;
declare const HashChangeEvent: {
  new(type: string): Event;
};
declare function decodeURIComponent(encodedURI: string): string;

type NativeArray<T> = T[];
