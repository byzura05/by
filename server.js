const express = require('express');

const morgan  = require('morgan')

const app = express();
app.use(morgan('combined'))

//check oracle connection
const oracledb = require('oracledb');
// bqmdev schema password
var password = 'Tm1m5u5R' 
// checkConnection asycn function
try {
  oracledb.initOracleClient({libDir: 'C:\\Users\\S53904\\Documents\\gitHUB\\POCExpressRestapi\\instantclient_19_6'});
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}

  

async function makeConnection() {
  try {
    connection = await oracledb.getConnection({
        user: "TMIMS",
        password: password,
        connectString: "127.0.0.1:1527/BQMDEV"
    });
    console.log('connected to database');
  } catch (err) {
    console.error(err.message);
  } finally {
    if (connection) {
      // try {
      //   // Always close connections
      //   await connection.close(); 
      //   console.log('close connection success');
      // } catch (err) {
      //   console.error(err.message);
      // }

    //   connection.execute(
    //     `SELECT *
    //      FROM DC_LOCATION`,
    //     [],  
    //    function(err, result) {
    //       if (err) {
    //         console.error(err.message);
    //         return;
    //       }
    //       console.log(result.rows);
    //    });
  
     }
  }

  
  

}

makeConnection()


//rest api to output table location

// const callapi = app.get('/api/location',(req,res)=>{

