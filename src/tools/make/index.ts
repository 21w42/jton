import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import path from 'path'
import {runCommand} from 'everdev'
import colors from 'colors'
import {StringMap} from '../../types'
import {Printer} from '../../printer'
import {Terminal} from 'everdev/dist/core'

export interface MakeConfig {
    root: string,
    compile?: string[]
    wrap?: string[]
    compiler?: string
    linker?: string
    extension?: Extension
    export?: Export
    suffix?: string
}

export type Extension =
    'ts' |  // TypeScript
    'tsx' | // TypeScript XML
    'js' |  // JavaScript
    'jsx'   // JavaScript XML

export type Export =
    'commonjs' |
    'commonjs-default' | // CommonJS modules (NodeJS) with default export
    'es6' |              // ES6 modules
    'es6-default'        // ES6 modules with default export

const errorConsoleTerminal: Terminal = new class implements Terminal {
    log(..._0: any[]): void {
    }

    write(_0: string): void {
    }

    writeError(text: string): void {
        process.stderr.write(text)
    }
}

const EXTENSION: Extension = 'ts'
const EXPORT: Export = 'es6-default'
const SUFFIX: string = 'Contract'
const COMMAND: StringMap = {
    SOL_SET: 'sol set',
    SOL_COMPILE: 'sol compile',
    JS_WRAP: 'js wrap'
}
const FILE: StringMap = {
    SOL: 'sol',
    ABI_JSON: 'abi.json',
}

/**
 * @param config Config contains relative paths without `.sol` and `.tvc` extension.
 * You can get compiler and linker versions from `everdev sol version`
 * Example:
 *     {
 *         root: '/home/user/project/',
 *         compile: [
 *             'contracts/tokens/random/RandomToken',
 *             'contracts/tokens/random/RandomRoot
 *         ],
 *         wrap: [
 *             'tests/contracts/SafeMultisigWallet'
 *         ],
 *         compiler: '0.45.0',
 *         linker: '0.7.31',
 *         extension: 'ts',
 *         export: 'es6-default',
 *         suffix: 'Contract'
 *     }
 */
export async function make(config: MakeConfig): Promise<void> {
    const printer: Printer = new Printer()
    const extension: Extension = config.extension ?? EXTENSION
    const exp: Export = config.export ?? EXPORT
    const suffix: string = config.suffix ?? SUFFIX
    TonClient.useBinaryLibrary(libNode)

    await runCommand(errorConsoleTerminal, COMMAND.SOL_SET, {
        compiler: config.compiler,
        linker: config.linker
    })

    const compileFiles: string[] = config.compile ?? []
    for (let i = 0; i < compileFiles.length; i++) {
        const file = compileFiles[i]
        await compile(config.root, file)
        await wrap(config.root, exp, file, suffix, extension)
        printer.print(colors.green(file))
    }

    const wrapFiles: string[] = config.wrap ?? []
    for (let i = 0; i < wrapFiles.length; i++) {
        const file = wrapFiles[i]
        await wrap(config.root, exp, file, suffix, extension)
        printer.print(colors.green(file))
    }
}


/**
 * Compile *.sol file.
 * @param root Absolute root path.
 * Example:
 *     '/home/user/project/'
 * @param file Relative path without '.sol'.
 * Example:
 *     '/home/user/Project/nifi/contracts/Root'
 */
async function compile(root: string, file: string): Promise<void> {
    await runCommand(errorConsoleTerminal, COMMAND.SOL_COMPILE, {
        file: path.resolve(root, `${file}.${FILE.SOL}`),
        outputDir: path.resolve(root, path.parse(file).dir)
    })
}

/**
 * Wrap *.abi.json file.
 * @param root Absolute root path.
 * Example:
 *     '/home/user/project/'
 * @param exp 'commonjs', 'es6' ...
 * @param file Relative path without '.abi.json'.
 * Example:
 *     '/home/user/Project/nifi/contracts/Root'
 * @param suffix Suffix to file name.
 * If contract name is 'Root'
 * and suffix is 'Contract'
 * then result file name is 'RootContract'
 * @param extension 'ts', 'js' ...
 */
async function wrap(root: string, exp: Export, file: string, suffix: string, extension: Extension, ): Promise<void> {
    await runCommand(errorConsoleTerminal, COMMAND.JS_WRAP, {
        file: path.resolve(root, `${file}.${FILE.ABI_JSON}`),
        export: exp,
        output: `${path.basename(file)}${suffix}.${extension}`
    })
}
