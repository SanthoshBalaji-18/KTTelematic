import express from 'express';
import port from './server.js';
import {initializeTables} from './db.js'
import {getEmployers,
     addEmployers ,
      updateEmployers,
      getActiveEmployers,
      getInActiveEmployers,updateActiveStatus,addAssettoEmployer} from './routes/employers.js';
import { getAssetDetails,
    getAllAssetDetails,
    activeAssetTypeCount,
    addAssetDetails,
    updateAssetActiveStatus,
    updateAssetDetails,
    getAssetTypeDetails,getAssetHistoryDetails,returnAssetDetails } from './routes/asset.js';

const app=express();
app.use(express.json());

initializeTables(); 

//Employee Master
app.get('/getEmployers', getEmployers);
app.get('/getActiveEmployers', getActiveEmployers);
app.get('/getInactiveEmployers', getInActiveEmployers);
app.post('/addEmployers', addEmployers);
app.put('/updateEmployers', updateEmployers);
app.put('/updateActiveStatus',updateActiveStatus);

//Asset Master
app.get('/getAssetDetails', getAssetDetails);
app.post('/addAssetDetails', addAssetDetails);
app.put('/updateAssetDetails', updateAssetDetails);
app.put('/updateAssetActiveStatus',updateAssetActiveStatus);

//Asset Category Master
app.get('/getAssetTypeDetails', getAssetTypeDetails);

//StockView(This Will display only the Active Asset Count)
app.get('/activeAssetTypeCount',activeAssetTypeCount);

//Issue Asset
app.post('/addAssettoEmployer', addAssettoEmployer);

//Return Asset (This will also set the asset into obsolete)
app.post('/returnAssetDetails',returnAssetDetails);

//ScrapAsset
app.get('/getAllAssetDetails',getAllAssetDetails)

//Asset History
app.get('/getAssetHistoryDetails',getAssetHistoryDetails);

app.listen(port, () => {
    console.log(`Port Connected to ${port}`);
});