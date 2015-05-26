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

