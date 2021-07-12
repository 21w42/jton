import fs from 'fs'
import ErrnoException = NodeJS.ErrnoException
import FastGlob from 'fast-glob'
import colors from 'colors'
import path from 'path'

export class Copy {
    /**
     * Search example files, copy and rename.
     *     `config.example.ts` > `config.ts`
     *     `config.local.template.ts` > `config.local.ts`
     * @param _source Path regexp or array of path regexps to files.
     * Examples:
     *     './*',
     *     [
     *         './*',
     *         './configs/*',
     *         './configs/config.example.ts'
     *     ]
     * @see https://github.com/mrmlnc/fast-glob
     * @param _keyWords Key world that must be removed from file copy name.
     * Examples:
     * [
     *     'example',
     *     'template',
     *     'sample',
     *     'tmp'
     * ]
     */
    constructor(readonly _source: string[] | string, readonly _keyWords: string[] | string = 'example') {
    }

    /**
     * Run command.
     */
    run(): void {
        const source: string[] = Array.isArray(this._source) ? [...this._source] : [this._source]
        const keyWords: string[] = Array.isArray(this._keyWords) ? [...new Set(this._keyWords)] : [this._keyWords]
        const files: string[] = FastGlob.sync(source)
        for (let i: number = 0; i < files.length; i++) {
            const file: string = files[i]
            for (let j: number = 0; j < keyWords.length; j++) {
                const search: string = `.${keyWords[j]}.`
                if (file.includes(search)) {
                    const newFile: string = file.replace(search, '.')
                    fs.copyFile(file, newFile, (error: ErrnoException | null) => {
                        if (error)
                            throw error
                        else {
                            const fileBaseName: string = path.basename(file)
                            const newFileBaseName: string = path.basename(newFile)
                            console.log(
                                `${colors.green(fileBaseName)} > ${colors.green(newFileBaseName)}`
                            )
                        }
                    })
                }
            }
        }
    }
}