import client from "../db.js";

const getEmployers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM EMPLOYERSLIST');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
};

const getActiveEmployers = async (req, res) => {
    try {
        const active = true;
        const ActiveEmployers = 'SELECT * FROM EMPLOYERSLIST WHERE active = $1';
        const result=await client.query(ActiveEmployers, [active]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
};

const getInActiveEmployers = async (req, res) => {
    try {
        const active = false;
        const inActiveEmployers = 'SELECT * FROM EMPLOYERSLIST WHERE active = $1';
        const result=await client.query(inActiveEmployers, [active]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json("Internal Server Error");
    }
};

const addEmployers = async (req, res) => {
    try {
        const { id,employeeId,firstName,lastName } = req.body;
        console.log(firstName,lastName);
        const addData = 'INSERT INTO EMPLOYERSLIST(id,employeeid,firstname,lastname,active) VALUES($1,$2,$3,$4,$5) RETURNING *';
        const active = true;
        const result=await client.query(addData, [id,employeeId,firstName,lastName,active]);
        const updatedData = result.rows[0];
        res.status(201).json(updatedData);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};

const updateEmployers = async (req, res) => {
    try {
        const { employeeId,firstName, lastName } = req.body;
        console.log(firstName,lastName,employeeId);
        const updateData = 'UPDATE EMPLOYERSLIST SET firstname = $1, lastname = $2 WHERE employeeid = $3';
        await client.query(updateData, [firstName, lastName, employeeId]);
        const selectQuery = 'SELECT * FROM EMPLOYERSLIST WHERE employeeid = $1';
        const result=await client.query(selectQuery,[employeeId])
        const updatedData = result.rows[0];
        res.status(201).json(updatedData);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};

const updateActiveStatus = async (req, res) => {
    try {
        const { employeeId,active } = req.body;
        const updateData = 'UPDATE EMPLOYERSLIST SET active = $2 WHERE employeeid = $1';
        await client.query(updateData, [employeeId,active]);
        const selectQuery = 'SELECT * FROM EMPLOYERSLIST WHERE employeeid = $1';
        const result=await client.query(selectQuery,[employeeId])
        const updatedData = result.rows[0];
        res.status(201).json(updatedData);
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};


const addAssettoEmployer = async (req, res) => {
    try {
        const { employeeId,assetId } = req.body;
        const checkAssetHistory='SELECT * FROM ASSETHISTORYLIST WHERE assetid = $1 ORDER BY date DESC LIMIT 1';
        const checkResult=await client.query(checkAssetHistory, [assetId]);
        if (checkResult.rows.length === 1 && checkResult.rows[0].assethistory === 'Available')
        {
        const assetName = checkResult.rows[0].assetname;
        const assetType =checkResult.rows[0].assettype;
        const addAssetData = 'INSERT INTO ASSETHISTORYLIST(assetid,assettype,assetname,employeeid,assethistory,date,active) VALUES($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,$6) RETURNING *'     
        const assetHistory = "In Use";
        const active=true;
        const result=await client.query(addAssetData, [assetId,assetType,assetName,employeeId,assetHistory,active]);
        const updatedData = result.rows[0];
        res.status(201).json(updatedData);
        }
        else
        {
        res.status(404).send("Asset is in use or Defective");
        }
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("Internal Server Error");
    }
};

export{ getEmployers,addEmployers,updateEmployers,getActiveEmployers,getInActiveEmployers,updateActiveStatus,addAssettoEmployer};