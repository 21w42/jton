import fs from 'fs'
import ErrnoException = NodeJS.ErrnoException
import FastGlob from 'fast-glob'
import colors from 'colors'
import path from 'path'
import {CopyConfig} from './interfaces/CopyConfig'
import {Printer} from '../../printer'

/**
 * Search example files, copy and rename.
 *     `config.example.ts` > `config.ts`
 *     `config.local.template.ts` > `config.local.ts`
 * @config config Config params can contains string or string[]
 * Example:
 *     {
 *         source: [
 *             './*',
 *             './configs/*',
 *             './configs/config.example.ts'
 *         ],
 *         words: [
 *             'example',
 *             'template',
 *             'sample',
 *             'tmp'
 *         ]
 *     }
 * @see https://github.com/mrmlnc/fast-glob
 */
export async function copy(config: CopyConfig): Promise<void> {
    const printer: Printer = new Printer()
    const source: string[] = Array.isArray(config.source) ? [...config.source] : [config.source]
    const words: string[] = Array.isArray(config.words) ? [...new Set(config.words)] : [config.words]
    const files: string[] = FastGlob.sync(source)

    for (let i: number = 0; i < files.length; i++) {
        const file: string = files[i]
        for (let j: number = 0; j < words.length; j++) {
            const search: string = `.${words[j]}.`
            if (!file.includes(search))
                continue

            const newFile: string = file.replace(search, '.')
            fs.copyFile(file, newFile, (error: ErrnoException | null) => {
                if (error)
                    throw error
                else {
                    const fileBaseName: string = path.basename(file)
                    const newFileBaseName: string = path.basename(newFile)
                    printer.print(`${colors.green(fileBaseName)} > ${colors.green(newFileBaseName)}`)
                }
            })
        }
    }
}