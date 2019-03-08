(function (window, document) {
    /**
     * 屏蔽IOS滑动和点击穿透 一般用于mask上
     * @param {string} query 关键字 .class #id  
     */
    function banIOStouchPenetrate(query) {
        document.querySelector(query).addEventListener('touchmove', function (e) {
            e.stopPropagation()
            e.preventDefault()
        })
        document.querySelector(query).addEventListener('click', function (e) {
            e.stopPropagation()
            e.preventDefault()
        })
    }

    /**
     *  剪切图片白边 written by cc712 2018/10/11
     * @param {String} str url base64 都可以 
     * @param {Function} callback 传递处理过的base64 
     */
    function canvasClipImg(str, callback) {
        //新建canvas 插入document
        let canvas = document.getElementById('_canvasClip');
        let cw = 2000,
            ch = 1000;
        //居中偏移
        const OFFSET = 10;
        if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.style.display = 'none';
            document.body.appendChild(canvas)
            canvas.setAttribute('id', '_canvasClip');
            //分辨率
            canvas.setAttribute('width', cw);
            canvas.setAttribute('height', ch);
        }
        let ctx = canvas.getContext('2d');
        //type base64 png jpg
        let img = new Image();
        img.src = str;
        img.crossOrigin = "Anonymous";
        img.onload = function () {
            //识别白边 获得边界
            //导入图片
            ctx.drawImage(img, 0, 0, cw, ch);
            let imageData = ctx.getImageData(0, 0, cw, ch);
            let pixels = imageData.data
            let length = imageData.data.length / 4;
            //inital x y 
            let minX = cw,
                minY = ch,
                maxX = 0,
                maxY = 0;
            //得到边界坐标
            for (let i = 0; i < length; i++) {
                let r, g, b;
                r = pixels[4 * i]
                g = pixels[4 * i + 1]
                b = pixels[4 * i + 2]
                let x, y;
                x = i % cw;
                y = ~~(i / cw);
                // console.log(r, g, b)
                if (r < 255 || g < 255 || b < 255) {
                    minX = Math.min(x, minX);
                    minY = Math.min(y, minY);
                    maxX = Math.max(x, maxX);
                    maxY = Math.max(y, maxY);
                }
            }
            //裁剪 重新绘制在该canvas上
            // imageData = ctx.getImageData(minX, minY, maxX - minX, maxY - minY);
            console.log('size', minX, maxX, minY, maxY)
            // ctx.putImageData(imageData,5,5,5,5,cw,ch);
            ctx.drawImage(canvas, minX - OFFSET, minY - OFFSET, maxX - minX + 2 * OFFSET, maxY - minY + 2 * OFFSET, 0, 0, cw, ch)
            //导出 base64
            let new_base64 = canvas.toDataURL('image/png', 0.5);
            //异步出口
            callback(new_base64)
        }
    }

    //export 
    window.clibrary = {
        banIOStouchPenetrate,
        canvasClipImg
    }
})(window, document)