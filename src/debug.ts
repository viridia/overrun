import c from 'ansi-colors';

let verbose = false;

export function setVerboseLogging(enabled: boolean) {
  verbose = enabled;
}

export function log(msg: string) {
  if (verbose) {
    console.log(c.blue(msg));
  }
}
