module.exports =
    ckan:
        options:
            patterns: [
                match: /\="\.\/assets/g
                replacement: '="{{ramp_server}}./assets'
            ]
        files: [
            expand: true
            cwd: 'build/ckan'
            src: '*.html'
            rename: (dest, src) ->
                        'build/' + src.replace('.html', '-ckan.html');
        ]

    ckanClean:
        options:
            patterns: [
                match: /{{.*}}/g
                replacement: ''
               ,
                match: /{%.*%}/g
                replacement: ''
            ]
            usePrefix: false
        files: [
            expand: true
            cwd: 'build'
            src: 'ramp-*-ckan.html'
            rename: (dest, src) ->
                        'build/' + src.replace('-ckan.html', '-test.html');
        ]
