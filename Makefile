### Variables ------------------------------------------------------------------

PUBLISH =           git push && npm publish
COMPRESSJS =        uglifyjs -mc warnings=false

### Tasks ----------------------------------------------------------------------

.PHONY:             default publish publish-patch

default:\
	dist/parser.min.js\



publish:\

	$(PUBLISH)


publish-patch:\

	npm version patch && $(PUBLISH)


### Targets --------------------------------------------------------------------

dist/parser.min.js:\
	dist/parser.js\

	$(COMPRESSJS) "$^" > "$@"
