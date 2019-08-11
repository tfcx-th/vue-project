import jsonp from 'common/js/jsonp';
import {options, commonParams} from 'api/config';
import axios from 'axios';

// const debug = process.env.NODE_ENV !== 'production'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5'
  });

  return jsonp(url, data, options);
}

export function search(query, page, zhida, perpage) {
  const url = '/api/search';

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}