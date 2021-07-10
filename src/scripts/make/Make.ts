import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {MakeConfigInterface} from './interfaces/MakeConfigInterface'
import path from 'path'
import {runCommand} from 'tondev'
import {errorConsoleTerminal} from './terminal/errorConsoleTerminal'
import colors from 'colors'
import {ExtensionType} from './types/ExtensionType'
import {ExportType} from './types/ExportType'
import {StringMap} from '../../types'

export class Make {
    private static readonly CONFIG = {
        EXTENSION: 'ts' as ExtensionType,
        EXPORT: 'es6-default' as ExportType
    }

    private static readonly COMMAND: StringMap = {
        SOL_SET: 'sol set',
        SOL_COMPILE: 'sol compile',
        JS_WRAP: 'js wrap'
    }

    private static readonly EXTENSION: StringMap = {
        SOL: 'sol',
        ABI_JSON: 'abi.json',
    }

    private readonly _config: MakeConfigInterface
    private readonly _extension: ExtensionType
    private readonly _export: ExportType

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
    constructor(config: MakeConfigInterface) {
        this._config = config
        this._extension = config.extension ?? Make.CONFIG.EXTENSION
        this._export = config.export ?? Make.CONFIG.EXPORT
        TonClient.useBinaryLibrary(libNode)
    }

    /**
     * Run command.
     */
    public async run(): Promise<void> {
        await runCommand(errorConsoleTerminal, Make.COMMAND.SOL_SET, {
            compiler: this._config.compiler,
            linker: this._config.linker,
            stdlib: this._config.stdlib
        })

        const compile: string[] = this._config.compile ?? []
        for (let i = 0; i < compile.length; i++) {
            const file = compile[i]
            await this._compile(file)
            await this._wrap(file)
            console.log(colors.green(file))
        }

        const wrap: string[] = this._config.wrap ?? []
        for (let i = 0; i < wrap.length; i++) {
            const file = wrap[i]
            await this._wrap(file)
            console.log(colors.green(file))
        }
    }

    /**
     * Compile *.sol file.
     * @param file Relative path without '.sol'.
     * Example:
     *     '/home/user/Project/nifi/contracts/Root'
     */
    private async _compile(file: string): Promise<void> {
        await runCommand(errorConsoleTerminal, Make.COMMAND.SOL_COMPILE, {
            file: path.resolve(this._config.root, `${file}.${Make.EXTENSION.SOL}`),
            outputDir: path.resolve(this._config.root, path.parse(file).dir)
        })
    }

    /**
     * Wrap *.abi.json file.
     * @param file Relative path without '.abi.json'.
     * Example:
     *     '/home/user/Project/nifi/contracts/Root'
     */
    private async _wrap(file: string): Promise<void> {
        await runCommand(errorConsoleTerminal, Make.COMMAND.JS_WRAP, {
            file: path.resolve(this._config.root, `${file}.${Make.EXTENSION.ABI_JSON}`),
            export: this._export,
            output: `${path.basename(file)}.${this._extension}`
        })
    }
}