import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ImAsher@18',
    port: '5432'
});

client.connect();

export function initializeTables() {

    const employersList = `
    CREATE TABLE IF NOT EXISTS EMPLOYERSLIST(
    id VARCHAR(255) PRIMARY KEY,
    employeeid VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    active BOOLEAN)`;

const assetList = `
    CREATE TABLE IF NOT EXISTS ASSETLIST(
        id VARCHAR(255) PRIMARY KEY,
        assetid VARCHAR(255) NOT NULL,
        assettype VARCHAR(255) NOT NULL,
        assetname VARCHAR(255) NOT NULL,
        active BOOLEAN)`;

const assetHistoryList = `
        CREATE TABLE IF NOT EXISTS ASSETHISTORYLIST(
            assetid VARCHAR(255) NOT NULL,
            assettype VARCHAR(255) NOT NULL,
            assetname VARCHAR(255) NOT NULL,
            employeeid VARCHAR(255),
            assethistory VARCHAR(255) NOT NULL,
            date TIMESTAMP,
            active BOOLEAN)`;

client.query(employersList, (err, res) => {
    if (err) {
        console.log("Error in creating table", err);
    }
    console.log("Employer Table Created Successfully");
});

client.query(assetList, (err, res) => {
    if (err) {
        console.log("Error in creating table", err);
    }
    console.log("Asset Table Created Successfully");
});

client.query(assetHistoryList, (err, res) => {
    if (err) {
        console.log("Error in creating table", err);
    }
    console.log("Asset History Table Created Successfully");
});
}

export default client;
