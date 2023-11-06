const { Router } = require('express');
const router = Router();
var con=require('../databases/database');
const { route } = require('express/lib/application');
const bodyParser = require('body-parser');
const moment = require('moment');
//123

router.get('/dashboard/:userid/reports', (req,res) => {
    const userid=req.params.userid;
    console.log(userid);
    const query='select user_report_id, report_description, date_time, sub_location_name, incident_subtype_description, incident_criticality_level, image, status from user_report ur join users u on ur.user_id=u.user_id join sub_location sl on ur.sub_location_id=sl.sub_location_id join incident_subtype ist on ur.incident_subtype_id=ist.incident_subtype_id join incident_criticality ic on ur.incident_criticality_id=ic.incident_criticality_id where ur.user_id=? order by user_report_id desc';
    // const query='call fetchReports(?)';
    con.query(query,[userid],(error, results) => {
        if(error){
            console.log(error);
            return res.status(500).json({ status: 'Internal server error' });
        }
        var result = JSON.parse(JSON.stringify(results));
        console.log(result.length)
        console.log(result)      
        return res.status(200).json(result);
    });
});

router.get('/dashboard/allReports', (req,res) => {
    const query='select user_report_id, report_description, date_time, sub_location_name, incident_subtype_description, incident_criticality_level, image, status from user_report ur join sub_location sl on ur.sub_location_id=sl.sub_location_id join incident_subtype ist on ur.incident_subtype_id=ist.incident_subtype_id join incident_criticality ic on ur.incident_criticality_id=ic.incident_criticality_id order by user_report_id desc';
    // const query='call fetchReports(?)';
    con.query(query,(error, results) => {
        if(error){
            console.log(error);
            return res.status(500).json({ status: 'Internal server error' });
        }
        var result = JSON.parse(JSON.stringify(results));
        console.log(result.length)
        console.log(result)      
        return res.status(200).json(result);
    });
});


router.post('/dashboard/:userid/MakeReport', (req,res) => {
    const report_description=req.body.report_description;
    const jsondate_time=req.body.date_time;
    const sub_location_id=req.body.sub_location_id;
    const incident_subtype_id=req.body.incident_subtype_id;
    const incident_criticality_id=req.body.incident_criticality_id;
    const image=req.body.image;
    const user_id=req.params.userid;
    console.log(user_id);

    //convert date_time to mysql format
    const momentobj=moment(jsondate_time,moment.ISO_8601);
    const mysqldatetime=momentobj.format('YYYY-MM-DD HH:mm:ss');
    // Convert the base64 image to binary data (Buffer)
    const imageBufferBinaryForm = Buffer.from(image, 'base64');

    const query='insert into user_report(report_description, date_time, incident_subtype_id, sub_location_id, incident_criticality_id, image, user_id) values (?,?,?,?,?,?,?)';
    const values=[report_description,mysqldatetime,incident_subtype_id,sub_location_id,incident_criticality_id,imageBufferBinaryForm,user_id];
    con.query(query, values, (error,results) => {
        if(error){
            console.log(error);
            console.log('error in making report');
            return res.status(500).json({status: 'error inserting'});
        }
        console.log(results)
        return res.status(200).json({status: 'report submitted'});
    })
});

router.get('/dashboard/fetchsublocations', (req,res) => {
    const location_id=req.query.location_id;
    const query='select sub_location_id, sub_location_name, l.location_name from sub_location sl join location l using(location_id) where location_id=?';
    con.query(query, [location_id], (error,results) => {
        if(error){
            console.log(error);
            console.log('error in fetching sublocations');
            return res.status(500).json({status: 'Internal Server Error'});
        }
        var result = JSON.parse(JSON.stringify(results));
        console.log(result.length)
        console.log(result)      
        return res.status(200).json(result);
    });
});

router.get('/dashboard/fetchlocations', (req,res) => {
    const query='select location_id, location_name from location';
    con.query(query, (error,results) => {
        if(error){
            console.log(error);
            console.log('error in fetching locations');
            return res.status(500).json({status: 'Internal Server Error'});
        }

        var result = JSON.parse(JSON.stringify(results));
        console.log(result.length)
        console.log(result)      
        return res.status(200).json(result);
    });
});

router.get('/dashboard/fetchincidentType', (req,res) => {
    const query='select incident_type_id, incident_type_description from incident_type';
    con.query(query, (error,results) => {
        if(error){
            console.log(error);
            console.log('error in fetching incident types');
            return res.status(500).json({status: 'Internal Server Error'});
        }
        var result = JSON.parse(JSON.stringify(results));
        console.log(result.length)
        console.log(result)      
        return res.status(200).json(result);
    });
});

router.get('/dashboard/fetchincidentsubType', (req,res) => {
    const incident_type_id=req.query.incident_type_id;
    console.log(incident_type_id)
    const query='select incident_subtype_id, incident_subtype_description, itt.incident_type_description from incident_subtype iss join incident_type itt using(incident_type_id) where incident_type_id=?';
    con.query(query,[incident_type_id], (error,results) => {
        if(error){
            console.log(error);
            console.log('error in fetching subincident types');
            return res.status(500).json({status: 'Internal Server Error'});
        }
        var result = JSON.parse(JSON.stringify(results));
        console.log(result.length)
        console.log(result)      
        return res.status(200).json(result);
    });
});

module.exports = router;