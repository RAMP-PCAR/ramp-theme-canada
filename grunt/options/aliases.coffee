module.exports =
    
    'js:build:after': [ 'replace:ckan', 'replace:ckanClean' ]
    'assemble:extra': [ 'assemble:ckan' ]
