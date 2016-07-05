;
(function(w, d) {

    function isAndroidWeixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/Android.*MicroMessenger/i)) {
            return true;
        }
        return false
    }

    d.addEventListener('DOMContentLoaded', function() {
        if (isAndroidWeixin()) {
            d.querySelector('html').classList.add('weixin')
        }

        var tm = location.href.match(/_t=(.*)/)
        var token = tm ? tm[1] : ''
        var bsnsCard = ''
        var container = d.querySelector('.container')
        var previewImg = d.querySelector('.business-card-preview img')
        var file = d.querySelector('#file') // 上传名片域
        var form = d.forms.namedItem('uploadBusinessCardForm')
        var doneBtn = d.querySelector('#doneBtn')
        var reUploadBtn = d.querySelector('#reUploadBtn')
        var xhr = new XMLHttpRequest()

        // 确认完成
        doneBtn.addEventListener('click', function(ev) {
            ev.preventDefault()
            var oData = new FormData(form)
            oData.append('token', token)
            xhr.open('POST', '/api/v1/cards', true)
                // xhr.setRequestHeader('Authorization', token)
            xhr.onload = function(oev) {
                var data = JSON.parse(oev.currentTarget.responseText)
                if (xhr.status === 201) {
                    bsnsCard = data.card_url
                    previewImg.src = bsnsCard
                    container.classList.remove('preview')
                    container.classList.add('done')
                    this.disabled = false
                }
            }

            this.disabled = true
            this.innerHTML = '上传中<i class="dotting"></i>'
            this.classList.add('pending')
            xhr.send(oData)
        })

        // 重新上传
        reUploadBtn.addEventListener('click', function(ev) {
            ev.preventDefault()

            bsnsCard = ''
            container.classList.remove('preview')
            doneBtn.disabled = false
            doneBtn.innerHTML = '完成'
            xhr.abort()
            form.reset()
        })

        // 选了图片预览
        file.addEventListener('change', function(ev) {
            var reader = new FileReader()
            reader.addEventListener('load', function() {
                previewImg.src = reader.result
                file.disabled = false
                container.classList.remove('preparing')
                container.classList.add('preview')
            })

            if (file.files[0]) {
                file.disabled = true
                container.classList.add('preparing')
                setTimeout(function() {
                    reader.readAsDataURL(file.files[0])
                }, 50)
            }

            ev.preventDefault()
        })
    })
})(window, document);
