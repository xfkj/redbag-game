import {Toast} from 'mint-ui'

export function set_page_title(title) {
    document.title = title;
    let iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.src = '//m.baidu.com/favicon.ico';
    iframe.onload = () => {
        setTimeout(() => {
            iframe.remove();
        }, 10);
    };
    document.body.appendChild(iframe);
}

export function toast(message) {
  return Toast({
    message,
    position: 'top',
    duration: 2400
  });
}
