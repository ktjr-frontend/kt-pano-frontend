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
            if (!bsnsCard) return
            var data = {
                business_card_url: bsnsCard
            }

            xhr.open('PUT', '/api/v1/upload_business_card')
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
            xhr.setRequestHeader('Authorization', token)
            xhr.send(JSON.stringify(data))
            xhr.onload = function () {
                container.classList.remove('preview')
                container.classList.add('done')
            }
        })

        // 重新上传
        reUploadBtn.addEventListener('click', function(ev) {
            ev.preventDefault()
            bsnsCard = ''
            container.classList.remove('preview')
        })

        // 选了图片自动上传
        file.addEventListener('change', function(ev) {
            var oData = new FormData(form)
            xhr.open('POST', '/api/v1/upload_business_card', true)
            xhr.setRequestHeader('Authorization', token)
            xhr.onload = function(oev) {
                if (xhr.status === 200) {
                    bsnsCard = oev.data.url
                    previewImg.src = bsnsCard
                    container.classList.add('preview')
                }
            }

            xhr.send(oData)
            ev.preventDefault()
        })
    })
})(window, document);
