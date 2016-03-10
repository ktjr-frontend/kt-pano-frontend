describe('kaitong homepage', function() {
    it('should have a title', function() {
        browser.get('http://127.0.0.1:9000');
        expect(browser.getTitle()).toEqual('开通金融 | 首页');
    });
});
