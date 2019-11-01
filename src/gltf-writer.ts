import { GltfWriter } from 'forge-convert-utils';
import { ISvfContent } from 'forge-convert-utils/lib/svf/reader';
import * as fse from 'fs-extra';

import { serialize } from './sqlite';

export class SqliteGltfWriter extends GltfWriter {
    protected async postprocess(svf: ISvfContent, gltfPath: string) {
        if (svf.properties) {
            // Serialize manifest into a sqlite database as well
            if (this.options.compress || this.options.binary) {
                this.options.log(`Serializing manifest with embedded texture/buffer data into sqlite is not supported.`);
            } else {
                this.options.log(`Serializing manifest into sqlite...`);
                const sqlitePath = gltfPath + '.sqlite';
                if (fse.existsSync(sqlitePath)) {
                    fse.unlinkSync(sqlitePath);
                }
                await serialize(this.manifest, sqlitePath, svf.properties);
                this.options.log(`Serializing manifest into sqlite: done`);
            }
        }
        await super.postprocess(svf, gltfPath);
    }
}
