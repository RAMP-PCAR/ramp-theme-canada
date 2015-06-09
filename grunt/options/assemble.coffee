module.exports =

    ajaxWetTheme:
        options:
            flatten: true
            layoutdir: '<%= pkg.core.wet %>site/layouts'
            layout: 'ajax.hbs'
            i18n: null

        expand: true
        cwd: '<%= pkg.theme.wet %>site/pages/ajax'
        dest: 'build/ajax/'
        src: '*.hbs'

    ckan:
        options:
            assets: 'build/js/lib/wet-boew'
            rampAssets: 'assets'
            
            environment:
                jqueryVersion: '2.1.1'
            flatten: true
            plugins: ['assemble-contrib-i18n']
            layout: 'jinja.hbs'
            i18n:
                languages: ['en', 'fr']
                templates: [ 'site/pages/ramp.hbs' ]
        dest: 'build/ckan/'
        src: '!*.*'
