;
(function(w, d) {
    function isAndroidWeixn() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/Android.*MicroMessenger/i)) {
            return true;
        }
        return false
    }

    d.addEventListener('DOMContentLoaded', function() {
        if (isAndroidWeixn()) {
            d.querySelector('html').classList.add('weixin')
        }
        var tm = location.href.match(/_t=(.*)/)
        var token = tm ? tm[1] : ''
        var bsnsCard = ''
        var container = d.querySelector('.container')
        var previewImg = d.querySelector('.business-card-preview img')
        var file = d.querySelector('#file')
        var form = d.forms.namedItem('uploadBusinessCardForm')
        var doneBtn = d.querySelector('#doneBtn')
        var reUploadBtn = d.querySelector('#reUploadBtn')
        var xhr = new XMLHttpRequest()

        // 确认完成
        doneBtn.addEventListener('click', function(ev) {
            ev.preventDefault()

            var oData = new FormData(form)
            xhr.open('POST', '/api/v1/upload_business_card', true)
            xhr.setRequestHeader('Authorization', token)
            xhr.onload = function(oev) {
                if (xhr.status === 200) {
                    bsnsCard = oev.data.url
                    previewImg.src = bsnsCard
                    container.classList.remove('preview')
                    container.classList.add('done')
                    this.disabled = false
                }
            }
            // container.classList.remove('preview')
            // container.classList.add('uploading')
            this.disabled = true
            // reUploadBtn.disabled = true
            this.innerHTML = '上传中<i class="dotting"></i>'
            this.classList.add('ajax')
            xhr.send(oData)
        })

        // 重新上传
        reUploadBtn.addEventListener('click', function(ev) {
            ev.preventDefault()
            bsnsCard = ''
            doneBtn.disabled = false
            doneBtn.innerHTML = '完成'
            xhr.abort()
            container.classList.remove('preview')
            form.reset()
        })

        // 选了图片预览
        file.addEventListener('change', function(ev) {
            var reader = new FileReader()
            reader.addEventListener('load', function () {
                previewImg.src = reader.result
                container.classList.add('preview')
            })

            if (file.files[0]) {
                reader.readAsDataURL(file.files[0])
            }


            ev.preventDefault()
        })
    })
})(window, document);
