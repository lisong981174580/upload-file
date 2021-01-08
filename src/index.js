import { promiseAjax } from 'browser-request-utils';
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
 * @method 图片下载
 */
const uploadImg = (src) => {
  const image = new Image();

  // 解决跨域 canvas 污染问题，加 crossOrigin = anonymous 表明想跨域获取这张图片，好用在canvas.toDataURL()上，但是服务端不一定同意，故需要服务器端支持，请求返回头部要有：Access-Control-Allow-Origin: *
  image.setAttribute('crossOrigin', 'anonymous');

  image.onload = () => {
    const canvas = document.createElement('canvas');

    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);

    const url = canvas.toDataURL('image/png'); // 得到图片的 base64 编码数据
    const a = document.createElement('a'); // 生成一个 a 标签
    const event = new MouseEvent('click'); // 创建一个点击事件

    a.download = new Date().getTime(); // 设置下载后的图片名称，此处使用时间戳
    a.href = url; // 将生成的 URL 设置为 a.href 属性
    a.dispatchEvent(event); // 触发 a 的点击事件
  };

  image.src = src;
};

/** 
 * @method 页面中插入 img
 */
function insertImgElem(imgFile) {
  const img = new Image();

  img.src = imgFile;
  img.classList.add('img');
  img.setAttribute('title', '点击下载');
  img.onclick = function() {
    uploadImg(img.src);
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





