.PHONY = default

default:\

	echo "Nothing yet."


.PHONY += publish
publish:\

	git push
	npm publish
