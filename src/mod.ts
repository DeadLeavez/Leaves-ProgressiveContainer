import type { DependencyContainer } from "tsyringe";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { DatabaseServer } from "@spt/servers/DatabaseServer";
import type { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { JsonUtil } from "@spt/utils/JsonUtil";

import type { VFS } from "@spt/utils/VFS";
import { jsonc } from "jsonc";
import * as path from "node:path";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { HashUtil } from "@spt/utils/HashUtil";

class ProgressiveContainer implements IPostDBLoadMod
{
    private logger: ILogger;
    private db: DatabaseServer;

    private craftprefx = "LeavesCraft_ProgressiveContainer"

    private containers = [];
    private crafts;

    //Config
    private config: any;
    private vfs: VFS;

    private createCraft( container: string ): any
    {
        if ( this.config.secure_containers[ container ] )
        {
            const area = this.getAreaID( container );
            this.printColor( `[ProgressiveContainer] \tAdding craft for: ${ container }`, LogTextColor.CYAN );
            const craftToAdd =
            {
                _id: this.idGet( this.craftprefx + container ),
                areaType: area,
                requirements: this.config.secure_containers[ container ].requirements,
                productionTime: this.config.craftingTime,
                needFuelForAllProductionTime: false,
                locked: false,
                endProduct: this.containers[ container ],
                continuous: false,
                count: 1,
                productionLimitCount: 0,
                isEncoded: false
            }

            return craftToAdd;
        }
        return null;
    }
    getAreaID( containerID: string ): number
    {
        const container = this.config.secure_containers[ containerID ];

        //Find the area ID for the container from the list of requirements.
        for ( const requirement of container.requirements )
        {
            if ( requirement.areaType )
            {
                return requirement.areaType;
            }
        }

        this.printColor( `[ProgressiveContainer] ERROR: Could not find areaType for: ${containerID}`, LogTextColor.RED );
        return 10;
    }

    public postDBLoad( container: DependencyContainer ): void 
    {
        // Get stuff from container
        this.db = container.resolve<DatabaseServer>( "DatabaseServer" );
        this.logger = container.resolve<ILogger>( "WinstonLogger" );
        this.jsonUtil = container.resolve<JsonUtil>( "JsonUtil" );
        this.hashUtil = container.resolve<HashUtil>( "HashUtil" );
        const preSptModLoader = container.resolve<PreSptModLoader>( "PreSptModLoader" );

        this.vfs = container.resolve<VFS>( "VFS" );
        const configFile = path.resolve( __dirname, "../config/config.jsonc" );
        this.setModFolder( `${ preSptModLoader.getModPath( "leaves-progressive_container" ) }/` );
        this.config = jsonc.parse( this.vfs.readFile( configFile ) );

        this.idLoad( "config/ids.jsonc" );

        //Crafts List
        this.crafts = this.db.getTables().hideout.production;

        //IDs for containers
        this.containers[ "pouch" ] = "5732ee6a24597719ae0c0281";
        this.containers[ "alpha" ] = "544a11ac4bdc2d470e8b456a";
        this.containers[ "beta" ] = "5857a8b324597729ab0a0e7d";
        this.containers[ "epsilon" ] = "59db794186f77448bc595262";
        this.containers[ "gamma" ] = "5857a8bc2459772bad15db29";
        this.containers[ "kappa" ] = "5c093ca986f7740a1867ab12";
        this.containers[ "theta" ] = "664a55d84a90fc2c8a6305c9";
        this.containers[ "unheard" ] = "5c093ca986f7740a1867ab12";
        //this.containers[ "tuegamma"] = "665ee77ccf2d642e98220bca";

        this.printColor( "[ProgressiveContainer] ProgressiveContainer Starting:" );

        for ( const container in this.containers )
        {
            const craft = this.createCraft( container );
            this.crafts.recipes.push( craft );
        }


        if ( this.config.removeContainersFromPeacekeeper )
        {
            this.removeContainerFromPK();
        }

        this.idSave();
    }

    private removeContainerFromPK(): void
    {
        const PKID = "5935c25fb3acc3127c3d8cd9";
        const assort = this.db.getTables().traders[ PKID ].assort.items
        const toDelete = [];

        for ( let entry = 0; entry < assort.length; entry++ )
        {
            if ( assort[ entry ]._tpl === "544a11ac4bdc2d470e8b456a" || assort[ entry ]._tpl === "5857a8b324597729ab0a0e7d" ) 
            {
                toDelete.push( entry );
            }
        }

        this.logger.info( "Size before:" + assort.length )
        let deleteCount = 0;
        for ( const target of toDelete )
        {
            assort.splice( target - deleteCount, 1 );
            deleteCount++;
        }
        this.logger.info( "Size after:" + assort.length )
    }

    private printColor( message: string, color: LogTextColor = LogTextColor.GREEN )
    {
        this.logger.logWithColor( message, color );
    }

    public loadFile( file: string ): any
    {
        return jsonc.parse( this.vfs.readFile( this.modFolder + file ) );
    }
    private jsonUtil: JsonUtil;
    private hashUtil: HashUtil;
    public saveFile( data: any, file: string, serialize: boolean = true )
    {
        let dataCopy = structuredClone( data );

        if ( serialize )
        {
            dataCopy = this.jsonUtil.serialize( data, true );
        }

        this.vfs.writeFile( `${ this.modFolder }${ file }`, dataCopy );
    }
    private modFolder: string;
    public setModFolder( folder: string )
    {
        this.modFolder = folder;
    }
    public idLoad( filename: string )
    {
        this.filepath = filename;
        this.IDTranslator = this.loadFile( filename );
    }
    public idSave( ) 
    {
        this.saveFile( this.IDTranslator, this.filepath );
    }
    public idGet( name: string ): string
    {
        if ( !this.IDTranslator[ name ] )
        {
            this.IDTranslator[ name ] = this.hashUtil.generate();
        }

        return this.IDTranslator[ name ];
    }
    private IDTranslator: any;
    private filepath: string;
}

module.exports = { mod: new ProgressiveContainer() }