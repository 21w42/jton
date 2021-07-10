import {Terminal} from 'tondev/dist/core'

export const errorConsoleTerminal: Terminal = new class implements Terminal {
    log(..._0: any[]): void {
    }

    write(_0: string): void {
    }

    writeError(text: string): void {
        process.stderr.write(text)
    }
}