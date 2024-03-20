import client from "../db.js";

const getAssetDetails = async (req, res) => {
    try {
        const result = await client.query('SELECT distinct assettype FROM ASSETLIST');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
};

const getAllAssetDetails = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM ASSETLIST');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
};

const activeAssetTypeCount = async (req, res) => {
    try {
        const result = await client.query('SELECT assettype, COUNT(*) AS count FROM ASSETLIST WHERE active = true GROUP BY assettype');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
};

const addAssetDetails = async (req, res) => {
    try {
        const { id,assetId,assetType,assetName } = req.body;
        const addAssetData = 'INSERT INTO ASSETLIST(id,assetid,assettype,assetname,active) VALUES($1,$2,$3,$4,$5) RETURNING *';
        const active = true;
        const assetResult = await client.query(addAssetData, [id,assetId,assetType,assetName,active]);
        const addAssetHistoryData = 'INSERT INTO ASSETHISTORYLIST(assetid,assettype,assetname,assethistory,date,active) VALUES($1,$2,$3,$4,CURRENT_TIMESTAMP,$5)';
        const assetHistory = "Available";
        await client.query(addAssetHistoryData, [assetId,assetType,assetName,assetHistory,active]);
        const updatedData = assetResult.rows[0];
        res.status(201).json(updatedData);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};

const updateAssetDetails = async (req, res) => {
    try {
        const { assetId,assetType,assetName } = req.body;
        const updateAssetData = 'UPDATE ASSETLIST SET assettype = $2, assetname = $3 WHERE assetid = $1';
        await client.query(updateAssetData, [assetId, assetType, assetName]);
        const updateAssetHistoryData = 'UPDATE ASSETHISTORYLIST SET assettype = $2, assetname = $3 WHERE assetid = $1';
        await client.query(updateAssetHistoryData, [assetId, assetType, assetName]);
        const selectQuery = 'SELECT * FROM ASSETLIST WHERE assetid = $1';
        const result=await client.query(selectQuery,[assetId])
        const updatedData = result.rows[0];
        res.status(201).json(updatedData);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};

const updateAssetActiveStatus = async (req, res) => {
    try {
        const { assetId,active } = req.body;
        const updateData = 'UPDATE ASSETLIST SET active = $2 WHERE assetid = $1';
        await client.query(updateData, [assetId,active]);
        const selectQuery = 'SELECT * FROM ASSETLIST WHERE assetid = $1';
        const result=await client.query(selectQuery,[assetId])
        const updatedData = result.rows[0];
        res.status(201).json(updatedData);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};

const getAssetTypeDetails = async (req, res) => {
    try {
        const result = await client.query('SELECT DISTINCT assettype FROM ASSETLIST');
        const assetTypes = result.rows.map(row => row.assettype);
        res.status(200).json(assetTypes);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
}; 

const getAssetHistoryDetails = async (req, res) => {
    try {
        const { assetId } = req.body;
        const result = await client.query('SELECT * FROM ASSETHISTORYLIST WHERE assetid = $1', [assetId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
}; 

const returnAssetDetails=async(req,res)=>
{
    try {
    const { assetId,assetType,assetName,reason} = req.body;
    if(reason==='upgrade' || reason==='resignation')
    {
    const addAssetHistoryData = 'INSERT INTO ASSETHISTORYLIST(assetid,assettype,assetname,employeeid,assethistory,date,active) VALUES($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,$6)';
        const assetHistory = "Available";
        const employeeid=null;
        const active=true;
        await client.query(addAssetHistoryData, [assetId,assetType,assetName,employeeid,assetHistory,active]);
        res.status(200).send("Asset Data Added");
    }
    else
    {
        const addAssetHistoryData = 'INSERT INTO ASSETHISTORYLIST(assetid,assettype,assetname,employeeid,assethistory,date,active) VALUES($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,$6)';
        const assetHistory = "Repair";
        const employeeid=null;
        const active=false;
        await client.query(addAssetHistoryData, [assetId,assetType,assetName,employeeid,assetHistory,active]); 
        const updateAssetData = 'UPDATE ASSETLIST SET active = $2 WHERE assetid = $1';
        await client.query(updateAssetData, [assetId,active]);
        res.status(200).send("Asset Data Added");
    }
    }
    catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
}

export{ getAssetDetails,getAllAssetDetails,activeAssetTypeCount,addAssetDetails,updateAssetDetails,updateAssetActiveStatus,getAssetTypeDetails,getAssetHistoryDetails,returnAssetDetails };