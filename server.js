import $ from "jquery";
import asset from 'assert';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Iconv } from 'iconv';
import { jsdom } from 'jsdom';

// Make a request for a user with a given ID
const iconv = new Iconv('UTF-8', 'GB2312');
axios({
  method: 'get',
  url: 'http://www.caepi.org.cn/certification/detail/3075.html',
  headers: {
    'Content-Type': 'text/html; charset=gb2312'
  }
}).then((reponse) => {
    console.log($('#id').text(reponse.data));
  }).catch(function (error) {
    console.log(error);
  });
