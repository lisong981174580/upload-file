import { promiseAjax } from 'browser-request-utils';

// 源码：https://github.com/lisong981174580/download-picture
import downloadPicture from 'dl-pictures'; 
import './index.less';

const upload = document.querySelector('.upload');
const imgsWrapper = document.querySelector('.imgs-wrapper');
const dialog = document.querySelector('.dialog-wrapper');
const cancel = document.querySelector('.cancel');
const okBtn = document.querySelector('.okBtn');
const fileInput = document.querySelector('.file');

upload.onclick = function() {
  dialog.classList.add('show-dialog');
}

cancel.onclick = function() {
  dialog.classList.remove('show-dialog');
}

okBtn.onclick = function() {
  // const form = document.getElementById("myForm"); // 获取页面已有的一个 form 表单
  // const formData = new FormData(form); // 用表单来初始化
  // console.log(formData.get('file')); //  获取 key 为 file 的第一个值
  // console.log(formData.getAll('file')); // 返回一个数组，获取 key 为 file 的所有值

  const file = fileInput?.files?.[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', 'allen');

  sendFormData(formData, '/imgs/upload').then(res => {
    queryImages();
    dialog.classList.remove('show-dialog');
  });
}

/** 
 * @method 上传文件
 */
function sendFormData(formData, url) {
  return new Promise((resolve, reject) => {
    const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    
    // 第三个参数 false 是表示同步，true表示异步  也是默认值。
    xhr.open('post', process.env.NODE_ENV === 'development' ? `/api${url}` : url);

    // 发送数据
    xhr.send(formData);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status == 200 || xhr.status == 304) {
          try {
            resolve(JSON.parse(xhr.responseText)); // 默认后段要返回可解析的 json 字符串
          } catch (error) {
            reject();
          }
        }
      }
    }
  })
}

queryImages();

/** 
 * @method 查询 img 列表
 */
function queryImages() {
  request({
    method: 'get',
    url: '/imgs/select/base64'
  }).then((res = {}) => {
    imgsWrapper.innerHTML = '';
    
    if (Array.isArray(res.list)) {
      res.list.forEach(insertImgElem);
    }
  }).catch(error => {
    console.error(error);
  })
}

/** 
 * @method 页面中插入 img
 */
function insertImgElem(imgFile) {
  const img = new Image();

  img.src = imgFile;
  img.classList.add('img');
  img.setAttribute('title', '点击下载');
  img.onclick = function() {
    downloadPicture(img.src);
  }

  const item = document.createElement('div');

  item.classList.add('img-wrapper');
  item.appendChild(img);

  imgsWrapper.appendChild(item);
}

/** 
 * @method 网络请求
 */
function request(params = {}) {
  return new Promise((resolve, reject) => {
    promiseAjax({
      ...params,
      url: process.env.NODE_ENV === 'development' ? `/api${params.url}` : params.url,
    }).then(res => resolve(res))
    .catch(error => reject(error));
  })
}

import { sum } from './lib/sum';
sum(1, 2);