//   connection.execute(
//     `SELECT *
//      FROM DC_LOCATION`,
//     [],  
//    function(err, result) {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       console.log(result.rows);
//       res.send(result);
//    });
// })
const callapi = app.get('/api/invt_cage',(req,res)=>{

  connection.execute(
    `select 
    CAGE_ID,
    (SELECT SITE_NAME FROM DC_SITE WHERE SITE_ID=CAGE_SITE_ID) as SITE_NAME,
    (SELECT LOCN_NAME FROM DC_LOCATION WHERE LOCN_ID=CAGE_LOCN_ID) as LOCATION_NAME,
    CAGE_NO,
    CAGE_SUITE_NO,
    CAGE_NO_RACK,
    CAGE_CONTRACTUAL_POWER,
    CAGE_CONTRACTUAL_SPACE_SIZE,
    CAGE_STATUS,
    CAGE_SERVICEID,
    (select cusr_name from dc_customer where cusr_id=cage_cusr_id) customer_name,
    CAGE_CREATED_BY,
    CAGE_CREATED_DT
    from dc_cage `,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_crac',(req,res)=>{

  connection.execute(
    `select * from (
      select 
      CRAC_ID,
      CRAC_NAME,
      (select site_name from dc_site where site_id=CRAC_SITE_ID) as site_name,
      (SELECT 
      LISTAGG(b.locn_name, ',') WITHIN GROUP (ORDER BY locn_name)
      FROM dc_location_multi d,dc_location b
      where d.multi_oth_id=t.crac_id
      and d.multi_locn_id=b.locn_id) as location_name,
      CRAC_AREA,
      CRAC_KW,
      CRAC_QUANTITY,
      CRAC_COOL_CAPACITY,
      CRAC_BRAND,
      CRAC_TYPE,
      CRAC_STATUS,
      CRAC_DESC,
      CRAC_COMM_DT,
      CRAC_DECOMM_DT,
      to_char(CRAC_CREATED_DT) as CRAC_CREATED_DT,
      CRAC_CREATED_BY,
      to_char(CRAC_UPDATED_DT) as CRAC_UPDATED_DT,
      CRAC_UPDATED_BY
      from DC_CRAC t)`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_dashinfo',(req,res)=>{

  connection.execute(
    `select * from DC_EX_SUMMARY`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_location',(req,res)=>{

  connection.execute(
    `select 
    LOCN_ID,
    LOCN_NAME,
    (select site_name from dc_site where site_id=LOCN_SITE_ID) as SITE_NAME,
    LOCN_TYPE,
    LOCN_SPACE_CAPACITY,
    LOCN_STATE,
    LOCN_STATUS,
    LOCN_DESC,
    to_char(LOCN_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as LOCN_CREATED_DT,
    LOCN_CREATED_BY,
    LOCN_SPACE_UTILIZATION,
    LOCN_SPACE_AVAILABLE,
    (select DBMS_LOB.substr(atth_file, 4000) from dc_attachment where ATTH_FOREIGNID=t.LOCN_ID and ATTH_TYPE='FLOOR_PLAN' and ATTH_TABLENAME='DC_LOCATION') as LOCN_FLOOR_PLAN,
    (select DBMS_LOB.substr(atth_file, 4000) from dc_attachment where ATTH_FOREIGNID=t.LOCN_ID and ATTH_TYPE='RACK_UTILIZATION' and ATTH_TABLENAME='DC_LOCATION') as LOCN_RACK_UTILIZATION,
    to_char(LOCN_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as LOCN_COMM_DT,
    to_char(LOCN_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as LOCN_DECOMM_DT,
    to_char(LOCN_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as LOCN_UPDATED_DT,
    LOCN_UPDATED_BY
    from DC_Location t`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_ntwbandwidth',(req,res)=>{

  connection.execute(
    `select 
    NTW_ID,
    (select site_name from dc_site where site_id=t.NTW_SITE_ID) as site_name,
    NTW_NAME,
    NTW_BANDWIDTH,
    NTW_STATUS,
    NTW_DESC,
    to_char(NTW_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_CREATED_DT,
    NTW_CREATED_BY,
    to_char(NTW_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_UPDATED_DT,
    NTW_UPDATED_BY,
    to_char(NTW_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_COMM_DT,
    to_char(NTW_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_DECOMM_DT
    from dc_bandwidth t`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_pdu',(req,res)=>{

  connection.execute(
    `select * from (
      select 
      PDU_ID,
      PDU_NAME,
      (select site_name from dc_site where site_id=PDU_SITE_ID) as site_name,
      (SELECT 
      LISTAGG(b.locn_name, ',') WITHIN GROUP (ORDER BY locn_name)
      FROM dc_location_multi d,dc_location b
      where d.multi_oth_id=t.pdu_id
      and d.multi_locn_id=b.locn_id) as location_name,
      PDU_CODE,
      PDU_FUSE,
      PDU_USER_RACK,
      PDU_STATUS,
      PDU_DESC,
      to_char(PDU_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_CREATED_DT, 
      PDU_CREATED_BY,
      to_char(PDU_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_UPDATED_DT, 
      PDU_UPDATED_BY,
      to_char(PDU_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_COMM_DT,
      to_char(PDU_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_DECOMM_DT
      from DC_PDU t)`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_rack',(req,res)=>{

  connection.execute(
    `select
    RACK_ID,
    (select a.site_name from dc_site a where a.site_id=t.RACK_SITE_ID) SITE_NAME,
    (select d.locn_name from dc_location d where d.locn_id=RACK_LOCN_ID) as LOCATION_NAME,
    RACK_NO,
    RACK_STATUS,
    RACK_ROOM,
    RACK_TYPE,
    RACK_SIZE,
    RACK_POWER_DENSITY,
    RACK_BREAKER_TYPE,
    RACK_POWER_PHASE,
    RACK_CABLE_ID,
    RACK_PDU_A,
    RACK_PDU_B,
    RACK_SOURCE_A,
    RACK_SOURCE_B,
    RACK_POWER_PRELAID,
    RACK_CABLING_PRELAID,
    RACK_DESC,
    RACK_CONTRACTUAL_POWER,
    RACK_SERVICEID,
    (select c.cusr_name from dc_customer c where c.cusr_id=t.RACK_CUSR_ID) as rack_customer,
    to_char(RACK_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as RACK_COMM_DT ,	
    to_char(RACK_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as RACK_DECOMM_DT,		
    to_char(RACK_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am')as RACK_UPDATED_DT,
    RACK_UPDATED_BY,	
    to_char(RACK_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as RACK_INSERT_DT,
    RACK_CREATED_BY as RACK_INSERT_BY
    from DC_RACK t`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_ntwport',(req,res)=>{

  connection.execute(
    `SELECT 
    PORT_ID,
    (select ntw_name from dc_bandwidth where ntw_id=PORT_NTW_ID) as ntw_name,
    PORT_NO,
    (select site_name from dc_site where site_id=PORT_SITE_ID) as site_name,
    PORT_NTW_TYPE,
    PORT_CAB_PRELAID,
    PORT_STATUS,
    PORT_DESC,
    PORT_SERVICEID,
    (select cusr_name from dc_customer where cusr_id=PORT_CUSR_ID) as customer_name,
    PORT_BANDWIDTH,
    to_char(PORT_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_CREATED_DT,
    PORT_CREATED_BY,
    to_char(PORT_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_UPDATED_DT,
    PORT_UPDATED_BY,
    to_char(PORT_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_COMM_DT,
    to_char(PORT_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_DECOMM_DT
    FROM DC_NETWORK_PORT`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/invt_site',(req,res)=>{

  connection.execute(
    `select 
    site_id, 
    site_name, 
    site_desc, 
    site_mgr, 
    site_mgr_no, 
    site_status,  
    site_total_space_cap, 
    site_total_power_cap, 
    SITE_VERIFIED_BY,
    to_char(SITE_VERIFIED_DT,'dd/mm/yyyy hh:mi:ss am') as SITE_VERIFIED_DT,
    to_char(site_created_dt,'dd/mm/yyyy hh:mi:ss am') as site_created_dt, 
    site_created_by,
    to_char(site_updated_dt,'dd/mm/yyyy hh:mi:ss am') as site_updated_dt, 
    site_updated_by,
    to_char(site_updated_dt,'dd/mm/yyyy hh:mi:ss am') as site_updated_dt, 
    to_char(SITE_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as SITE_DECOMM_DT, 
    to_char(SITE_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as SITE_COMM_DT, 
    adde_type, 
    adde_no, 
    adde_floor, 
    adde_building, 
    adde_sttype||' '||adde_stname as adde_stname, 
    adde_postcode, 
    adde_section, 
    adde_city, 
    adde_state,
    (case when adde_no is not null then adde_no||',' else '' end)||
    (case when adde_floor is not null then adde_floor||',' else '' end)||
    (case when adde_building is not null then adde_building||',' else '' end)||
    adde_sttype||' '||adde_stname||','||
    adde_postcode||','||
    adde_section||','||
    adde_city||','||adde_state
       as full_address 
    from DC_SITE t
    left join dc_addresses a on t.site_adde_id=a.adde_id `,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const callapi = app.get('/api/ups',(req,res)=>{

  connection.execute(
    `select * from (
      SELECT 
      UPS_ID,
      UPS_NAME,
      (select site_name from dc_site where site_id=UPS_SITE_ID) as site_name,
      (SELECT 
      LISTAGG(b.locn_name, ',') WITHIN GROUP (ORDER BY locn_name)
      FROM dc_location_multi d,dc_location b
      where d.multi_oth_id=a.ups_id
      and d.multi_locn_id=b.locn_id) as location_name,
      UPS_POWER_CAPACITY,
      UPS_POWER_UTILIZED,
      UPS_POWER_AVAILABLE,
      UPS_BRAND,
      UPS_MODEL,
      UPS_STATUS,
      UPS_DESC,
      to_char(UPS_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_CREATED_DT,
      UPS_CREATED_BY,
      to_char(UPS_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_UPDATED_DT,
      UPS_UPDATED_BY,
      to_char(UPS_COMM_DT,'MM/dd/yyyy') as UPS_COMM_DT,
      to_char(UPS_DECOMM_DT,'MM/dd/yyyy') as UPS_DECOMM_DT,
      to_char(UPS_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_COMM_DT_TV,
      to_char(UPS_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_DECOMM_DT_TV
      FROM  DC_UPS a)`,
    [],  
   function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result.rows);
      res.send(result);
   });
})

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));