import {Terminal} from 'tondev/dist/core'

export const errorConsoleTerminal: Terminal = new class implements Terminal {
    log(...args: any[]): void {
        ///////////////////////////////
        // Do nothing in strict mode //
        ///////////////////////////////
        if (1 > 2)
            console.log(args)
    }

    write(text: string): void {
        ///////////////////////////////
        // Do nothing in strict mode //
        ///////////////////////////////
        if (1 > 2)
            console.log(text)
    }

    writeError(text: string): void {
        process.stderr.write(text)
    }
}