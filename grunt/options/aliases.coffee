module.exports =
    'js:build':
        [
            'hint'
            'jsstyle'
            'concat:jsLib'
            'copy:jsCore'
            'copy:jsPlugins'
            'replace:jsCoreBuild'
            'replace:ckan'
            'replace:ckanClean'
            'notify:js'               
        ]
