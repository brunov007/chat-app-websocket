import { fileURLToPath } from 'url';
import WebSocketRuning from './ws.js';
import express from 'express';
import path from 'path';
import {config} from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = { root: path.join(__dirname, 'public') };
const indexPath = '/index.html';

class MainService{
    constructor(){
        config()
        
        const PORT = process.env.PORT || 3000;
        
        const app = express()
            .use(express.static(options.root))
            .use(this.main)
            .listen(PORT, () => console.log(`Server listening in PORT ${PORT}`));
        
        
        WebSocketRuning(app);
    }

    main(req, res, next) {
        try {
            res.sendFile(indexPath, options);
        } catch (err) {
            next(err);
        }
    }
}

export default new MainService()