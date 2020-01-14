---
to: packages/<%= h.changeCase.paramCase(name) %>/CHANGELOG.md
---
<% pluginName = h.changeCase.paramCase(name) %>
<% if (!locals.version){ locals.version = '0.0.1'} %>
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## <%= locals.version %> - <%= date %>
### Added
- Created new plugin @ima/<%= pluginName %>
