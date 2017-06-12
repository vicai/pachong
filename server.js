import cheerio from 'cheerio';
import concat from 'concat-files';
import csv from 'csv-parser';
import fs from 'fs';
import json2csv from 'json2csv';
import jsonexport from 'jsonexport';
import Promise from 'bluebird';
import request from 'superagent';
import stringify from 'csv-stringify';
require('superagent-charset')(request)

const getCertificate = (id, url) => {
  return Promise.resolve(
    request.get(url)
    .retry(5)
    .charset('gbk')
    .then((response) => {
      console.log(`***start fetching certificate ${id}`);
      let contentMap = {};
      if (!response || !response.res || !response.res.text) {
        return contentMap;
      }
      var $ = cheerio.load(response.res.text);
      $('#content table tbody tr').map((i, row) => {
        let key = $(row).children().first().text().trim();
        let value = $(row).children().last().text().trim();
        if (!key) {
          console.log(`***error parsing certificate ${id}, key: ${key}, value: ${value}`);
        }
      });
      return contentMap;
    }, (err) => {
      console.log(`***error fetching certificateId${id}: ${err}`)
    })
  );
}

// Make a request for a user with a given ID 1100 ~ 3100
const getAllCertificate = (csvFilePath, url, startId, endId) => {
  return Promise.all(Array(endId).fill(0).map((v, i) => i).filter(i => (i >= startId)).map(i => getCertificate(i, url)))
    .then(certificateArr => {
      const fields = certificateArr.reduce((certificate) => {
        if (certificate && Object.keys(certificate).length !== 0) {
          return Object.keys(certificate);
        }
      }, [])
      const csvData = json2csv({
        data: certificateArr,
        fields: fields,
        del: '\t'
      });
      return csvData;
    });
}

const generateCSV = (startId, endId) => {
  const url = `http://www.caepi.org.cn/certification/detail/${id}.html`;
  const csvFilePath = '/Users/weiqic/Documents/Github/crawler/certificates.csv';
  Promise.resolve(getAllCertificate(csvFilePath, url, startId, endId)).then((csvData) => {
    fs.appendFile(csvFilePath, csvData, (error) => {
        if (error) {
          console.log('***error when parsing', error);
        }
    });
    console.log('***done!');
  });
}

const concatCSV = () => {
  concat([
    '/Users/weiqic/Documents/Github/crawler/certificates_1.csv',
    '/Users/weiqic/Documents/Github/crawler/certificates_2.csv',
    '/Users/weiqic/Documents/Github/crawler/certificates_3.csv',
  ], '/Users/weiqic/Documents/Github/crawler/certificates.csv', function(err) {
    if (err) throw err
    console.log('done');
  });
}

concatCSV();
