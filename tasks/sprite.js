module.exports = {
    options: {
        imagepath: 'app/images/slice/',
        imagepath_map: null,
        spritedest: 'app/images/',
        spritepath: '/images/',
        padding: 10,
        useimageset: false,
        newsprite: false,
        spritestamp: true,
        cssstamp: true,
        algorithm: 'top-down',
        engine: 'pixelsmith'
    },
    landingIcons: {
        files: [{
            expand: true,
            cwd: 'app/less/',
            src: ['theme/v*/icon_img.css'],
            dest: 'app/less/',
            ext: '.sprite.css'
        }]
    }
};
