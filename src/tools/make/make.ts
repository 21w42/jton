import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {MakeConfig} from './interfaces/MakeConfig'
import path from 'path'
import {runCommand} from 'tondev'
import {errorConsoleTerminal} from './terminal/errorConsoleTerminal'
import colors from 'colors'
import {Extension} from './types/Extension'
import {Export} from './types/Export'
import {StringMap} from '../../types'
import {Printer} from '../../printer'

const EXTENSION: Extension = 'ts'
const EXPORT: Export = 'es6-default'
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
 * You can get compiler, linker and stdlib versions from `tondev sol version`
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
 *         stdlib: '0.45.0',
 *         extension: 'ts',
 *         export: 'es6-default'
 *     }
 */
export async function make(config: MakeConfig): Promise<void> {
    const printer: Printer = new Printer()
    const extension: Extension = config.extension ?? EXTENSION
    const exp: Export = config.export ?? EXPORT
    TonClient.useBinaryLibrary(libNode)

    await runCommand(errorConsoleTerminal, COMMAND.SOL_SET, {
        compiler: config.compiler,
        linker: config.linker,
        stdlib: config.stdlib
    })

    const files: string[] = config.compile ?? []
    for (let i = 0; i < compile.length; i++) {
        const file = files[i]
        await compile(config.root, file)
        await wrap(config.root, exp, extension, file)
        printer.print(colors.green(file))
    }

    const wrapFiles: string[] = config.wrap ?? []
    for (let i = 0; i < wrap.length; i++) {
        const file = wrapFiles[i]
        await wrap(config.root, exp, extension, file)
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
 * @param exp
 * @param extension
 * @param file Relative path without '.abi.json'.
 * Example:
 *     '/home/user/Project/nifi/contracts/Root'
 */
async function wrap(root: string, exp: Export, extension: Extension, file: string): Promise<void> {
    await runCommand(errorConsoleTerminal, COMMAND.JS_WRAP, {
        file: path.resolve(root, `${file}.${FILE.ABI_JSON}`),
        export: exp,
        output: `${path.basename(file)}.${extension}`
    })
}
